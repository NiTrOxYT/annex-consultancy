export interface EligibilityLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  qualification: string;
  percentage: number;
  budget: number;
  currency: string;
  preferred_country: string;
  preferred_course: string;
  test_type: string | null;
  test_score: number | null;
  intake: string;
  lead_score: 'Hot' | 'Warm' | 'Cold';
  lead_score_value: number;
  priority: 'High' | 'Medium' | 'Low';
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
  referral_code: string | null;
  assigned_counselor_id: string | null;
  lead_status: 'New' | 'Contacted' | 'Qualified' | 'Unqualified' | 'Converted';
  first_contacted_at: string | null;
  response_time_minutes: number | null;
  created_at: string;
  updated_at: string;
}

export interface EligibilityMatch {
  id: string;
  lead_id: string;
  university_id: string;
  university_name_snapshot: string;
  match_score: number;
  admission_chance: 'Safe' | 'Target' | 'Ambitious';
  scholarship_estimate: string | null;
  created_at: string;
}

export interface EligibilityAssignment {
  id: string;
  lead_id: string;
  old_counselor_id: string | null;
  new_counselor_id: string | null;
  assigned_at: string;
  assigned_by: string | null;
}

export interface EligibilityReminder {
  id: string;
  lead_id: string;
  title: string;
  due_at: string;
  completed: boolean;
  completed_at: string | null;
  completed_by: string | null;
  completion_note: string | null;
  created_at: string;
}

export interface EligibilityActivity {
  id: string;
  lead_id: string;
  activity_type: string;
  description: string;
  created_by: string | null;
  created_at: string;
}

export interface EligibilityNote {
  id: string;
  lead_id: string;
  counselor_id: string | null;
  note: string;
  created_at: string;
}
