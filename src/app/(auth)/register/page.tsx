import Link from "next/link";
import { GraduationCap, Building2, ArrowRight } from "lucide-react";

const roles = [
  {
    role: "school",
    icon: GraduationCap,
    title: "我是學校老師",
    description: "我想發案找廠商服務",
    href: "/register/school",
  },
  {
    role: "vendor",
    icon: Building2,
    title: "我是廠商業者",
    description: "我想接案提供服務",
    href: "/register/vendor",
  },
];

export default function RegisterPage() {
  return (
    <div>
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-foreground">加入校管家</h1>
        <p className="mt-2 text-sm text-muted-foreground">請選擇您的身份</p>
      </div>

      <div className="mt-8 space-y-4">
        {roles.map((r) => (
          <Link
            key={r.role}
            href={r.href}
            className="group flex items-center gap-4 rounded-2xl border bg-white p-6 transition-all hover:border-primary/30 hover:shadow-md"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary transition-colors group-hover:bg-primary/12">
              <r.icon className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <div className="text-base font-bold text-foreground">
                {r.title}
              </div>
              <div className="mt-0.5 text-sm text-muted-foreground">
                {r.description}
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
          </Link>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        已有帳號？{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          登入
        </Link>
      </p>
    </div>
  );
}
