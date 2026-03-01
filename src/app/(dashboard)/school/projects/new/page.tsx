"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { projectSchema, type ProjectInput } from "@/lib/validators";
import { CATEGORIES } from "@/lib/constants";
import { createProject } from "@/actions/project";

export default function NewProjectPage() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      budgetType: "negotiable",
    },
  });

  const budgetType = watch("budgetType");
  const description = watch("description") || "";

  async function onSubmit(data: ProjectInput) {
    setLoading(true);
    const result = await createProject(data, "open");
    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    }
  }

  async function onSaveDraft() {
    const data = watch();
    setLoading(true);
    const result = await createProject(data as ProjectInput, "draft");
    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-foreground">發布新案件</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          告訴廠商您需要什麼服務
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 rounded-full bg-primary" />
            <h3 className="text-sm font-bold text-foreground">
              案件基本資訊
            </h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">案件標題 *</Label>
            <Input
              id="title"
              placeholder="例：校舍外牆油漆工程"
              className="h-11"
              {...register("title")}
            />
            <p className="text-xs text-muted-foreground">
              請簡短描述您需要的服務
            </p>
            {errors.title && (
              <p className="text-sm text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">服務分類 *</Label>
            <select
              id="categoryId"
              className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              onChange={(e) =>
                setValue("categoryId", Number(e.target.value), {
                  shouldValidate: true,
                })
              }
              defaultValue=""
            >
              <option value="" disabled>
                請選擇分類
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-sm text-destructive">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">案件描述 *</Label>
            <Textarea
              id="description"
              rows={5}
              placeholder={`請詳細描述您的需求，包括：\n- 服務內容\n- 數量或範圍\n- 特殊要求`}
              {...register("description")}
            />
            <div className="flex justify-between">
              {errors.description ? (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              ) : (
                <span />
              )}
              <span className="text-xs text-muted-foreground">
                {description.length} / 2000
              </span>
            </div>
          </div>
        </div>

        {/* Budget & Timeline */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 rounded-full bg-primary" />
            <h3 className="text-sm font-bold text-foreground">預算與時程</h3>
          </div>

          <div className="space-y-2">
            <Label>預算方式 *</Label>
            <div className="flex gap-2">
              {[
                { value: "negotiable", label: "可議價" },
                { value: "fixed", label: "固定金額" },
                { value: "range", label: "預算範圍" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setValue(
                      "budgetType",
                      opt.value as "fixed" | "range" | "negotiable",
                      { shouldValidate: true }
                    )
                  }
                  className={`rounded-full border px-4 py-2 text-sm transition-all ${
                    budgetType === opt.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "hover:border-primary/30 hover:text-primary"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {budgetType === "fixed" && (
            <div className="space-y-2">
              <Label htmlFor="budgetMin">預算金額（元）</Label>
              <Input
                id="budgetMin"
                type="number"
                placeholder="例：50000"
                className="h-11"
                {...register("budgetMin", { valueAsNumber: true })}
              />
              {errors.budgetMin && (
                <p className="text-sm text-destructive">
                  {errors.budgetMin.message}
                </p>
              )}
            </div>
          )}

          {budgetType === "range" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="budgetMin">最低預算（元）</Label>
                <Input
                  id="budgetMin"
                  type="number"
                  placeholder="例：30000"
                  className="h-11"
                  {...register("budgetMin", { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budgetMax">最高預算（元）</Label>
                <Input
                  id="budgetMax"
                  type="number"
                  placeholder="例：80000"
                  className="h-11"
                  {...register("budgetMax", { valueAsNumber: true })}
                />
              </div>
              {errors.budgetMin && (
                <p className="text-sm text-destructive">
                  {errors.budgetMin.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="location">服務地點</Label>
            <Input
              id="location"
              placeholder="例：台北市大安區XX路XX號"
              className="h-11"
              {...register("location")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="deadline">預計完成日期</Label>
              <Input
                id="deadline"
                type="date"
                className="h-11"
                {...register("deadline")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="applicationDeadline">應徵截止日期</Label>
              <Input
                id="applicationDeadline"
                type="date"
                className="h-11"
                {...register("applicationDeadline")}
              />
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 rounded-full bg-primary" />
            <h3 className="text-sm font-bold text-foreground">附加資訊</h3>
          </div>
          <div className="space-y-2">
            <Label htmlFor="requirements">特殊需求或資格要求</Label>
            <Textarea
              id="requirements"
              rows={3}
              placeholder="例：需具備合格的施工證照"
              {...register("requirements")}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t pt-6">
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={onSaveDraft}
            disabled={loading}
          >
            儲存草稿
          </Button>
          <Button
            type="submit"
            className="flex-1 rounded-full"
            size="lg"
            disabled={loading}
          >
            {loading ? "發布中..." : "發布案件"}
          </Button>
        </div>
      </form>
    </div>
  );
}
