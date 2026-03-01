import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  ArrowLeft,
  CheckCircle2,
  Star,
} from "lucide-react";

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: vendor } = await supabase
    .from("vendor_profiles")
    .select(
      `
      *,
      vendor_categories (
        categories (name, slug)
      )
    `
    )
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (!vendor) notFound();

  const categories =
    vendor.vendor_categories?.map(
      (vc: { categories: { name: string; slug: string } }) => vc.categories
    ) || [];

  return (
    <div>
      {/* Banner */}
      <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10" />

      <div className="relative z-10 mx-auto -mt-24 max-w-4xl px-4 pb-10">
        <Link
          href="/vendors"
          className="mb-4 inline-flex items-center gap-1 text-sm text-white/70 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          返回廠商列表
        </Link>

        <div className="rounded-2xl border bg-white p-6 shadow-lg md:p-8">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/8">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold">
                  {vendor.company_name}
                </h1>
                {vendor.is_verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                    <CheckCircle2 className="h-3.5 w-3.5" /> 已認證
                  </span>
                )}
              </div>
              {vendor.city && (
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {vendor.address || vendor.city}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((cat: { name: string }) => (
                  <Badge
                    key={cat.name}
                    variant="secondary"
                    className="rounded-full"
                  >
                    {cat.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-primary/5 p-4 text-center">
              <div className="text-3xl font-extrabold text-primary">
                {vendor.total_completed_projects}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                完成案件
              </div>
            </div>
            {vendor.avg_rating > 0 && (
              <div className="rounded-xl bg-primary/5 p-4 text-center">
                <div className="flex items-center justify-center gap-1 text-3xl font-extrabold text-primary">
                  <Star className="h-6 w-6 fill-primary" />
                  {Number(vendor.avg_rating).toFixed(1)}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  平均評分
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {vendor.description && (
            <div className="mt-6">
              <h3 className="mb-2 font-bold">公司介紹</h3>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {vendor.description}
              </p>
            </div>
          )}

          {/* Contact Info */}
          <div className="mt-6">
            <h3 className="mb-3 font-bold">聯繫資訊</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                {vendor.phone}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                {vendor.email}
              </div>
              {vendor.website && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <a
                    href={vendor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {vendor.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8">
            <Button
              size="lg"
              className="w-full rounded-full text-base font-semibold"
              asChild
            >
              <Link href="/register?role=school">發案給此廠商</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
