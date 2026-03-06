import { ConversationList } from "@/components/messaging/conversation-list";

const MOCK_CONVERSATIONS = [
  {
    id: "conv-1",
    otherPartyName: "全能水電工程行",
    lastMessage: "好的，我們下週一可以到校評估，預計上午 10 點到，方便嗎？",
    lastMessageAt: "2026-03-03T14:30:00Z",
    unreadCount: 2,
  },
  {
    id: "conv-2",
    otherPartyName: "潔淨家園清潔有限公司",
    lastMessage: "報價單已經寄到您的信箱了，有問題歡迎隨時詢問",
    lastMessageAt: "2026-03-02T10:15:00Z",
    unreadCount: 0,
  },
  {
    id: "conv-3",
    otherPartyName: "教育印刷廠",
    lastMessage: "畢業紀念冊的打樣已經完成，請確認是否需要修改",
    lastMessageAt: "2026-03-01T16:45:00Z",
    unreadCount: 1,
  },
  {
    id: "conv-4",
    otherPartyName: "快樂校園活動公司",
    lastMessage: "校慶活動企劃書已更新，新增了闖關遊戲的部分",
    lastMessageAt: "2026-02-28T09:20:00Z",
    unreadCount: 0,
  },
];

export default function SchoolMessagesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">訊息</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          與廠商的對話記錄
        </p>
      </div>
      <ConversationList
        conversations={MOCK_CONVERSATIONS}
        basePath="/school/messages"
      />
    </div>
  );
}
