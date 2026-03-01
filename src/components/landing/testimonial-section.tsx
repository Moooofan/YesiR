import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "校管家讓我們快速找到可靠的維修廠商，省了很多時間，不用再到處打電話詢價了。",
    name: "王老師",
    school: "台北市大安國小",
  },
  {
    quote: "發案流程非常簡單，連不太會用電腦的同事也能輕鬆操作，真的很貼心。",
    name: "陳主任",
    school: "新北市板橋國小",
  },
  {
    quote: "之前找活動策劃公司要比好幾家，現在在校管家上一次就能收到多個提案，效率超高！",
    name: "林老師",
    school: "桃園市中壢國小",
  },
];

export function TestimonialSection() {
  return (
    <section className="bg-muted/30 py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block rounded-full bg-primary/8 px-4 py-1 text-xs font-semibold text-primary">
            好評推薦
          </span>
          <h2 className="text-3xl font-extrabold text-foreground">
            學校老師怎麼說
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              {/* Stars */}
              <div className="mb-4 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/8 text-sm font-bold text-primary">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {t.school}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
