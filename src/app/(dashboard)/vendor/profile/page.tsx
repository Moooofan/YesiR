"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CATEGORIES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

export default function VendorProfilePage() {
  const [loading, setLoading] = useState(false);
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [profile, setProfile] = useState({
    company_name: "",
    contact_person: "",
    phone: "",
    email: "",
    description: "",
    website: "",
    address: "",
    city: "",
    tax_id: "",
  });

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("vendor_profiles")
        .select("*, vendor_categories(category_id)")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setVendorId(data.id);
        setProfile({
          company_name: data.company_name || "",
          contact_person: data.contact_person || "",
          phone: data.phone || "",
          email: data.email || "",
          description: data.description || "",
          website: data.website || "",
          address: data.address || "",
          city: data.city || "",
          tax_id: data.tax_id || "",
        });
        setSelectedCategories(
          data.vendor_categories?.map(
            (vc: { category_id: number }) => vc.category_id
          ) || []
        );
      }
    }
    loadProfile();
  }, []);

  function toggleCategory(id: number) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!vendorId) return;
    setLoading(true);

    const supabase = createClient();

    // Update profile
    const { error } = await supabase
      .from("vendor_profiles")
      .update(profile)
      .eq("id", vendorId);

    if (error) {
      toast.error("更新失敗");
      setLoading(false);
      return;
    }

    // Update categories: delete all then re-insert
    await supabase
      .from("vendor_categories")
      .delete()
      .eq("vendor_id", vendorId);

    if (selectedCategories.length > 0) {
      await supabase.from("vendor_categories").insert(
        selectedCategories.map((catId) => ({
          vendor_id: vendorId,
          category_id: catId,
        }))
      );
    }

    toast.success("資料已更新");
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>公司資料</CardTitle>
          <CardDescription>管理您的廠商基本資訊</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>公司名稱</Label>
                <Input
                  value={profile.company_name}
                  onChange={(e) =>
                    setProfile({ ...profile, company_name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>聯絡人</Label>
                  <Input
                    value={profile.contact_person}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        contact_person: e.target.value,
                      })
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
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>統一編號</Label>
                  <Input
                    value={profile.tax_id}
                    onChange={(e) =>
                      setProfile({ ...profile, tax_id: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>公司介紹</Label>
                <Textarea
                  rows={4}
                  value={profile.description}
                  placeholder="介紹您公司的服務和優勢"
                  onChange={(e) =>
                    setProfile({ ...profile, description: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>網站</Label>
                  <Input
                    value={profile.website}
                    placeholder="https://..."
                    onChange={(e) =>
                      setProfile({ ...profile, website: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>所在縣市</Label>
                  <Input
                    value={profile.city}
                    placeholder="例：台北市"
                    onChange={(e) =>
                      setProfile({ ...profile, city: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>公司地址</Label>
                <Input
                  value={profile.address}
                  placeholder="完整地址"
                  onChange={(e) =>
                    setProfile({ ...profile, address: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <Label>服務類別</Label>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => {
                  const selected = selectedCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`rounded-lg border p-3 text-left text-sm transition-all ${
                        selected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
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
