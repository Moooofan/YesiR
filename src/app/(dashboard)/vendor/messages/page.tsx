import { ConversationList } from "@/components/messaging/conversation-list";

const MOCK_CONVERSATIONS = [
  {
    id: "conv-1",
    otherPartyName: "桃園市南美國小",
    lastMessage: "好的，那可以約什麼時間來現場看呢？",
    lastMessageAt: "2026-03-03T13:00:00Z",
    unreadCount: 1,
  },
  {
    id: "conv-2",
    otherPartyName: "台北市大安國小",
    lastMessage: "收到報價單了，我們內部討論後回覆您",
    lastMessageAt: "2026-03-02T11:30:00Z",
    unreadCount: 0,
  },
  {
    id: "conv-3",
    otherPartyName: "新北市板橋國中",
    lastMessage: "請問電腦教室的設備可以分期付款嗎？",
    lastMessageAt: "2026-02-28T15:20:00Z",
    unreadCount: 1,
  },
];

export default function VendorMessagesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">訊息</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          與學校的對話記錄
        </p>
      </div>
      <ConversationList
        conversations={MOCK_CONVERSATIONS}
        basePath="/vendor/messages"
      />
    </div>
  );
}
