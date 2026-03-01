import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Calendar, Users } from "lucide-react";
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from "@/lib/constants";
import type { ProjectStatus } from "@/types";

export default async function SchoolProjectsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: schoolProfile } = await supabase
    .from("school_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!schoolProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-lg font-semibold">請先完成學校資料</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          發案前需要先填寫學校基本資料
        </p>
        <Button className="mt-4" asChild>
          <Link href="/school/profile">填寫學校資料</Link>
        </Button>
      </div>
    );
  }

  const { data: projects } = await supabase
    .from("projects")
    .select(
      `
      id,
      title,
      status,
      budget_type,
      budget_min,
      budget_max,
      deadline,
      application_count,
      created_at,
      categories (name)
    `
    )
    .eq("school_id", schoolProfile.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">我的案件</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            管理您發布的所有案件
          </p>
        </div>
        <Button asChild>
          <Link href="/school/projects/new" className="gap-1">
            <Plus className="h-4 w-4" />
            發布新案件
          </Link>
        </Button>
      </div>

      {projects && projects.length > 0 ? (
        <div className="space-y-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      {project.categories && (
                        <Badge variant="secondary" className="text-xs">
                          {(project.categories as unknown as { name: string }).name}
                        </Badge>
                      )}
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${PROJECT_STATUS_COLORS[project.status as ProjectStatus] || ""}`}
                      >
                        {PROJECT_STATUS_LABELS[project.status as ProjectStatus]}
                      </span>
                    </div>
                    <CardTitle className="mt-2 text-base">
                      <Link
                        href={`/projects/${project.id}`}
                        className="hover:text-primary"
                      >
                        {project.title}
                      </Link>
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {project.deadline && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {project.deadline}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {project.application_count} 位應徵
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 text-6xl">📋</div>
          <h3 className="text-lg font-semibold">尚無案件</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            點擊上方「發布新案件」開始您的第一個案件
          </p>
        </div>
      )}
    </div>
  );
}
