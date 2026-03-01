const stats = [
  { value: "100+", label: "合作廠商" },
  { value: "50+", label: "服務學校" },
  { value: "200+", label: "完成案件" },
  { value: "98%", label: "滿意度" },
];

export function StatsSection() {
  return (
    <section className="relative z-10 -mt-8 pb-12">
      <div className="mx-auto max-w-5xl px-4">
        <div className="rounded-2xl bg-white p-8 shadow-xl md:p-10">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`text-center ${i < stats.length - 1 ? "md:border-r md:border-border" : ""}`}
              >
                <div className="text-3xl font-extrabold text-primary md:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
