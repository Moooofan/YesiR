"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { getOrCreateConversation } from "@/actions/message";
import { toast } from "sonner";

interface StartConversationButtonProps {
  vendorUserId: string;
}

export function StartConversationButton({
  vendorUserId,
}: StartConversationButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    const result = await getOrCreateConversation(vendorUserId);

    if (result.error) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    if (result.conversationId) {
      router.push(`/school/messages/${result.conversationId}`);
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-1.5 rounded-full text-xs"
      onClick={handleClick}
      disabled={loading}
    >
      <MessageSquare className="h-3.5 w-3.5" />
      {loading ? "連線中..." : "發送訊息"}
    </Button>
  );
}
