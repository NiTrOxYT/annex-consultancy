export type ReferralStatus = 
  | 'lead' 
  | 'contacted' 
  | 'application_started' 
  | 'offer_received' 
  | 'visa_approved' 
  | 'enrolled' 
  | 'rewarded';

export interface Referral {
  id: string;
  referrer_student_id: string;
  referral_code: string;
  referred_name: string;
  referred_email: string;
  referred_phone: string | null;
  preferred_country: string;
  preferred_intake: string;
  status: ReferralStatus;
  reward_amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  
  // Joined fields
  students?: {
    name: string;
    email: string;
  };
  referral_rewards?: ReferralReward | null;
}

export interface ReferralReward {
  id: string;
  referral_id: string;
  reward_type: string;
  reward_amount: number;
  issued_at: string;
  notes: string | null;
}

export interface ReferralAnalytics {
  totalReferrals: number;
  activeReferrers: number;
  enrollments: number;
  conversionRate: number;
  rewardsPaid: number;
  monthlyTrend: MonthlyTrend[];
  funnelStages: FunnelStage[];
  topReferrers: TopReferrer[];
}

export interface MonthlyTrend {
  month: string; // e.g. "Jan", "Feb"
  count: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
}

export interface TopReferrer {
  referrerName: string;
  referrerEmail: string;
  referralsCount: number;
  rewardsTotal: number;
}
