import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/actions/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, display_name")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/register");

  const isVendor = profile.role === "vendor";

  const navItems = isVendor
    ? [
        { href: "/vendor/projects", label: "瀏覽案件" },
        { href: "/vendor/applications", label: "我的應徵" },
        { href: "/vendor/messages", label: "訊息" },
        { href: "/vendor/profile", label: "公司資料" },
      ]
    : [
        { href: "/school/vendors", label: "搜尋廠商" },
        { href: "/school/projects", label: "我的案件" },
        { href: "/school/projects/new", label: "發布新案件" },
        { href: "/school/applications", label: "應徵管理" },
        { href: "/school/messages", label: "訊息" },
        { href: "/school/profile", label: "學校資料" },
      ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/">
              <Image src="/yesir-logo.png" alt="YesiR 校管家" width={120} height={28} className="h-7 w-auto" />
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-primary/8 hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {profile.display_name}
            </span>
            <form action={logout}>
              <Button variant="ghost" size="sm" type="submit" className="gap-1 rounded-full">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">登出</span>
              </Button>
            </form>
          </div>
        </div>

        {/* Mobile Nav */}
        <nav className="flex items-center gap-2 overflow-x-auto border-t px-4 py-2 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
