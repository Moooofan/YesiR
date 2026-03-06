import { CATEGORIES } from "@/lib/constants";
import Link from "next/link";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VendorCard } from "@/components/vendors/vendor-card";

const MOCK_VENDORS = [
  {
    id: "1",
    user_id: "u1",
    company_name: "全能水電工程行",
    description: "專精校園水電維修、管線更新、電力系統檢測，服務超過 50 所學校，快速到場、品質保證。",
    city: "台北市",
    total_completed_projects: 48,
    categories: [{ name: "校園維修" }, { name: "IT設備" }],
  },
  {
    id: "2",
    user_id: "u2",
    company_name: "潔淨家園清潔有限公司",
    description: "提供校園日常清潔、大掃除、消毒殺菌服務，擁有專業清潔團隊與環保清潔用品。",
    city: "新北市",
    total_completed_projects: 35,
    categories: [{ name: "清潔服務" }],
  },
  {
    id: "3",
    user_id: "u3",
    company_name: "教育印刷廠",
    description: "學習單、聯絡簿、畢業紀念冊等校園印刷品專家，支援少量印刷與客製化設計。",
    city: "桃園市",
    total_completed_projects: 22,
    categories: [{ name: "印刷服務" }],
  },
  {
    id: "4",
    user_id: "u4",
    company_name: "快樂校園活動公司",
    description: "校慶、運動會、畢業典禮等活動企劃與執行，提供音響、燈光、舞台搭建一站式服務。",
    city: "台中市",
    total_completed_projects: 18,
    categories: [{ name: "活動策劃" }],
  },
  {
    id: "5",
    user_id: "u5",
    company_name: "智慧校園科技",
    description: "校園網路建置、電腦教室設備更新、智慧教室解決方案，協助學校數位轉型。",
    city: "台北市",
    total_completed_projects: 15,
    categories: [{ name: "IT設備" }, { name: "教材採購" }],
  },
  {
    id: "6",
    user_id: "u6",
    company_name: "好食光餐飲",
    description: "營養午餐供應、校園活動餐盒、師生聚餐外燴服務，嚴選在地食材、符合食安標準。",
    city: "高雄市",
    total_completed_projects: 12,
    categories: [{ name: "餐飲服務" }],
  },
];

export default async function SchoolVendorSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;

  // Filter mock data by search term and category
  let filtered = MOCK_VENDORS;

  if (params.q) {
    const q = params.q.toLowerCase();
    filtered = filtered.filter(
      (v) =>
        v.company_name.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.categories.some((c) => c.name.toLowerCase().includes(q))
    );
  }

  if (params.category) {
    const cat = CATEGORIES.find((c) => c.slug === params.category);
    if (cat) {
      filtered = filtered.filter((v) =>
        v.categories.some((c) => c.name === cat.name)
      );
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">搜尋廠商</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            輸入關鍵字搜尋合適的服務廠商
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="mb-8 space-y-4">
        <form
          className="flex items-center rounded-full border bg-white p-1 shadow-sm"
          action="/school/vendors"
        >
          <Search className="ml-4 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            name="q"
            defaultValue={params.q}
            placeholder="搜尋廠商名稱、服務類型（如：水電、清潔、印刷）..."
            className="flex-1 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
          />
          {params.category && (
            <input type="hidden" name="category" value={params.category} />
          )}
          <Button type="submit" size="sm" className="rounded-full px-6">
            搜尋
          </Button>
        </form>

        <div className="flex flex-wrap gap-2">
          <Link href="/school/vendors">
            <Badge
              variant={!params.category ? "default" : "outline"}
              className={`cursor-pointer rounded-full ${!params.category ? "" : "hover:border-primary/50 hover:text-primary"}`}
            >
              全部
            </Badge>
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/school/vendors?category=${cat.slug}${params.q ? `&q=${params.q}` : ""}`}
            >
              <Badge
                variant={params.category === cat.slug ? "default" : "outline"}
                className={`cursor-pointer rounded-full ${params.category === cat.slug ? "" : "hover:border-primary/50 hover:text-primary"}`}
              >
                {cat.name}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Vendor Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((vendor) => (
            <VendorCard
              key={vendor.id}
              id={vendor.id}
              companyName={vendor.company_name}
              description={vendor.description}
              city={vendor.city}
              categories={vendor.categories}
              totalCompletedProjects={vendor.total_completed_projects}
              userId={vendor.user_id}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h3 className="text-lg font-semibold">找不到符合的廠商</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            請嘗試其他關鍵字或瀏覽所有分類
          </p>
        </div>
      )}
    </div>
  );
}
