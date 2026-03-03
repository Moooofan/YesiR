import { z } from "zod";

export const vendorRegistrationSchema = z
  .object({
    email: z.string().email("請輸入有效的電子郵件"),
    password: z.string().min(8, "密碼至少需要 8 個字元"),
    confirmPassword: z.string(),
    companyName: z.string().min(2, "公司名稱至少需要 2 個字"),
    contactPerson: z.string().min(2, "請輸入聯絡人姓名"),
    phone: z.string().regex(/^0[0-9]{8,9}$/, "請輸入有效的電話號碼"),
    taxId: z
      .string()
      .regex(/^[0-9]{8}$/, "統一編號為 8 位數字")
      .optional()
      .or(z.literal("")),
    categoryIds: z.array(z.number()).min(1, "請至少選擇一項服務類別"),
    agreeToTerms: z.literal(true, { message: "請同意服務條款" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "密碼不一致",
    path: ["confirmPassword"],
  });

export const schoolRegistrationSchema = z
  .object({
    email: z.string().email("請輸入有效的電子郵件"),
    password: z.string().min(8, "密碼至少需要 8 個字元"),
    confirmPassword: z.string(),
    schoolName: z.string().min(2, "學校名稱至少需要 2 個字"),
    contactPerson: z.string().min(2, "請輸入聯絡人姓名"),
    phone: z.string().regex(/^0[0-9]{8,9}$/, "請輸入有效的電話號碼"),
    agreeToTerms: z.literal(true, { message: "請同意服務條款" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "密碼不一致",
    path: ["confirmPassword"],
  });

export const projectSchema = z
  .object({
    title: z
      .string()
      .min(5, "標題至少需要 5 個字")
      .max(100, "標題最多 100 個字"),
    categoryId: z.number({ message: "請選擇服務分類" }),
    description: z
      .string()
      .min(20, "描述至少需要 20 個字")
      .max(2000, "描述最多 2000 個字"),
    budgetType: z.enum(["fixed", "range", "negotiable"]),
    budgetMin: z.number().positive().optional().nullable(),
    budgetMax: z.number().positive().optional().nullable(),
    location: z.string().optional(),
    deadline: z.string().optional(),
    applicationDeadline: z.string().optional(),
    requirements: z.string().max(1000).optional(),
  })
  .refine(
    (data) => {
      if (data.budgetType === "fixed") return data.budgetMin != null;
      if (data.budgetType === "range")
        return data.budgetMin != null && data.budgetMax != null;
      return true;
    },
    { message: "請輸入預算金額", path: ["budgetMin"] }
  );

export const applicationSchema = z.object({
  coverLetter: z
    .string()
    .min(10, "提案內容至少需要 10 個字")
    .max(2000, "提案內容最多 2000 個字"),
  proposedBudget: z.number().positive("請輸入有效的報價金額").optional(),
  proposedTimeline: z.string().optional(),
});

export type VendorRegistrationInput = z.infer<typeof vendorRegistrationSchema>;
export type SchoolRegistrationInput = z.infer<typeof schoolRegistrationSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type ApplicationInput = z.infer<typeof applicationSchema>;
