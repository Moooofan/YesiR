import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
  Users,
  Calendar,
  Clock,
  Award,
  Banknote,
} from "lucide-react";

function formatCapital(amount: number): string {
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(1)} 億`;
  }
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(0)} 萬`;
  }
  return amount.toLocaleString();
}

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

  const currentYear = new Date().getFullYear();
  const yearsInBusiness = vendor.established_year
    ? currentYear - vendor.established_year
    : null;

  return (
    <div>
      {/* Banner with gallery or gradient */}
      {vendor.gallery_urls && vendor.gallery_urls.length > 0 ? (
        <div className="relative h-64 md:h-80">
          <Image
            src={vendor.gallery_urls[0]}
            alt={`${vendor.company_name} 公司照片`}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10" />
      )}

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
            {vendor.logo_url ? (
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border">
                <Image
                  src={vendor.logo_url}
                  alt={`${vendor.company_name} Logo`}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/8">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            )}
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
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl bg-primary/5 p-4 text-center">
              <div className="text-2xl font-extrabold text-primary">
                {vendor.total_completed_projects}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">完成案件</div>
            </div>
            {vendor.avg_rating > 0 && (
              <div className="rounded-xl bg-primary/5 p-4 text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-extrabold text-primary">
                  <Star className="h-5 w-5 fill-primary" />
                  {Number(vendor.avg_rating).toFixed(1)}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  平均評分
                </div>
              </div>
            )}
            {yearsInBusiness !== null && (
              <div className="rounded-xl bg-primary/5 p-4 text-center">
                <div className="text-2xl font-extrabold text-primary">
                  {yearsInBusiness}+
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  營運年資
                </div>
              </div>
            )}
            {vendor.employee_count && (
              <div className="rounded-xl bg-primary/5 p-4 text-center">
                <div className="text-2xl font-extrabold text-primary">
                  {vendor.employee_count}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  員工人數
                </div>
              </div>
            )}
          </div>

          {/* Company Info */}
          {(vendor.capital_amount ||
            vendor.established_year ||
            vendor.business_hours ||
            vendor.certifications) && (
            <div className="mt-6 grid gap-3 rounded-xl border p-4 sm:grid-cols-2">
              {vendor.capital_amount && (
                <div className="flex items-center gap-3">
                  <Banknote className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">資本額</div>
                    <div className="font-medium">
                      NT$ {formatCapital(vendor.capital_amount)}
                    </div>
                  </div>
                </div>
              )}
              {vendor.established_year && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">成立年份</div>
                    <div className="font-medium">{vendor.established_year} 年</div>
                  </div>
                </div>
              )}
              {vendor.business_hours && (
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">營業時間</div>
                    <div className="font-medium">{vendor.business_hours}</div>
                  </div>
                </div>
              )}
              {vendor.certifications && (
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">認證資格</div>
                    <div className="font-medium">{vendor.certifications}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {vendor.description && (
            <div className="mt-6">
              <h3 className="mb-2 font-bold">公司介紹</h3>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {vendor.description}
              </p>
            </div>
          )}

          {/* Gallery */}
          {vendor.gallery_urls && vendor.gallery_urls.length > 1 && (
            <div className="mt-6">
              <h3 className="mb-3 font-bold">公司環境 / 作品展示</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {vendor.gallery_urls.slice(1).map((url: string, index: number) => (
                  <div
                    key={url}
                    className="relative aspect-video overflow-hidden rounded-xl"
                  >
                    <Image
                      src={url}
                      alt={`${vendor.company_name} 照片 ${index + 2}`}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                  </div>
                ))}
              </div>
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
              {vendor.address && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {vendor.address}
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
