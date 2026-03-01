import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MapPin,
  Calendar,
  DollarSign,
  GraduationCap,
} from "lucide-react";
import { formatBudget } from "@/lib/utils";

export default async function VendorBrowseProjectsPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select(
      `
      id,
      title,
      description,
      budget_type,
      budget_min,
      budget_max,
      deadline,
      location,
      application_count,
      created_at,
      categories (name),
      school_profiles (school_name, city)
    `
    )
    .eq("status", "open")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">瀏覽案件</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          查看最新的校園服務需求，找到適合您的案件
        </p>
      </div>

      {projects && projects.length > 0 ? (
        <div className="space-y-4">
          {projects.map((project) => {
            const cat = project.categories as unknown as { name: string } | null;
            const school = project.school_profiles as unknown as {
              school_name: string;
              city: string | null;
            } | null;

            return (
              <Card key={project.id} className="transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    {cat && (
                      <Badge variant="secondary" className="text-xs">
                        {cat.name}
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className="text-xs text-green-600 border-green-200"
                    >
                      招募中
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5" />
                      {formatBudget(
                        project.budget_type,
                        project.budget_min,
                        project.budget_max
                      )}
                    </span>
                    {project.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {project.location}
                      </span>
                    )}
                    {project.deadline && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {project.deadline}
                      </span>
                    )}
                    {school && (
                      <span className="flex items-center gap-1">
                        <GraduationCap className="h-3.5 w-3.5" />
                        {school.school_name}
                      </span>
                    )}
                  </div>

                  <div className="pt-2">
                    <Button size="sm" asChild>
                      <Link href={`/projects/${project.id}`}>查看詳情</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 text-6xl">📋</div>
          <h3 className="text-lg font-semibold">目前沒有公開案件</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            當有新案件發布時，會顯示在這裡
          </p>
        </div>
      )}
    </div>
  );
}
