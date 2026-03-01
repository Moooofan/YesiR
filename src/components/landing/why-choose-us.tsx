import { ShieldCheck, Clock, Gift, Award } from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "安全可靠",
    description: "所有廠商經過基本資料審核，合作更放心",
  },
  {
    icon: Clock,
    title: "節省時間",
    description: "不用再四處打聽、比價，一站完成所有流程",
  },
  {
    icon: Gift,
    title: "完全免費",
    description: "學校發案完全免費，零負擔使用",
  },
  {
    icon: Award,
    title: "專業服務",
    description: "專為國小需求設計的媒合平台，貼心又好用",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Left: headline pitch */}
          <div>
            <span className="mb-4 inline-block rounded-full bg-accent px-4 py-1 text-xs font-semibold text-accent-foreground">
              為什麼選擇校管家
            </span>
            <h2 className="text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
              專為學校打造的
              <br />
              <span className="text-primary">服務媒合平台</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              校管家理解學校的需求和流程，提供最貼心的媒合體驗。不論是校園維修、教材採購、還是活動策劃，都能快速找到合適的合作夥伴。
            </p>
          </div>

          {/* Right: 2x2 feature grid */}
          <div className="grid grid-cols-2 gap-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="space-y-3 rounded-2xl border bg-white p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8">
                  <v.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-bold">{v.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
