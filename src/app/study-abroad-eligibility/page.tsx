import * as React from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import EligibilityCalculator from "@/components/EligibilityCalculator";

export const metadata = {
  title: "Study Abroad Eligibility Calculator | Annex Consultancy",
  description: "Check your academic and budget eligibility for top international universities. Get instant admission chance evaluation (Safe, Target, Ambitious) and scholarship estimates.",
};

export default function StudyAbroadEligibilityPage() {
  return (
    <>
      <Navigation />
      
      <main className="flex-grow pt-32 pb-24 bg-white text-left">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <EligibilityCalculator />
        </div>
      </main>

      <Footer />
    </>
  );
}
