"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { projectSchema, type ProjectInput } from "@/lib/validators";

export async function createProject(
  formData: ProjectInput,
  status: "draft" | "open" = "open"
) {
  // Server-side validation (skip for drafts which may be incomplete)
  if (status !== "draft") {
    const parsed = projectSchema.safeParse(formData);
    if (!parsed.success) {
      return { error: "資料驗證失敗，請檢查輸入內容" };
    }
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "請先登入" };

  const { data: schoolProfile } = await supabase
    .from("school_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!schoolProfile) return { error: "請先完成學校資料填寫" };

  const { error } = await supabase.from("projects").insert({
    school_id: schoolProfile.id,
    title: formData.title,
    category_id: formData.categoryId,
    description: formData.description,
    budget_type: formData.budgetType,
    budget_min: formData.budgetMin ?? null,
    budget_max: formData.budgetMax ?? null,
    location: formData.location || null,
    deadline: formData.deadline || null,
    application_deadline: formData.applicationDeadline || null,
    requirements: formData.requirements || null,
    status,
  });

  if (error) return { error: "建立案件失敗，請稍後再試" };

  revalidatePath("/school/projects");
  revalidatePath("/projects");
  redirect("/school/projects");
}

export async function updateProjectStatus(
  projectId: string,
  status: "draft" | "open" | "in_progress" | "completed" | "cancelled"
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "請先登入" };

  // Verify the user owns this project through their school profile
  const { data: schoolProfile } = await supabase
    .from("school_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!schoolProfile) return { error: "權限不足" };

  const { error } = await supabase
    .from("projects")
    .update({ status })
    .eq("id", projectId)
    .eq("school_id", schoolProfile.id);

  if (error) return { error: "更新失敗" };

  revalidatePath("/school/projects");
  revalidatePath("/projects");
  return { success: true };
}
