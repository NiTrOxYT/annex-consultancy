import { Metadata } from "next";
import ReferralPageClient from "@/app/referral/referral-client";

export const metadata: Metadata = {
  title: "Referral Program | ANNEX Consultancy",
  description: "Refer students to ANNEX Consultancy and earn ₹10,000 for every successful admission. Unlimited referrals. Trusted education consultancy.",
  openGraph: {
    title: "Referral Program | ANNEX Consultancy",
    description: "Refer students to ANNEX Consultancy and earn ₹10,000 for every successful admission.",
    url: "https://www.annex-consultancy.com/referral",
    siteName: "ANNEX Consultancy",
    type: "website"
  },
  alternates: {
    canonical: "/referral"
  }
};

export default function ReferralPage() {
  return <ReferralPageClient />;
}
