-- ============================================================
-- Fix: RLS infinite recursion between projects <-> applications
-- ============================================================
-- Problem: projects SELECT policy queries applications,
--          applications SELECT policy queries projects → infinite loop
-- Solution: Use SECURITY DEFINER functions to bypass RLS in sub-queries

-- 1. Helper: get project IDs that current user (as vendor) has applied to
CREATE OR REPLACE FUNCTION public.user_applied_project_ids()
RETURNS SETOF UUID AS $$
  SELECT a.project_id
  FROM public.applications a
  JOIN public.vendor_profiles vp ON a.vendor_id = vp.id
  WHERE vp.user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 2. Helper: get project IDs owned by current user's school
CREATE OR REPLACE FUNCTION public.user_school_project_ids()
RETURNS SETOF UUID AS $$
  SELECT p.id
  FROM public.projects p
  JOIN public.school_profiles sp ON p.school_id = sp.id
  WHERE sp.user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 3. Drop old problematic policies
DROP POLICY IF EXISTS "Open projects readable" ON public.projects;
DROP POLICY IF EXISTS "Relevant applications readable" ON public.applications;

-- 4. Recreate with helper functions (no cross-table RLS triggering)
CREATE POLICY "Open projects readable" ON public.projects
  FOR SELECT USING (
    status = 'open'
    OR school_id IN (SELECT id FROM public.school_profiles WHERE user_id = auth.uid())
    OR id IN (SELECT public.user_applied_project_ids())
  );

CREATE POLICY "Relevant applications readable" ON public.applications
  FOR SELECT USING (
    vendor_id IN (SELECT id FROM public.vendor_profiles WHERE user_id = auth.uid())
    OR project_id IN (SELECT public.user_school_project_ids())
  );
