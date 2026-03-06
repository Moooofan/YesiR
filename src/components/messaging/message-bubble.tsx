interface MessageBubbleProps {
  content: string;
  createdAt: string;
  isMine: boolean;
}

export function MessageBubble({ content, createdAt, isMine }: MessageBubbleProps) {
  const time = new Date(createdAt).toLocaleTimeString("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
          isMine
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-muted text-foreground"
        }`}
      >
        <p className="whitespace-pre-wrap text-sm">{content}</p>
        <p
          className={`mt-1 text-[10px] ${
            isMine ? "text-primary-foreground/60" : "text-muted-foreground"
          }`}
        >
          {time}
        </p>
      </div>
    </div>
  );
}
