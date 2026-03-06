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
import { createClient } from "@/lib/supabase/client";
import { GraduationCap, ImageIcon, Info, Users } from "lucide-react";

const SCHOOL_TYPES = [
  { value: "elementary", label: "國民小學" },
  { value: "junior_high", label: "國民中學" },
  { value: "senior_high", label: "高級中學" },
  { value: "vocational", label: "高級職業學校" },
  { value: "comprehensive", label: "綜合高中" },
  { value: "special", label: "特殊教育學校" },
  { value: "other", label: "其他" },
];

export default function SchoolProfilePage() {
  const [loading, setLoading] = useState(false);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    school_name: "",
    contact_person: "",
    phone: "",
    email: "",
    city: "",
    district: "",
    address: "",
    school_type: "",
    // 新增欄位
    logo_url: "",
    gallery_urls: [] as string[],
    student_count: "",
    founded_year: "",
    principal_name: "",
    school_code: "",
    introduction: "",
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
        setSchoolId(data.id);
        setProfile({
          school_name: data.school_name || "",
          contact_person: data.contact_person || "",
          phone: data.phone || "",
          email: data.email || "",
          city: data.city || "",
          district: data.district || "",
          address: data.address || "",
          school_type: data.school_type || "",
          logo_url: data.logo_url || "",
          gallery_urls: data.gallery_urls || [],
          student_count: data.student_count?.toString() || "",
          founded_year: data.founded_year?.toString() || "",
          principal_name: data.principal_name || "",
          school_code: data.school_code || "",
          introduction: data.introduction || "",
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

    const updateData = {
      school_name: profile.school_name,
      contact_person: profile.contact_person,
      phone: profile.phone,
      email: profile.email,
      city: profile.city || null,
      district: profile.district || null,
      address: profile.address || null,
      school_type: profile.school_type || null,
      logo_url: profile.logo_url || null,
      gallery_urls:
        profile.gallery_urls.length > 0 ? profile.gallery_urls : null,
      student_count: profile.student_count
        ? parseInt(profile.student_count)
        : null,
      founded_year: profile.founded_year
        ? parseInt(profile.founded_year)
        : null,
      principal_name: profile.principal_name || null,
      school_code: profile.school_code || null,
      introduction: profile.introduction || null,
    };

    const { error } = await supabase
      .from("school_profiles")
      .update(updateData)
      .eq("user_id", user.id);

    if (error) {
      toast.error("更新失敗");
    } else {
      toast.success("資料已更新");
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* 學校形象 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            學校形象
          </CardTitle>
          <CardDescription>上傳學校標誌和校園環境照片</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo */}
          <div className="space-y-2">
            <Label>學校標誌 / 校徽</Label>
            <ImageUpload
              value={profile.logo_url || null}
              onChange={(url) =>
                setProfile({ ...profile, logo_url: (url as string) || "" })
              }
              bucket="profile-images"
              folder="school-logos"
              multiple={false}
              maxSizeMB={2}
            />
          </div>

          {/* 校園照片 */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              校園環境照片
            </Label>
            <p className="text-sm text-muted-foreground">
              上傳校園環境照片，讓廠商更了解學校的設施與環境
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
              folder="school-gallery"
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
          <CardDescription>學校基本資訊與聯絡方式</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>學校名稱 *</Label>
                  <Input
                    value={profile.school_name}
                    onChange={(e) =>
                      setProfile({ ...profile, school_name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>學校代碼</Label>
                  <Input
                    value={profile.school_code}
                    placeholder="例：013601"
                    onChange={(e) =>
                      setProfile({ ...profile, school_code: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>學校類型</Label>
                  <select
                    value={profile.school_type}
                    onChange={(e) =>
                      setProfile({ ...profile, school_type: e.target.value })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">請選擇</option>
                    {SCHOOL_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>校長姓名</Label>
                  <Input
                    value={profile.principal_name}
                    placeholder="例：王大明"
                    onChange={(e) =>
                      setProfile({ ...profile, principal_name: e.target.value })
                    }
                  />
                </div>
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

              <div className="grid gap-4 sm:grid-cols-3">
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
                <div className="col-span-full space-y-2 sm:col-span-1">
                  <Label>地址</Label>
                  <Input
                    value={profile.address}
                    placeholder="完整地址"
                    onChange={(e) =>
                      setProfile({ ...profile, address: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* 學校規模 */}
            <div className="space-y-4 rounded-lg border p-4">
              <h4 className="flex items-center gap-2 font-medium">
                <Users className="h-4 w-4" />
                學校規模
              </h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>學生人數</Label>
                  <Input
                    type="number"
                    value={profile.student_count}
                    placeholder="例：1200"
                    min="1"
                    onChange={(e) =>
                      setProfile({ ...profile, student_count: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>創校年份</Label>
                  <Input
                    type="number"
                    value={profile.founded_year}
                    placeholder="例：1965"
                    min="1800"
                    max={new Date().getFullYear()}
                    onChange={(e) =>
                      setProfile({ ...profile, founded_year: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* 學校介紹 */}
            <div className="space-y-2">
              <Label>學校介紹</Label>
              <Textarea
                rows={5}
                value={profile.introduction}
                placeholder="介紹學校的教育理念、特色課程、校園文化等"
                onChange={(e) =>
                  setProfile({ ...profile, introduction: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                完整的學校介紹可以幫助廠商更了解您的學校，提供更適合的服務
              </p>
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
