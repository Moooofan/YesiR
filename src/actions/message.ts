"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { messageSchema } from "@/lib/validators";

export async function getOrCreateConversation(vendorUserId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "請先登入" };

  // Check if conversation already exists
  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .or(
      `and(school_user_id.eq.${user.id},vendor_user_id.eq.${vendorUserId}),and(school_user_id.eq.${vendorUserId},vendor_user_id.eq.${user.id})`
    )
    .single();

  if (existing) return { conversationId: existing.id };

  // Determine which user is school and which is vendor
  const { data: myProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!myProfile) return { error: "找不到使用者資料" };

  const schoolUserId =
    myProfile.role === "school" || myProfile.role === "both"
      ? user.id
      : vendorUserId;
  const vendorId =
    myProfile.role === "vendor" ? user.id : vendorUserId;

  const { data: conversation, error } = await supabase
    .from("conversations")
    .insert({
      school_user_id: schoolUserId,
      vendor_user_id: vendorId,
    })
    .select("id")
    .single();

  if (error) return { error: "建立對話失敗" };

  revalidatePath("/school/messages");
  revalidatePath("/vendor/messages");
  return { conversationId: conversation.id };
}

export async function sendMessage(conversationId: string, content: string) {
  const parsed = messageSchema.safeParse({ content });
  if (!parsed.success) return { error: "訊息驗證失敗" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "請先登入" };

  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    content: parsed.data.content,
  });

  if (error) return { error: "傳送訊息失敗" };
  return { success: true };
}

export async function markMessagesAsRead(conversationId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("conversation_id", conversationId)
    .neq("sender_id", user.id)
    .eq("is_read", false);
}
