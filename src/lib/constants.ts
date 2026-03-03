import type { ProjectStatus, ApplicationStatus, BudgetType } from "@/types";

export const CATEGORIES = [
  { id: 1, name: "校園維修", slug: "campus-maintenance", icon: "Wrench" },
  { id: 2, name: "清潔服務", slug: "cleaning-service", icon: "Sparkles" },
  { id: 3, name: "教材採購", slug: "teaching-materials", icon: "BookOpen" },
  { id: 4, name: "活動策劃", slug: "event-planning", icon: "PartyPopper" },
  { id: 5, name: "IT設備", slug: "it-equipment", icon: "Monitor" },
  { id: 6, name: "餐飲服務", slug: "catering-service", icon: "UtensilsCrossed" },
  { id: 7, name: "交通接送", slug: "transportation", icon: "Bus" },
  { id: 8, name: "印刷服務", slug: "printing-service", icon: "Printer" },
  { id: 9, name: "其他服務", slug: "other-services", icon: "CircleEllipsis" },
] as const;

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  draft: "草稿",
  open: "招募中",
  in_progress: "進行中",
  completed: "已完成",
  cancelled: "已取消",
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: "待審核",
  accepted: "已錄取",
  rejected: "未錄取",
  withdrawn: "已撤回",
};

export const BUDGET_TYPE_LABELS: Record<BudgetType, string> = {
  fixed: "固定金額",
  range: "預算範圍",
  negotiable: "可議價",
};

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  draft: "bg-gray-100 text-gray-600",
  open: "bg-green-100 text-green-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-purple-100 text-purple-700",
  cancelled: "bg-red-100 text-red-700",
};

export const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  withdrawn: "bg-gray-100 text-gray-600",
};
