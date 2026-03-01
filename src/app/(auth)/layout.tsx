import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Clock, Users } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left: Brand panel (desktop only) */}
      <div className="hidden w-[480px] shrink-0 bg-hero-dark lg:flex lg:flex-col lg:justify-between lg:p-10">
        <div>
          <Link href="/">
            <Image src="/yesir-logo.png" alt="YesiR 校管家" width={160} height={40} className="h-10 w-auto" />
          </Link>
          <h2 className="mt-12 text-3xl font-extrabold leading-tight text-white">
            校園服務媒合，
            <br />
            <span className="text-gradient-coral">從此不再麻煩</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/50">
            專為學校打造的服務媒合平台，讓您輕鬆找到可靠的合作廠商。
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-white/60">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="text-sm">廠商資料經過審核，合作更安心</span>
          </div>
          <div className="flex items-center gap-3 text-white/60">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8">
              <Clock className="h-4 w-4" />
            </div>
            <span className="text-sm">3 分鐘快速發案，省時又省力</span>
          </div>
          <div className="flex items-center gap-3 text-white/60">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8">
              <Users className="h-4 w-4" />
            </div>
            <span className="text-sm">已有 200+ 學校信任使用</span>
          </div>
        </div>
      </div>

      {/* Right: Form area */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <Link href="/" className="mb-8 lg:hidden">
          <Image src="/yesir-logo.png" alt="YesiR 校管家" width={140} height={36} className="h-9 w-auto" />
        </Link>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
