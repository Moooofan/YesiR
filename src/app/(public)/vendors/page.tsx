import { createClient } from "@/lib/supabase/server";
import { CATEGORIES } from "@/lib/constants";
import Link from "next/link";
import { Search, SearchX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VendorCard } from "@/components/vendors/vendor-card";

export const metadata = {
  title: "找廠商 — YesiR 校管家",
  description: "瀏覽校管家上的優質校園服務廠商",
};

export default async function VendorsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("vendor_profiles")
    .select(
      `
      id,
      company_name,
      description,
      city,
      total_completed_projects,
      vendor_categories (
        categories (name)
      )
    `
    )
    .eq("is_published", true)
    .order("total_completed_projects", { ascending: false });

  if (params.q) {
    query = query.ilike("company_name", `%${params.q}%`);
  }

  const { data: vendors } = await query;

  const filteredVendors = params.category
    ? vendors?.filter((v) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (v.vendor_categories as any[])?.some((vc) => {
          const cat = CATEGORIES.find((c) => c.slug === params.category);
          return cat && vc.categories?.name === cat.name;
        })
      )
    : vendors;

  return (
    <div>
      {/* Header area */}
      <div className="bg-muted/50 py-10">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-3xl font-extrabold">找廠商</h1>
          <p className="mt-2 text-muted-foreground">
            瀏覽校管家上的優質校園服務廠商
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <form
            className="flex items-center rounded-full border bg-white p-1 shadow-sm"
            action="/vendors"
          >
            <Search className="ml-4 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              name="q"
              defaultValue={params.q}
              placeholder="搜尋廠商名稱..."
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
            <Link href="/vendors">
              <Badge
                variant={!params.category ? "default" : "outline"}
                className={`cursor-pointer rounded-full ${!params.category ? "" : "hover:border-primary/50 hover:text-primary"}`}
              >
                全部
              </Badge>
            </Link>
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/vendors?category=${cat.slug}`}>
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
        {filteredVendors && filteredVendors.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredVendors.map((vendor: Record<string, unknown>) => {
              const cats =
                (
                  vendor.vendor_categories as {
                    categories: { name: string };
                  }[]
                )?.map((vc) => vc.categories) || [];

              return (
                <VendorCard
                  key={vendor.id as string}
                  id={vendor.id as string}
                  companyName={vendor.company_name as string}
                  description={vendor.description as string | null}
                  city={vendor.city as string | null}
                  categories={cats}
                  totalCompletedProjects={
                    vendor.total_completed_projects as number
                  }
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <SearchX className="mb-4 h-16 w-16 text-muted-foreground/30" />
            <h3 className="text-lg font-semibold">尚無廠商</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              目前還沒有廠商加入，敬請期待
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
