import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-hero-dark py-24">
      {/* Subtle blue glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.55_0.15_245/0.1),transparent)]" />

      <div className="relative mx-auto max-w-6xl px-4 text-center">
        <h2 className="text-3xl font-extrabold text-white md:text-4xl">
          準備好了嗎？立即開始使用校管家
        </h2>
        <p className="mt-4 text-lg text-white/60">
          加入校管家，讓校園服務媒合變得輕鬆簡單
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="gap-2 rounded-full bg-white px-8 text-base font-semibold text-gray-900 shadow-lg hover:bg-gray-100"
            asChild
          >
            <Link href="/register?role=school">
              免費發案
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-white/30 bg-transparent px-8 text-base text-white hover:bg-white/10"
            asChild
          >
            <Link href="/register?role=vendor">廠商註冊</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
