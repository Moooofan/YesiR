import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  GraduationCap,
  School,
} from "lucide-react";
import { formatBudget } from "@/lib/utils";

const SCHOOL_TYPE_LABELS: Record<string, string> = {
  elementary: "國民小學",
  junior_high: "國民中學",
  senior_high: "高級中學",
  vocational: "高級職業學校",
  comprehensive: "綜合高中",
  special: "特殊教育學校",
  other: "其他",
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select(
      `
      *,
      categories (name, slug),
      school_profiles (
        school_name, city, district, address,
        logo_url, school_type, student_count, founded_year, introduction
      )
    `
    )
    .eq("id", id)
    .single();

  if (!project) notFound();

  const budgetDisplay = formatBudget(
    project.budget_type,
    project.budget_min,
    project.budget_max
  );

  const school = project.school_profiles;
  const schoolTypeLabel = school?.school_type
    ? SCHOOL_TYPE_LABELS[school.school_type] || school.school_type
    : null;

  return (
    <div>
      {/* Banner */}
      <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10" />

      <div className="relative z-10 mx-auto -mt-24 max-w-4xl px-4 pb-10">
        <Link
          href="/projects"
          className="mb-4 inline-flex items-center gap-1 text-sm text-white/70 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          返回案件列表
        </Link>

        <div className="rounded-2xl border bg-white p-6 shadow-lg md:p-8">
          {/* Badges */}
          <div className="flex items-center gap-2">
            {project.categories && (
              <Badge variant="secondary" className="rounded-full">
                {project.categories.name}
              </Badge>
            )}
            <Badge
              className={`rounded-full border-0 ${
                project.status === "open"
                  ? "bg-green-50 text-green-700"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {project.status === "open" ? "招募中" : project.status}
            </Badge>
          </div>

          <h1 className="mt-3 text-2xl font-extrabold">{project.title}</h1>

          {/* Budget prominent display */}
          <div className="mt-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <span className="text-2xl font-extrabold text-primary">
              {budgetDisplay}
            </span>
          </div>

          {/* Details Grid */}
          <div className="mt-6 grid gap-3 rounded-xl bg-muted/50 p-4 sm:grid-cols-2">
            {project.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">地點：</span>
                <span className="font-medium">{project.location}</span>
              </div>
            )}
            {project.deadline && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">截止日期：</span>
                <span className="font-medium">{project.deadline}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">已應徵：</span>
              <span className="font-medium">
                {project.application_count} 位廠商
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h3 className="mb-2 font-bold">案件描述</h3>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          </div>

          {/* Requirements */}
          {project.requirements && (
            <div className="mt-6">
              <h3 className="mb-2 font-bold">特殊需求 / 資格要求</h3>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {project.requirements}
              </p>
            </div>
          )}

          {/* School Info - Enhanced */}
          {school && (
            <div className="mt-6 rounded-xl border bg-gradient-to-br from-primary/5 to-transparent p-5">
              <h3 className="mb-4 flex items-center gap-2 font-bold">
                <School className="h-5 w-5 text-primary" />
                發案學校
              </h3>
              <div className="flex gap-4">
                {/* School Logo */}
                {school.logo_url ? (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border">
                    <Image
                      src={school.logo_url}
                      alt={`${school.school_name} 校徽`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/8">
                    <GraduationCap className="h-8 w-8 text-primary" />
                  </div>
                )}

                {/* School Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">
                      {school.school_name}
                    </span>
                    {schoolTypeLabel && (
                      <Badge variant="outline" className="text-xs">
                        {schoolTypeLabel}
                      </Badge>
                    )}
                  </div>

                  {/* Location */}
                  {(school.city || school.address) && (
                    <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {school.address ||
                        `${school.city}${school.district ? ` ${school.district}` : ""}`}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {school.student_count && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        學生人數：{school.student_count.toLocaleString()} 人
                      </span>
                    )}
                    {school.founded_year && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        創校：{school.founded_year} 年
                      </span>
                    )}
                  </div>

                  {/* Introduction */}
                  {school.introduction && (
                    <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                      {school.introduction}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          {project.status === "open" && (
            <div className="mt-8">
              <Button
                size="lg"
                className="w-full rounded-full text-base font-semibold"
                asChild
              >
                <Link href="/login">登入後應徵此案件</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
