"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { href: "/vendors", label: "找廠商" },
  { href: "/projects", label: "瀏覽案件" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/yesir-logo.png" alt="YesiR 校管家" width={140} height={36} className="h-9 w-auto" priority />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" className="rounded-full" asChild>
            <Link href="/login">登入</Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            asChild
          >
            <Link href="/register?role=vendor">廠商入駐</Link>
          </Button>
          <Button size="sm" className="rounded-full px-5" asChild>
            <Link href="/school/projects/new">免費發案</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              {open ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="flex flex-col pt-6">
              {/* Mobile Logo */}
              <div className="mb-6 px-1">
                <Image src="/yesir-logo.png" alt="YesiR 校管家" width={120} height={32} className="h-8 w-auto" />
              </div>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-6 flex flex-col gap-2 px-1">
                <Button
                  variant="outline"
                  className="rounded-full"
                  asChild
                >
                  <Link href="/login" onClick={() => setOpen(false)}>
                    登入
                  </Link>
                </Button>
                <Button className="rounded-full" asChild>
                  <Link
                    href="/school/projects/new"
                    onClick={() => setOpen(false)}
                  >
                    免費發案
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
