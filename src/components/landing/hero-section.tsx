import Link from "next/link";
import { Search } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-hero-dark py-24 md:py-32">
      {/* Subtle blue radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.55_0.15_245/0.15),transparent)]" />

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center text-center">
          {/* Headline */}
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-wide text-white md:text-5xl lg:text-6xl">
            學校找廠商
            <br />
            <span className="text-gradient-coral">從此不再麻煩</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 max-w-2xl text-lg text-white/60 md:text-xl">
            校管家幫您快速媒合優質校園服務廠商，
            <br className="hidden md:block" />
            讓老師專心教學，不再為找廠商煩惱
          </p>

          {/* Search Bar */}
          <div className="mt-10 w-full max-w-2xl">
            <form
              className="flex items-center rounded-full bg-white p-2 shadow-lg shadow-black/10"
              action="/vendors"
            >
              <Search className="ml-4 h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                name="q"
                placeholder="搜尋服務或廠商名稱..."
                className="flex-1 bg-transparent px-4 py-3 text-base text-foreground outline-none placeholder:text-muted-foreground"
              />
            </form>
          </div>

          {/* Role buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-6">
            <Link
              href="/register?role=school"
              className="inline-flex items-center justify-center rounded-full border-2 border-white bg-transparent px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-white hover:text-hero-dark"
            >
              我是學校
            </Link>
            <Link
              href="/register?role=vendor"
              className="inline-flex items-center justify-center rounded-full border-2 border-white/50 bg-transparent px-8 py-4 text-lg font-semibold text-white/80 transition-colors hover:border-white hover:bg-white hover:text-hero-dark"
            >
              我是廠商
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
