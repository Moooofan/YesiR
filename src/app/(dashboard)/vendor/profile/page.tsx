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
import { ImageUpload } from "@/components/ui/image-upload";
import { CATEGORIES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { Building2, ImageIcon, Info, Users } from "lucide-react";

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
    // 新增欄位
    logo_url: "",
    capital_amount: "",
    established_year: "",
    employee_count: "",
    business_hours: "",
    certifications: "",
    service_areas: [] as string[],
    gallery_urls: [] as string[],
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
          logo_url: data.logo_url || "",
          capital_amount: data.capital_amount?.toString() || "",
          established_year: data.established_year?.toString() || "",
          employee_count: data.employee_count?.toString() || "",
          business_hours: data.business_hours || "",
          certifications: data.certifications || "",
          service_areas: data.service_areas || [],
          gallery_urls: data.gallery_urls || [],
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

    // 準備更新資料
    const updateData = {
      company_name: profile.company_name,
      contact_person: profile.contact_person,
      phone: profile.phone,
      email: profile.email,
      description: profile.description || null,
      website: profile.website || null,
      address: profile.address || null,
      city: profile.city || null,
      tax_id: profile.tax_id || null,
      logo_url: profile.logo_url || null,
      capital_amount: profile.capital_amount
        ? parseInt(profile.capital_amount)
        : null,
      established_year: profile.established_year
        ? parseInt(profile.established_year)
        : null,
      employee_count: profile.employee_count
        ? parseInt(profile.employee_count)
        : null,
      business_hours: profile.business_hours || null,
      certifications: profile.certifications || null,
      service_areas:
        profile.service_areas.length > 0 ? profile.service_areas : null,
      gallery_urls:
        profile.gallery_urls.length > 0 ? profile.gallery_urls : null,
    };

    const { error } = await supabase
      .from("vendor_profiles")
      .update(updateData)
      .eq("id", vendorId);

    if (error) {
      toast.error("更新失敗");
      setLoading(false);
      return;
    }

    // Update categories
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
    <div className="mx-auto max-w-3xl space-y-6">
      {/* 公司 Logo 和封面 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            公司形象
          </CardTitle>
          <CardDescription>上傳公司 Logo 和展示圖片</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo */}
          <div className="space-y-2">
            <Label>公司 Logo</Label>
            <ImageUpload
              value={profile.logo_url || null}
              onChange={(url) =>
                setProfile({ ...profile, logo_url: (url as string) || "" })
              }
              bucket="profile-images"
              folder="vendor-logos"
              multiple={false}
              maxSizeMB={2}
            />
          </div>

          {/* 圖片展示 */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              公司環境/作品照片
            </Label>
            <p className="text-sm text-muted-foreground">
              上傳公司環境、服務案例或作品照片，讓學校更了解您的服務品質
            </p>
            <ImageUpload
              value={profile.gallery_urls}
              onChange={(urls) =>
                setProfile({
                  ...profile,
                  gallery_urls: (urls as string[]) || [],
                })
              }
              bucket="profile-images"
              folder="vendor-gallery"
              multiple={true}
              maxFiles={6}
              maxSizeMB={5}
            />
          </div>
        </CardContent>
      </Card>

      {/* 基本資料 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            基本資料
          </CardTitle>
          <CardDescription>公司基本資訊與聯絡方式</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>公司名稱 *</Label>
                <Input
                  value={profile.company_name}
                  onChange={(e) =>
                    setProfile({ ...profile, company_name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>聯絡人 *</Label>
                  <Input
                    value={profile.contact_person}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        contact_person: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>聯絡電話 *</Label>
                  <Input
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>統一編號</Label>
                  <Input
                    value={profile.tax_id}
                    onChange={(e) =>
                      setProfile({ ...profile, tax_id: e.target.value })
                    }
                    placeholder="8 位數字"
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

            {/* 公司規模 */}
            <div className="space-y-4 rounded-lg border p-4">
              <h4 className="flex items-center gap-2 font-medium">
                <Users className="h-4 w-4" />
                公司規模
              </h4>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>資本額（萬元）</Label>
                  <Input
                    type="number"
                    value={
                      profile.capital_amount
                        ? (parseInt(profile.capital_amount) / 10000).toString()
                        : ""
                    }
                    placeholder="例：500"
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        capital_amount: e.target.value
                          ? (parseInt(e.target.value) * 10000).toString()
                          : "",
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>成立年份</Label>
                  <Input
                    type="number"
                    value={profile.established_year}
                    placeholder="例：2010"
                    min="1900"
                    max={new Date().getFullYear()}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        established_year: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>員工人數</Label>
                  <Input
                    type="number"
                    value={profile.employee_count}
                    placeholder="例：20"
                    min="1"
                    onChange={(e) =>
                      setProfile({ ...profile, employee_count: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>營業時間</Label>
                  <Input
                    value={profile.business_hours}
                    placeholder="例：週一至週五 09:00-18:00"
                    onChange={(e) =>
                      setProfile({ ...profile, business_hours: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>認證資格</Label>
                  <Input
                    value={profile.certifications}
                    placeholder="例：ISO 9001、政府採購合格廠商"
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        certifications: e.target.value,
                      })
                    }
                  />
                </div>
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

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "儲存中..." : "儲存變更"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
