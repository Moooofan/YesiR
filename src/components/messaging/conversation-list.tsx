import Link from "next/link";
import { MessageSquare } from "lucide-react";

interface ConversationItem {
  id: string;
  otherPartyName: string;
  lastMessage: string | null;
  lastMessageAt: string;
  unreadCount: number;
}

interface ConversationListProps {
  conversations: ConversationItem[];
  basePath: string;
}

export function ConversationList({
  conversations,
  basePath,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <MessageSquare className="mb-4 h-16 w-16 text-muted-foreground/30" />
        <h3 className="text-lg font-semibold">尚無訊息</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          開始與廠商或學校聯繫吧
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y rounded-xl border bg-white">
      {conversations.map((conv) => {
        const time = new Date(conv.lastMessageAt).toLocaleDateString("zh-TW", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <Link
            key={conv.id}
            href={`${basePath}/${conv.id}`}
            className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="truncate text-sm font-semibold">
                  {conv.otherPartyName}
                </h3>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {time}
                </span>
              </div>
              {conv.lastMessage && (
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {conv.lastMessage}
                </p>
              )}
            </div>
            {conv.unreadCount > 0 && (
              <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-white">
                {conv.unreadCount}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
