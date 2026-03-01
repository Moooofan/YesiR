import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, Clock, FileText } from "lucide-react";
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS } from "@/lib/constants";
import type { ApplicationStatus } from "@/types";

export default async function VendorApplicationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: vendorProfile } = await supabase
    .from("vendor_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!vendorProfile) redirect("/vendor/profile");

  const { data: applications } = await supabase
    .from("applications")
    .select(
      `
      id,
      cover_letter,
      proposed_budget,
      proposed_timeline,
      status,
      created_at,
      projects (id, title, status, categories (name))
    `
    )
    .eq("vendor_id", vendorProfile.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">我的應徵</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          追蹤您的所有應徵狀態
        </p>
      </div>

      {applications && applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => {
            const project = app.projects as unknown as {
              id: string;
              title: string;
              categories: { name: string } | null;
            } | null;

            return (
              <Card key={app.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      {project?.categories && (
                        <Badge variant="secondary" className="text-xs">
                          {project.categories.name}
                        </Badge>
                      )}
                      <CardTitle className="mt-1 text-base">
                        <Link
                          href={`/projects/${project?.id}`}
                          className="hover:text-primary"
                        >
                          {project?.title}
                        </Link>
                      </CardTitle>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${APPLICATION_STATUS_COLORS[app.status as ApplicationStatus] || ""}`}
                    >
                      {APPLICATION_STATUS_LABELS[app.status as ApplicationStatus]}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    {app.proposed_budget && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5" />
                        報價 NT$ {app.proposed_budget.toLocaleString()}
                      </span>
                    )}
                    {app.proposed_timeline && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {app.proposed_timeline}
                      </span>
                    )}
                    {app.cover_letter && (
                      <span className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" />
                        已附提案說明
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 text-6xl">📭</div>
          <h3 className="text-lg font-semibold">尚無應徵記錄</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            瀏覽案件後，可以向感興趣的案件提出應徵
          </p>
        </div>
      )}
    </div>
  );
}
