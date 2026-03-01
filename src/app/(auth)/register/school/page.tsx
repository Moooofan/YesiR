"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  schoolRegistrationSchema,
  type SchoolRegistrationInput,
} from "@/lib/validators";
import { registerSchool } from "@/actions/auth";

export default function SchoolRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SchoolRegistrationInput>({
    resolver: zodResolver(schoolRegistrationSchema),
    defaultValues: {
      agreeToTerms: false as unknown as true,
    },
  });

  async function onSubmit(data: SchoolRegistrationInput) {
    setLoading(true);
    const result = await registerSchool({
      email: data.email,
      password: data.password,
      schoolName: data.schoolName,
      contactPerson: data.contactPerson,
      phone: data.phone,
    });

    if (result.error) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    toast.success("註冊成功！");
    router.push("/dashboard");
  }

  return (
    <div>
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-foreground">學校註冊</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          加入校管家，輕鬆找到好廠商
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-8">
        {/* Account Info */}
        <div className="space-y-4">
          <h3 className="border-b pb-2 text-sm font-bold text-foreground">
            帳號資訊
          </h3>
          <div className="space-y-2">
            <Label htmlFor="email">電子郵件 *</Label>
            <Input
              id="email"
              type="email"
              placeholder="teacher@school.edu.tw"
              className="h-11"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="password">設定密碼 *</Label>
              <Input
                id="password"
                type="password"
                placeholder="至少 8 個字元"
                className="h-11"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">確認密碼 *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="再次輸入密碼"
                className="h-11"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* School Info */}
        <div className="space-y-4">
          <h3 className="border-b pb-2 text-sm font-bold text-foreground">
            學校資料
          </h3>
          <div className="space-y-2">
            <Label htmlFor="schoolName">學校名稱 *</Label>
            <Input
              id="schoolName"
              placeholder="例：台北市大安國小"
              className="h-11"
              {...register("schoolName")}
            />
            {errors.schoolName && (
              <p className="text-sm text-destructive">
                {errors.schoolName.message}
              </p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactPerson">聯絡人姓名 *</Label>
              <Input
                id="contactPerson"
                placeholder="王老師"
                className="h-11"
                {...register("contactPerson")}
              />
              {errors.contactPerson && (
                <p className="text-sm text-destructive">
                  {errors.contactPerson.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">聯絡電話 *</Label>
              <Input
                id="phone"
                placeholder="0912345678"
                className="h-11"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2">
          <Checkbox
            id="agreeToTerms"
            checked={watch("agreeToTerms") === true}
            onCheckedChange={(checked) =>
              setValue("agreeToTerms", checked as true, {
                shouldValidate: true,
              })
            }
          />
          <Label htmlFor="agreeToTerms" className="text-sm leading-5">
            我同意校管家的服務條款及隱私政策
          </Label>
        </div>
        {errors.agreeToTerms && (
          <p className="text-sm text-destructive">
            {errors.agreeToTerms.message}
          </p>
        )}

        <Button
          type="submit"
          className="w-full rounded-full"
          size="lg"
          disabled={loading}
        >
          {loading ? "註冊中..." : "立即註冊"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        已有帳號？{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          登入
        </Link>
      </p>
    </div>
  );
}
