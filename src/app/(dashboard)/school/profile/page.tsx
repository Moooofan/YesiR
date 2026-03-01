"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function SchoolProfilePage() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    school_name: "",
    contact_person: "",
    phone: "",
    email: "",
    city: "",
    district: "",
    address: "",
  });

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("school_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setProfile({
          school_name: data.school_name || "",
          contact_person: data.contact_person || "",
          phone: data.phone || "",
          email: data.email || "",
          city: data.city || "",
          district: data.district || "",
          address: data.address || "",
        });
      }
    }
    loadProfile();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("school_profiles")
      .update(profile)
      .eq("user_id", user.id);

    if (error) {
      toast.error("更新失敗");
    } else {
      toast.success("資料已更新");
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>學校資料</CardTitle>
          <CardDescription>管理您的學校基本資訊</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>學校名稱</Label>
              <Input
                value={profile.school_name}
                onChange={(e) =>
                  setProfile({ ...profile, school_name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>聯絡人</Label>
                <Input
                  value={profile.contact_person}
                  onChange={(e) =>
                    setProfile({ ...profile, contact_person: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>聯絡電話</Label>
                <Input
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>縣市</Label>
                <Input
                  value={profile.city}
                  placeholder="例：台北市"
                  onChange={(e) =>
                    setProfile({ ...profile, city: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>區域</Label>
                <Input
                  value={profile.district}
                  placeholder="例：大安區"
                  onChange={(e) =>
                    setProfile({ ...profile, district: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>地址</Label>
              <Input
                value={profile.address}
                placeholder="完整地址"
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "儲存中..." : "儲存變更"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
