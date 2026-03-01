import Link from "next/link";
import {
  Wrench,
  Sparkles,
  BookOpen,
  PartyPopper,
  Monitor,
  UtensilsCrossed,
  Bus,
  Printer,
  CircleEllipsis,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench,
  Sparkles,
  BookOpen,
  PartyPopper,
  Monitor,
  UtensilsCrossed,
  Bus,
  Printer,
  CircleEllipsis,
};

const HOT_CATEGORIES = ["campus-maintenance", "it-equipment", "event-planning"];

export function CategoryGrid() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <span className="mb-3 inline-block rounded-full bg-primary/8 px-4 py-1 text-xs font-semibold text-primary">
            服務分類
          </span>
          <h2 className="text-3xl font-extrabold text-foreground">
            校園服務分類
          </h2>
          <p className="mt-3 text-muted-foreground">
            涵蓋學校最常見的各項服務需求
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = iconMap[cat.icon];
            const isHot = HOT_CATEGORIES.includes(cat.slug);
            return (
              <Link
                key={cat.slug}
                href={`/vendors?category=${cat.slug}`}
                className="group relative flex flex-col items-center gap-3 rounded-2xl bg-white p-8 transition-all hover:shadow-lg hover:shadow-primary/5"
              >
                {isHot && (
                  <span className="absolute -right-1 -top-1 rounded-full bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-white">
                    HOT
                  </span>
                )}
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/8">
                  {Icon && <Icon className="h-7 w-7 text-primary" />}
                </div>
                <span className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
