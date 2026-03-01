import Link from "next/link";
import { Building2, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface VendorCardProps {
  id: string;
  companyName: string;
  description: string | null;
  city: string | null;
  categories: { name: string }[];
  totalCompletedProjects: number;
}

export function VendorCard({
  id,
  companyName,
  description,
  city,
  categories,
  totalCompletedProjects,
}: VendorCardProps) {
  return (
    <Link href={`/vendors/${id}`} className="group">
      <div className="h-full overflow-hidden rounded-2xl border bg-white transition-all group-hover:shadow-lg">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-br from-primary/10 to-accent/10" />

        <div className="relative px-5 pb-5">
          {/* Avatar overlapping banner */}
          <div className="-mt-6 mb-3 flex h-12 w-12 items-center justify-center rounded-xl border bg-white shadow-sm">
            <Building2 className="h-6 w-6 text-primary" />
          </div>

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

          {/* Bottom: stats + CTA */}
          <div className="mt-4 flex items-center justify-between">
            {totalCompletedProjects > 0 ? (
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs text-muted-foreground">
                  已完成 {totalCompletedProjects} 案件
                </span>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">新加入</span>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="mt-3 w-full rounded-full transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-white"
          >
            查看詳情
          </Button>
        </div>
      </div>
    </Link>
  );
}
