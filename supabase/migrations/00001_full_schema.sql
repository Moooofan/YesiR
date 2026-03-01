-- ============================================================
-- YesiR 校管家 — Complete Database Schema
-- ============================================================

-- 1. Enums
CREATE TYPE user_role AS ENUM ('school', 'vendor');
CREATE TYPE project_status AS ENUM ('draft', 'open', 'in_progress', 'completed', 'cancelled');
CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');

-- 2. Utility function: auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Profiles (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  display_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  phone TEXT,
  email TEXT NOT NULL,
  is_profile_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, display_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'school')::user_role,
    COALESCE(NEW.raw_user_meta_data->>'display_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Categories
CREATE TABLE public.categories (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.categories (name, slug, description, icon_name, display_order) VALUES
  ('校園維修', 'campus-maintenance', '水電、土木、設備維修等校園修繕服務', 'Wrench', 1),
  ('清潔服務', 'cleaning-service', '校園環境清潔、消毒、除蟲等服務', 'Sparkles', 2),
  ('教材採購', 'teaching-materials', '教科書、教具、文具等教學物資採購', 'BookOpen', 3),
  ('活動策劃', 'event-planning', '校慶、運動會、畢業典禮等活動籌辦', 'PartyPopper', 4),
  ('IT設備', 'it-equipment', '電腦、網路、投影機等資訊設備採購與維護', 'Monitor', 5),
  ('餐飲服務', 'catering-service', '營養午餐、活動餐飲、團膳服務', 'UtensilsCrossed', 6),
  ('交通接送', 'transportation', '校外教學、畢業旅行等交通安排', 'Bus', 7),
  ('印刷服務', 'printing-service', '學習單、聯絡簿、畢業紀念冊等印刷品', 'Printer', 8);

-- 5. Vendor Profiles
CREATE TABLE public.vendor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  address TEXT,
  city TEXT,
  tax_id TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  total_completed_projects INT DEFAULT 0,
  avg_rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER vendor_profiles_updated_at
  BEFORE UPDATE ON public.vendor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX idx_vendor_profiles_user_id ON public.vendor_profiles(user_id);
CREATE INDEX idx_vendor_profiles_is_published ON public.vendor_profiles(is_published);

-- 6. Vendor <-> Categories (many-to-many)
CREATE TABLE public.vendor_categories (
  vendor_id UUID NOT NULL REFERENCES public.vendor_profiles(id) ON DELETE CASCADE,
  category_id BIGINT NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (vendor_id, category_id)
);

CREATE INDEX idx_vendor_categories_category ON public.vendor_categories(category_id);

-- 7. School Profiles
CREATE TABLE public.school_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT,
  district TEXT,
  address TEXT,
  school_type TEXT,
  total_posted_projects INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER school_profiles_updated_at
  BEFORE UPDATE ON public.school_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX idx_school_profiles_user_id ON public.school_profiles(user_id);

-- 8. Projects
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.school_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id BIGINT NOT NULL REFERENCES public.categories(id),
  budget_min INT,
  budget_max INT,
  budget_type TEXT DEFAULT 'negotiable',
  deadline DATE,
  application_deadline DATE,
  location TEXT,
  requirements TEXT,
  attachment_urls TEXT[],
  status project_status DEFAULT 'draft',
  selected_vendor_id UUID REFERENCES public.vendor_profiles(id),
  application_count INT DEFAULT 0,
  view_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX idx_projects_school_id ON public.projects(school_id);
CREATE INDEX idx_projects_category_id ON public.projects(category_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_created_at ON public.projects(created_at DESC);

-- 9. Applications
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES public.vendor_profiles(id) ON DELETE CASCADE,
  cover_letter TEXT,
  proposed_budget INT,
  proposed_timeline TEXT,
  status application_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (project_id, vendor_id)
);

CREATE TRIGGER applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX idx_applications_project_id ON public.applications(project_id);
CREATE INDEX idx_applications_vendor_id ON public.applications(vendor_id);

-- 10. RPC: Increment application count
CREATE OR REPLACE FUNCTION public.increment_application_count(p_project_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.projects
  SET application_count = application_count + 1
  WHERE id = p_project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Row Level Security
-- ============================================================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Own profile editable" ON public.profiles FOR UPDATE USING ((SELECT auth.uid()) = id);

-- Categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories readable" ON public.categories FOR SELECT USING (true);

-- Vendor Profiles
ALTER TABLE public.vendor_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published vendors readable" ON public.vendor_profiles
  FOR SELECT USING (is_published = TRUE OR user_id = (SELECT auth.uid()));
CREATE POLICY "Own vendor insertable" ON public.vendor_profiles
  FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY "Own vendor editable" ON public.vendor_profiles
  FOR UPDATE USING (user_id = (SELECT auth.uid()));

-- Vendor Categories
ALTER TABLE public.vendor_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Vendor categories readable" ON public.vendor_categories FOR SELECT USING (true);
CREATE POLICY "Own vendor categories insertable" ON public.vendor_categories
  FOR INSERT WITH CHECK (vendor_id IN (SELECT id FROM public.vendor_profiles WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "Own vendor categories deletable" ON public.vendor_categories
  FOR DELETE USING (vendor_id IN (SELECT id FROM public.vendor_profiles WHERE user_id = (SELECT auth.uid())));

-- School Profiles
ALTER TABLE public.school_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Schools readable" ON public.school_profiles FOR SELECT USING (true);
CREATE POLICY "Own school insertable" ON public.school_profiles
  FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY "Own school editable" ON public.school_profiles
  FOR UPDATE USING (user_id = (SELECT auth.uid()));

-- Projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Open projects readable" ON public.projects
  FOR SELECT USING (
    status = 'open'
    OR school_id IN (SELECT id FROM public.school_profiles WHERE user_id = (SELECT auth.uid()))
    OR id IN (SELECT a.project_id FROM public.applications a JOIN public.vendor_profiles vp ON a.vendor_id = vp.id WHERE vp.user_id = (SELECT auth.uid()))
  );
CREATE POLICY "Own projects insertable" ON public.projects
  FOR INSERT WITH CHECK (school_id IN (SELECT id FROM public.school_profiles WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "Own projects editable" ON public.projects
  FOR UPDATE USING (school_id IN (SELECT id FROM public.school_profiles WHERE user_id = (SELECT auth.uid())));

-- Applications
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Relevant applications readable" ON public.applications
  FOR SELECT USING (
    vendor_id IN (SELECT id FROM public.vendor_profiles WHERE user_id = (SELECT auth.uid()))
    OR project_id IN (SELECT p.id FROM public.projects p JOIN public.school_profiles sp ON p.school_id = sp.id WHERE sp.user_id = (SELECT auth.uid()))
  );
CREATE POLICY "Vendors can apply" ON public.applications
  FOR INSERT WITH CHECK (vendor_id IN (SELECT id FROM public.vendor_profiles WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "Application updatable by stakeholders" ON public.applications
  FOR UPDATE USING (
    vendor_id IN (SELECT id FROM public.vendor_profiles WHERE user_id = (SELECT auth.uid()))
    OR project_id IN (SELECT p.id FROM public.projects p JOIN public.school_profiles sp ON p.school_id = sp.id WHERE sp.user_id = (SELECT auth.uid()))
  );
