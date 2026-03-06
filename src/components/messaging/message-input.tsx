"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { sendMessage } from "@/actions/message";
import { toast } from "sonner";

interface MessageInputProps {
  conversationId: string;
  currentUserId: string;
  onOptimisticSend: (message: {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    is_read: boolean;
    created_at: string;
  }) => void;
}

export function MessageInput({
  conversationId,
  currentUserId,
  onOptimisticSend,
}: MessageInputProps) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;

    // Optimistic update
    onOptimisticSend({
      id: `optimistic-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: currentUserId,
      content: trimmed,
      is_read: false,
      created_at: new Date().toISOString(),
    });

    setContent("");

    startTransition(async () => {
      const result = await sendMessage(conversationId, trimmed);
      if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t bg-white p-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="輸入訊息... (Enter 送出，Shift+Enter 換行)"
        className="min-h-[44px] max-h-32 resize-none rounded-xl"
        rows={1}
      />
      <Button
        type="submit"
        size="icon"
        className="shrink-0 rounded-xl"
        disabled={isPending || !content.trim()}
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
