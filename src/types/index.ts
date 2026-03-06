export type UserRole = "school" | "vendor";

export type ProjectStatus =
  | "draft"
  | "open"
  | "in_progress"
  | "completed"
  | "cancelled";

export type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "withdrawn";

export type BudgetType = "fixed" | "range" | "negotiable";

export interface Profile {
  id: string;
  role: UserRole;
  display_name: string;
  avatar_url: string | null;
  phone: string | null;
  email: string;
  is_profile_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon_name: string | null;
  display_order: number;
  is_active: boolean;
}

export interface VendorProfile {
  id: string;
  user_id: string;
  company_name: string;
  contact_person: string;
  phone: string;
  email: string;
  description: string | null;
  logo_url: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  tax_id: string | null;
  is_verified: boolean;
  is_published: boolean;
  total_completed_projects: number;
  avg_rating: number;
  // 新增欄位
  capital_amount: number | null;
  established_year: number | null;
  employee_count: number | null;
  gallery_urls: string[] | null;
  service_areas: string[] | null;
  certifications: string | null;
  business_hours: string | null;
  created_at: string;
  updated_at: string;
  categories?: Category[];
}

export interface SchoolProfile {
  id: string;
  user_id: string;
  school_name: string;
  contact_person: string;
  phone: string;
  email: string;
  city: string | null;
  district: string | null;
  address: string | null;
  school_type: string | null;
  total_posted_projects: number;
  // 新增欄位
  logo_url: string | null;
  gallery_urls: string[] | null;
  student_count: number | null;
  founded_year: number | null;
  principal_name: string | null;
  school_code: string | null;
  introduction: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  school_id: string;
  title: string;
  description: string;
  category_id: number;
  budget_min: number | null;
  budget_max: number | null;
  budget_type: BudgetType;
  deadline: string | null;
  application_deadline: string | null;
  location: string | null;
  requirements: string | null;
  attachment_urls: string[] | null;
  status: ProjectStatus;
  selected_vendor_id: string | null;
  application_count: number;
  view_count: number;
  created_at: string;
  updated_at: string;
  category?: Category;
  school?: SchoolProfile;
}

export interface Application {
  id: string;
  project_id: string;
  vendor_id: string;
  cover_letter: string | null;
  proposed_budget: number | null;
  proposed_timeline: string | null;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  project?: Project;
  vendor?: VendorProfile;
}

export interface Conversation {
  id: string;
  school_user_id: string;
  vendor_user_id: string;
  last_message_at: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}
