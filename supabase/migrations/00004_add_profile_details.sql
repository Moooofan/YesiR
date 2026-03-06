-- ============================================================
-- 擴充廠商和學校資料 - 讓 Profile 更像可經營的頁面
-- ============================================================

-- 1. 廠商資料新增欄位
ALTER TABLE public.vendor_profiles
ADD COLUMN IF NOT EXISTS capital_amount BIGINT,  -- 資本額（元）
ADD COLUMN IF NOT EXISTS established_year INT,    -- 成立年份
ADD COLUMN IF NOT EXISTS employee_count INT,      -- 員工人數
ADD COLUMN IF NOT EXISTS gallery_urls TEXT[],     -- 公司環境/作品照片
ADD COLUMN IF NOT EXISTS service_areas TEXT[],    -- 服務區域
ADD COLUMN IF NOT EXISTS certifications TEXT,     -- 認證資格
ADD COLUMN IF NOT EXISTS business_hours TEXT;     -- 營業時間

-- 2. 學校資料新增欄位
ALTER TABLE public.school_profiles
ADD COLUMN IF NOT EXISTS logo_url TEXT,           -- 學校標誌
ADD COLUMN IF NOT EXISTS gallery_urls TEXT[],     -- 校園環境照片
ADD COLUMN IF NOT EXISTS student_count INT,       -- 學生人數
ADD COLUMN IF NOT EXISTS founded_year INT,        -- 創校年份
ADD COLUMN IF NOT EXISTS principal_name TEXT,     -- 校長姓名
ADD COLUMN IF NOT EXISTS school_code TEXT,        -- 學校代碼
ADD COLUMN IF NOT EXISTS introduction TEXT;       -- 學校介紹

-- 3. 建立 Storage Bucket（用於圖片上傳）
-- 注意：這需要在 Supabase Dashboard 或透過 API 執行
-- 以下是建議的 bucket 設定（SQL 無法直接建立，需手動設定）：
--
-- Bucket Name: profile-images
-- Public: true
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/png, image/webp, image/gif

-- 4. 為 gallery_urls 添加 comment 說明
COMMENT ON COLUMN public.vendor_profiles.gallery_urls IS '公司環境或作品照片 URL 陣列，最多 6 張';
COMMENT ON COLUMN public.vendor_profiles.capital_amount IS '資本額，單位：新台幣元';
COMMENT ON COLUMN public.vendor_profiles.service_areas IS '服務區域陣列，如 ["台北市", "新北市"]';

COMMENT ON COLUMN public.school_profiles.gallery_urls IS '校園環境照片 URL 陣列，最多 6 張';
COMMENT ON COLUMN public.school_profiles.student_count IS '學生總人數';
COMMENT ON COLUMN public.school_profiles.introduction IS '學校簡介，可包含教育理念、特色等';
