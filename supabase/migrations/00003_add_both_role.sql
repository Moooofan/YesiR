-- ============================================================
-- Allow one email to have both school and vendor roles
-- ============================================================

-- Add 'both' value to the user_role enum
ALTER TYPE user_role ADD VALUE 'both';
