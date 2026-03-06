import Link from "next/link";
import Image from "next/image";
import { Building2, MapPin, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StartConversationButton } from "@/components/messaging/start-conversation-button";

interface VendorCardProps {
  id: string;
  companyName: string;
  description: string | null;
  city: string | null;
  categories: { name: string }[];
  totalCompletedProjects: number;
  logoUrl?: string | null;
  employeeCount?: number | null;
  establishedYear?: number | null;
  userId?: string;
}

export function VendorCard({
  id,
  companyName,
  description,
  city,
  categories,
  totalCompletedProjects,
  logoUrl,
  employeeCount,
  establishedYear,
  userId,
}: VendorCardProps) {
  const currentYear = new Date().getFullYear();
  const yearsInBusiness = establishedYear ? currentYear - establishedYear : null;

  return (
    <Link href={`/vendors/${id}`} className="group">
      <div className="h-full overflow-hidden rounded-2xl border bg-white transition-all group-hover:shadow-lg">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-br from-primary/10 to-accent/10" />

        <div className="relative px-5 pb-5">
          {/* Avatar overlapping banner */}
          {logoUrl ? (
            <div className="relative -mt-6 mb-3 h-12 w-12 overflow-hidden rounded-xl border bg-white shadow-sm">
              <Image
                src={logoUrl}
                alt={`${companyName} Logo`}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="-mt-6 mb-3 flex h-12 w-12 items-center justify-center rounded-xl border bg-white shadow-sm">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
          )}

          {/* Company name & location */}
          <h3 className="truncate text-base font-bold text-foreground transition-colors group-hover:text-primary">
            {companyName}
          </h3>
          {city && (
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {city}
            </p>
          )}

          {/* Description */}
          {description && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {description}
            </p>
          )}

          {/* Categories */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {categories.slice(0, 2).map((cat) => (
              <Badge
                key={cat.name}
                variant="secondary"
                className="rounded-full text-xs"
              >
                {cat.name}
              </Badge>
            ))}
            {categories.length > 2 && (
              <Badge variant="outline" className="rounded-full text-xs">
                +{categories.length - 2}
              </Badge>
            )}
          </div>

          {/* Bottom: stats */}
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {totalCompletedProjects > 0 ? (
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>已完成 {totalCompletedProjects} 案件</span>
              </div>
            ) : (
              <span>新加入</span>
            )}
            {employeeCount && (
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                <span>{employeeCount} 人</span>
              </div>
            )}
            {yearsInBusiness !== null && yearsInBusiness > 0 && (
              <span>{yearsInBusiness}+ 年經驗</span>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 rounded-full transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-white"
            >
              查看詳情
            </Button>
            {userId && <StartConversationButton vendorUserId={userId} />}
          </div>
        </div>
      </div>
    </Link>
  );
}
