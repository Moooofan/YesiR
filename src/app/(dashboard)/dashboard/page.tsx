import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_profile_complete")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/register");

  if (profile.role === "vendor") {
    redirect("/vendor/projects");
  }

  // "school" or "both" → default to school vendor search
  redirect("/school/vendors");
}
