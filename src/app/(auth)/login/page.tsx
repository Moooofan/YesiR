"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Building2 } from "lucide-react";
import { login } from "@/actions/auth";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"school" | "vendor">("school");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("請輸入 Email 和密碼");
      return;
    }
    setLoading(true);
    const result = await login({ email, password, role });
    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-foreground">歡迎回來</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          登入您的校管家帳號
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {/* Role selector */}
        <div className="space-y-2">
          <Label>登入身分</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("school")}
              className={`flex items-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${
                role === "school"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              <GraduationCap className="h-5 w-5" />
              學校方
            </button>
            <button
              type="button"
              onClick={() => setRole("vendor")}
              className={`flex items-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${
                role === "vendor"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              <Building2 className="h-5 w-5" />
              廠商方
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">電子郵件</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            className="h-11"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">密碼</Label>
          <Input
            id="password"
            type="password"
            placeholder="輸入密碼"
            className="h-11"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          className="w-full rounded-full"
          size="lg"
          disabled={loading}
        >
          {loading ? "登入中..." : "登入"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        還沒有帳號？{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:underline"
        >
          立即註冊
        </Link>
      </p>
    </div>
  );
}
