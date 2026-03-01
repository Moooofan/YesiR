import Link from "next/link";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[oklch(0.16_0.02_250)]">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* About */}
          <div className="col-span-2 md:col-span-1">
            <Image src="/yesir-logo.png" alt="YesiR 校管家" width={120} height={32} className="h-8 w-auto" />
            <p className="mt-3 text-sm text-white/50">
              專為國小設計的校園服務媒合平台，讓學校輕鬆找到優質廠商。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white/90">
              快速連結
            </h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li>
                <Link
                  href="/vendors"
                  className="transition-colors hover:text-white"
                >
                  找廠商
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="transition-colors hover:text-white"
                >
                  瀏覽案件
                </Link>
              </li>
            </ul>
          </div>

          {/* For Vendors */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white/90">
              廠商專區
            </h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li>
                <Link
                  href="/register?role=vendor"
                  className="transition-colors hover:text-white"
                >
                  廠商註冊
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="transition-colors hover:text-white"
                >
                  廠商登入
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white/90">
              聯繫我們
            </h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                service@yesir.tw
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                02-1234-5678
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/30">
          &copy; {new Date().getFullYear()} YesiR 校管家. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
