-- ============================================================
-- RPC function for keyword search across vendor profiles
-- Searches: company_name, description, AND category names
-- ============================================================

CREATE OR REPLACE FUNCTION public.search_vendors(search_term TEXT)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  company_name TEXT,
  description TEXT,
  city TEXT,
  total_completed_projects INT,
  avg_rating DECIMAL(3,2),
  is_verified BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    vp.id,
    vp.user_id,
    vp.company_name,
    vp.description,
    vp.city,
    vp.total_completed_projects,
    vp.avg_rating,
    vp.is_verified
  FROM public.vendor_profiles vp
  LEFT JOIN public.vendor_categories vc ON vc.vendor_id = vp.id
  LEFT JOIN public.categories c ON c.id = vc.category_id
  WHERE vp.is_published = TRUE
    AND (
      vp.company_name ILIKE '%' || search_term || '%'
      OR vp.description ILIKE '%' || search_term || '%'
      OR c.name ILIKE '%' || search_term || '%'
      OR c.description ILIKE '%' || search_term || '%'
    )
  ORDER BY vp.total_completed_projects DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
