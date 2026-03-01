"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { applicationSchema, type ApplicationInput } from "@/lib/validators";

export async function applyToProject(
  projectId: string,
  data: ApplicationInput
) {
  // Server-side validation
  const parsed = applicationSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "資料驗證失敗，請檢查輸入內容" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "請先登入" };

  const { data: vendorProfile } = await supabase
    .from("vendor_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!vendorProfile) return { error: "請先完成廠商資料填寫" };

  const { error } = await supabase.from("applications").insert({
    project_id: projectId,
    vendor_id: vendorProfile.id,
    cover_letter: data.coverLetter,
    proposed_budget: data.proposedBudget ?? null,
    proposed_timeline: data.proposedTimeline || null,
  });

  if (error) {
    if (error.code === "23505") return { error: "您已經應徵過此案件" };
    return { error: "應徵失敗，請稍後再試" };
  }

  // Increment application count
  await supabase.rpc("increment_application_count", {
    p_project_id: projectId,
  });

  revalidatePath("/vendor/applications");
  revalidatePath(`/projects/${projectId}`);
  return { success: true };
}

export async function updateApplicationStatus(
  applicationId: string,
  status: "accepted" | "rejected" | "withdrawn"
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "請先登入" };

  // Fetch the application to verify ownership
  const { data: application } = await supabase
    .from("applications")
    .select("id, vendor_id, project_id")
    .eq("id", applicationId)
    .single();

  if (!application) return { error: "找不到此應徵記錄" };

  // Vendors can only withdraw their own applications
  if (status === "withdrawn") {
    const { data: vendorProfile } = await supabase
      .from("vendor_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!vendorProfile || vendorProfile.id !== application.vendor_id) {
      return { error: "權限不足" };
    }
  } else {
    // Schools can accept/reject applications for their projects
    const { data: schoolProfile } = await supabase
      .from("school_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!schoolProfile) return { error: "權限不足" };

    const { data: project } = await supabase
      .from("projects")
      .select("school_id")
      .eq("id", application.project_id)
      .single();

    if (!project || project.school_id !== schoolProfile.id) {
      return { error: "權限不足" };
    }
  }

  const { error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", applicationId);

  if (error) return { error: "更新失敗" };

  revalidatePath("/school/applications");
  revalidatePath("/vendor/applications");
  return { success: true };
}
