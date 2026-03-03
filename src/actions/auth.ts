"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  vendorRegistrationSchema,
  schoolRegistrationSchema,
} from "@/lib/validators";

/**
 * Convert user-facing email to Supabase auth email by appending +role suffix.
 * This allows the same email to have separate school and vendor accounts.
 * e.g. user@example.com + "school" → user+school@example.com
 */
function toAuthEmail(email: string, role: "school" | "vendor"): string {
  const [local, domain] = email.split("@");
  return `${local}+${role}@${domain}`;
}

export async function login(data: {
  email: string;
  password: string;
  role: "school" | "vendor";
}) {
  if (!data.email || !data.password || !data.role) {
    return { error: "請輸入完整的登入資訊" };
  }

  const supabase = await createClient();
  const authEmail = toAuthEmail(data.email, data.role);

  const result = await supabase.auth.signInWithPassword({
    email: authEmail,
    password: data.password,
  });

  if (result.error) {
    return { error: "帳號或密碼錯誤，請確認登入身分是否正確" };
  }

  redirect("/dashboard");
}

export async function registerVendor(formData: {
  email: string;
  password: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  taxId?: string;
  categoryIds: number[];
}) {
  const parsed = vendorRegistrationSchema.safeParse({
    ...formData,
    confirmPassword: formData.password,
    agreeToTerms: true,
  });
  if (!parsed.success) {
    return { error: "資料驗證失敗，請檢查輸入內容" };
  }

  const supabase = await createClient();
  const authEmail = toAuthEmail(formData.email, "vendor");

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: authEmail,
    password: formData.password,
    options: {
      data: {
        role: "vendor",
        display_name: formData.companyName,
        real_email: formData.email,
      },
    },
  });

  if (authError) {
    if (authError.message === "User already registered") {
      return { error: "此 Email 已經註冊過廠商帳號" };
    }
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: "註冊失敗，請稍後再試" };
  }

  // Create vendor profile (store real email, not auth email)
  const { data: vendorProfile, error: vpError } = await supabase
    .from("vendor_profiles")
    .insert({
      user_id: authData.user.id,
      company_name: formData.companyName,
      contact_person: formData.contactPerson,
      phone: formData.phone,
      email: formData.email,
      tax_id: formData.taxId || null,
    })
    .select("id")
    .single();

  if (vpError) {
    return { error: "建立廠商資料失敗，請稍後再試" };
  }

  // Link categories
  if (formData.categoryIds.length > 0) {
    const categoryLinks = formData.categoryIds.map((catId) => ({
      vendor_id: vendorProfile.id,
      category_id: catId,
    }));
    await supabase.from("vendor_categories").insert(categoryLinks);
  }

  // Mark profile as complete & store real email
  await supabase
    .from("profiles")
    .update({ is_profile_complete: true, email: formData.email })
    .eq("id", authData.user.id);

  return { success: true };
}

export async function registerSchool(formData: {
  email: string;
  password: string;
  schoolName: string;
  contactPerson: string;
  phone: string;
}) {
  const parsed = schoolRegistrationSchema.safeParse({
    ...formData,
    confirmPassword: formData.password,
    agreeToTerms: true,
  });
  if (!parsed.success) {
    return { error: "資料驗證失敗，請檢查輸入內容" };
  }

  const supabase = await createClient();
  const authEmail = toAuthEmail(formData.email, "school");

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: authEmail,
    password: formData.password,
    options: {
      data: {
        role: "school",
        display_name: formData.schoolName,
        real_email: formData.email,
      },
    },
  });

  if (authError) {
    if (authError.message === "User already registered") {
      return { error: "此 Email 已經註冊過學校帳號" };
    }
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: "註冊失敗，請稍後再試" };
  }

  // Create school profile (store real email)
  const { error: spError } = await supabase.from("school_profiles").insert({
    user_id: authData.user.id,
    school_name: formData.schoolName,
    contact_person: formData.contactPerson,
    phone: formData.phone,
    email: formData.email,
  });

  if (spError) {
    return { error: "建立學校資料失敗，請稍後再試" };
  }

  // Mark profile as complete & store real email
  await supabase
    .from("profiles")
    .update({ is_profile_complete: true, email: formData.email })
    .eq("id", authData.user.id);

  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
