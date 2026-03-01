import { createClient } from "@/lib/supabase/server";
import { CATEGORIES } from "@/lib/constants";
import Link from "next/link";
import { Search, MapPin, Calendar, DollarSign, Users, SearchX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatBudget } from "@/lib/utils";

export const metadata = {
  title: "瀏覽案件 — YesiR 校管家",
  description: "瀏覽校管家上的最新校園服務需求",
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
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
      status,
      categories (id, name, slug),
      school_profiles (school_name, city)
    `
    )
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (params.category) {
    const cat = CATEGORIES.find((c) => c.slug === params.category);
    if (cat) {
      query = query.eq("category_id", cat.id);
    }
  }

  if (params.q) {
    query = query.ilike("title", `%${params.q}%`);
  }

  const { data: projects } = await query;

  return (
    <div>
      {/* Header */}
      <div className="bg-muted/50 py-10">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-3xl font-extrabold">瀏覽案件</h1>
          <p className="mt-2 text-muted-foreground">
            查看學校最新的服務需求
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <form
            className="flex items-center rounded-full border bg-white p-1 shadow-sm"
            action="/projects"
          >
            <Search className="ml-4 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              name="q"
              defaultValue={params.q}
              placeholder="搜尋案件標題..."
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
            <Link href="/projects">
              <Badge
                variant={!params.category ? "default" : "outline"}
                className={`cursor-pointer rounded-full ${!params.category ? "" : "hover:border-primary/50 hover:text-primary"}`}
              >
                全部
              </Badge>
            </Link>
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/projects?category=${cat.slug}`}>
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

        {/* Project List */}
        {projects && projects.length > 0 ? (
          <div className="grid gap-4">
            {projects.map((project: Record<string, unknown>) => {
              const cat = project.categories as { name: string } | null;
              const school = project.school_profiles as {
                school_name: string;
                city: string | null;
              } | null;
              const budget = formatBudget(
                project.budget_type as "fixed" | "range" | "negotiable",
                project.budget_min as number | null,
                project.budget_max as number | null
              );

              return (
                <Link
                  key={project.id as string}
                  href={`/projects/${project.id}`}
                >
                  <div className="group flex overflow-hidden rounded-2xl border bg-white transition-all hover:shadow-md">
                    {/* Left color strip */}
                    <div className="w-1 shrink-0 bg-primary" />

                    {/* Content */}
                    <div className="flex-1 p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        {cat && (
                          <Badge
                            variant="secondary"
                            className="rounded-full text-xs"
                          >
                            {cat.name}
                          </Badge>
                        )}
                        <Badge className="rounded-full border-0 bg-green-50 text-xs text-green-700">
                          招募中
                        </Badge>
                      </div>
                      <h3 className="mt-2 text-lg font-bold transition-colors group-hover:text-primary">
                        {project.title as string}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {project.description as string}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        {(project.location as string) && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {project.location as string}
                          </span>
                        )}
                        {(project.deadline as string) && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {project.deadline as string}
                          </span>
                        )}
                        {school && <span>{school.school_name}</span>}
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {project.application_count as number} 位應徵
                        </span>
                      </div>
                    </div>

                    {/* Right: budget */}
                    <div className="hidden flex-col items-end justify-center border-l bg-muted/30 p-5 sm:flex">
                      <span className="flex items-center gap-1 text-lg font-extrabold text-primary">
                        <DollarSign className="h-4 w-4" />
                        {budget}
                      </span>
                      <span className="mt-1 text-xs text-muted-foreground">
                        {project.application_count as number} 位應徵
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <SearchX className="mb-4 h-16 w-16 text-muted-foreground/30" />
            <h3 className="text-lg font-semibold">尚無案件</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              目前還沒有公開的案件，敬請期待
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
