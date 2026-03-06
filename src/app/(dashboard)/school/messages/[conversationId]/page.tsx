import { ChatView } from "@/components/messaging/chat-view";
import type { Message } from "@/types";

const MOCK_MESSAGES: Message[] = [
  {
    id: "m1",
    conversation_id: "conv-1",
    sender_id: "school-user",
    content: "您好，我們學校的廁所水管有漏水問題，想請貴公司來評估維修，方便嗎？",
    is_read: true,
    created_at: "2026-03-03T09:00:00Z",
  },
  {
    id: "m2",
    conversation_id: "conv-1",
    sender_id: "vendor-user",
    content: "您好！沒問題，請問漏水的位置大概在哪裡？是一樓還是其他樓層呢？",
    is_read: true,
    created_at: "2026-03-03T09:15:00Z",
  },
  {
    id: "m3",
    conversation_id: "conv-1",
    sender_id: "school-user",
    content: "是在二樓的男廁，靠近水塔的那一側，已經漏了大約一週了",
    is_read: true,
    created_at: "2026-03-03T09:30:00Z",
  },
  {
    id: "m4",
    conversation_id: "conv-1",
    sender_id: "vendor-user",
    content: "了解，這種情況通常是管線接頭老化。初步評估費用大約 $3,000～$8,000，需要現場看才能確定。",
    is_read: true,
    created_at: "2026-03-03T10:00:00Z",
  },
  {
    id: "m5",
    conversation_id: "conv-1",
    sender_id: "school-user",
    content: "好的，那可以約什麼時間來現場看呢？",
    is_read: true,
    created_at: "2026-03-03T13:00:00Z",
  },
  {
    id: "m6",
    conversation_id: "conv-1",
    sender_id: "vendor-user",
    content: "好的，我們下週一可以到校評估，預計上午 10 點到，方便嗎？",
    is_read: false,
    created_at: "2026-03-03T14:30:00Z",
  },
];

const MOCK_NAMES: Record<string, string> = {
  "conv-1": "全能水電工程行",
  "conv-2": "潔淨家園清潔有限公司",
  "conv-3": "教育印刷廠",
  "conv-4": "快樂校園活動公司",
};

export default async function SchoolChatPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;

  return (
    <ChatView
      conversationId={conversationId}
      initialMessages={MOCK_MESSAGES}
      currentUserId="school-user"
      otherPartyName={MOCK_NAMES[conversationId] || "廠商"}
      backPath="/school/messages"
    />
  );
}
