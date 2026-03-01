import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { BUDGET_TYPE_LABELS } from "@/lib/constants"
import type { BudgetType } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBudget(
  type: BudgetType,
  min: number | null,
  max: number | null
): string {
  if (type === "negotiable") return "可議價";
  if (type === "fixed" && min) return `NT$ ${min.toLocaleString()}`;
  if (type === "range" && min && max)
    return `NT$ ${min.toLocaleString()} - ${max.toLocaleString()}`;
  return BUDGET_TYPE_LABELS[type] || "面議";
}
