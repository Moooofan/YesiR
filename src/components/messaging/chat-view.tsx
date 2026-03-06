"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MessageBubble } from "./message-bubble";
import { MessageInput } from "./message-input";
import { useRealtimeMessages } from "@/hooks/use-realtime-messages";
import type { Message } from "@/types";

interface ChatViewProps {
  conversationId: string;
  initialMessages: Message[];
  currentUserId: string;
  otherPartyName: string;
  backPath: string;
}

export function ChatView({
  conversationId,
  initialMessages,
  currentUserId,
  otherPartyName,
  backPath,
}: ChatViewProps) {
  const { messages, addOptimisticMessage } = useRealtimeMessages(
    conversationId,
    initialMessages
  );
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-xl border bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <Button variant="ghost" size="icon" className="shrink-0 rounded-full" asChild>
          <Link href={backPath}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-sm font-semibold">{otherPartyName}</h2>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">
              開始對話吧！
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              content={msg.content}
              createdAt={msg.created_at}
              isMine={msg.sender_id === currentUserId}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput
        conversationId={conversationId}
        currentUserId={currentUserId}
        onOptimisticSend={addOptimisticMessage}
      />
    </div>
  );
}
