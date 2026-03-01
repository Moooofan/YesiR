import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, DollarSign, Clock } from "lucide-react";
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS } from "@/lib/constants";
import { updateApplicationStatus } from "@/actions/application";
import type { ApplicationStatus } from "@/types";

export default async function SchoolApplicationsPage() {
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

  if (!schoolProfile) redirect("/school/profile");

  // Get all applications for the school's projects
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
      projects!inner (id, title, school_id),
      vendor_profiles (id, company_name, phone, email)
    `
    )
    .eq("projects.school_id", schoolProfile.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">應徵管理</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          查看和管理廠商對您案件的應徵
        </p>
      </div>

      {applications && applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => {
            const vendor = app.vendor_profiles as unknown as {
              company_name: string;
              phone: string;
              email: string;
            } | null;
            const project = app.projects as unknown as {
              title: string;
            } | null;

            return (
              <Card key={app.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        案件：{project?.title}
                      </p>
                      <CardTitle className="mt-1 flex items-center gap-2 text-base">
                        <Building2 className="h-4 w-4 text-primary" />
                        {vendor?.company_name}
                      </CardTitle>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${APPLICATION_STATUS_COLORS[app.status as ApplicationStatus] || ""}`}
                    >
                      {APPLICATION_STATUS_LABELS[app.status as ApplicationStatus]}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {app.cover_letter && (
                    <p className="text-sm text-muted-foreground">
                      {app.cover_letter}
                    </p>
                  )}

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
                  </div>

                  {app.status === "pending" && (
                    <div className="flex gap-2 pt-2">
                      <form
                        action={async () => {
                          "use server";
                          await updateApplicationStatus(app.id, "accepted");
                        }}
                      >
                        <Button size="sm" type="submit">
                          接受
                        </Button>
                      </form>
                      <form
                        action={async () => {
                          "use server";
                          await updateApplicationStatus(app.id, "rejected");
                        }}
                      >
                        <Button size="sm" variant="outline" type="submit">
                          婉拒
                        </Button>
                      </form>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 text-6xl">📬</div>
          <h3 className="text-lg font-semibold">尚無應徵</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            當廠商對您的案件提出應徵時，會顯示在這裡
          </p>
        </div>
      )}
    </div>
  );
}
