export type DisplayLocation =
  | "homepage"
  | "student_dashboard"
  | "referral_page"
  | "public_referral"
  | "consultation"
  | "university_listing"
  | "blog"
  | "country_page"
  | "success_stories"
  | "global";

export interface CmsBanner {
  id: string;
  desktop_image_url: string;
  mobile_image_url?: string;
  target_destination?: string;
  display_location: DisplayLocation;
  title?: string;
  link_url?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
