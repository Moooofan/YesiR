import { notFound } from "next/navigation";
import Link from "next/link";
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
} from "lucide-react";
import { formatBudget } from "@/lib/utils";

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
      school_profiles (school_name, city, district)
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

          {/* School Info */}
          {project.school_profiles && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border-l-4 border-primary bg-muted/30 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-bold">
                  {project.school_profiles.school_name}
                </div>
                {project.school_profiles.city && (
                  <div className="text-xs text-muted-foreground">
                    {project.school_profiles.city}
                    {project.school_profiles.district &&
                      ` ${project.school_profiles.district}`}
                  </div>
                )}
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
