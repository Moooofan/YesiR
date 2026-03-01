import {
  ClipboardList,
  Users,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "發布需求",
    description: "描述您的需求，設定預算和期限，只需幾分鐘就能完成",
  },
  {
    icon: Users,
    title: "廠商主動應徵",
    description: "符合資格的廠商會主動向您提案，無需逐一聯繫",
  },
  {
    icon: MessageSquare,
    title: "溝通比較",
    description: "比較方案、報價和評價，線上溝通確認細節",
  },
  {
    icon: CheckCircle2,
    title: "完成合作",
    description: "選擇最佳廠商，完成服務後給予評價",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-muted/30 py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <span className="mb-3 inline-block rounded-full bg-primary/8 px-4 py-1 text-xs font-semibold text-primary">
            如何使用
          </span>
          <h2 className="text-3xl font-extrabold text-foreground">
            簡單四步驟，輕鬆找到好廠商
          </h2>
          <p className="mt-3 text-muted-foreground">
            不用再四處打聽、比價，校管家幫你搞定
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.title} className="relative text-center">
              {/* Step number circle */}
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/8">
                <span className="text-2xl font-extrabold text-primary">
                  {i + 1}
                </span>
              </div>

              {/* Connector line (desktop only) */}
              {i < steps.length - 1 && (
                <div className="absolute left-[calc(50%+48px)] top-10 hidden h-0 w-[calc(100%-96px)] border-t-2 border-dashed border-primary/20 md:block" />
              )}

              {/* Icon */}
              <step.icon className="mx-auto mt-4 h-6 w-6 text-muted-foreground" />

              <h3 className="mt-3 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
