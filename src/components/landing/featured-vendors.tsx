import Link from "next/link";
import { Building2, Star, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const featuredVendors = [
  {
    id: "1",
    name: "宏達清潔有限公司",
    category: "清潔服務",
    city: "台北市",
    rating: 4.9,
    completedProjects: 32,
  },
  {
    id: "2",
    name: "捷修工程行",
    category: "校園維修",
    city: "新北市",
    rating: 4.8,
    completedProjects: 28,
  },
  {
    id: "3",
    name: "創意活動企劃",
    category: "活動策劃",
    city: "桃園市",
    rating: 5.0,
    completedProjects: 15,
  },
  {
    id: "4",
    name: "智慧科技有限公司",
    category: "IT設備",
    city: "台中市",
    rating: 4.7,
    completedProjects: 22,
  },
];

export function FeaturedVendors() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="mb-3 inline-block rounded-full bg-primary/8 px-4 py-1 text-xs font-semibold text-primary">
              優質推薦
            </span>
            <h2 className="text-3xl font-extrabold text-foreground">
              優質廠商推薦
            </h2>
            <p className="mt-2 text-muted-foreground">
              高評分、高完成率的優秀合作夥伴
            </p>
          </div>
          <Link
            href="/vendors"
            className="hidden items-center gap-1 text-sm font-medium text-primary transition-colors hover:underline md:flex"
          >
            查看全部
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
          {featuredVendors.map((vendor) => (
            <Link
              key={vendor.id}
              href={`/vendors/${vendor.id}`}
              className="group min-w-[280px] shrink-0 snap-start"
            >
              <div className="overflow-hidden rounded-2xl border bg-white transition-all group-hover:shadow-lg">
                {/* Banner */}
                <div className="h-24 bg-gradient-to-br from-primary/10 to-accent/10" />
                <div className="relative px-5 pb-5">
                  {/* Avatar overlapping banner */}
                  <div className="-mt-6 mb-3 flex h-12 w-12 items-center justify-center rounded-xl border bg-white shadow-sm">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary">
                    {vendor.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {vendor.city}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className="rounded-full text-xs"
                    >
                      {vendor.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold">{vendor.rating}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    已完成 {vendor.completedProjects} 個案件
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-4 text-center md:hidden">
          <Link
            href="/vendors"
            className="text-sm font-medium text-primary hover:underline"
          >
            查看全部廠商 →
          </Link>
        </div>
      </div>
    </section>
  );
}
