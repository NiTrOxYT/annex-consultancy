import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

const db = supabaseAdmin || supabase;

// Interface mapping for matching algorithm
interface University {
  id: string;
  name: string;
  country: string;
  city: string;
  category: string;
  course_type: string;
  total_fees: string | null;
  cutoff: string | null;
  logo_url: string | null;
  intake: string | null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      email,
      qualification,
      percentage,
      budget,
      currency,
      preferredCountry,
      preferredCourse,
      testType,
      testScore,
      intake,
      referralCode,
      utmSource,
      utmMedium,
      utmCampaign,
      referrer
    } = body;

    // 1. Inputs validation
    if (!name || !phone || !email || !qualification || !percentage || !budget || !preferredCountry || !preferredCourse || !intake) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const pct = Number(percentage);
    const bdgt = Number(budget);
    const scoreVal = testScore ? Number(testScore) : null;

    if (isNaN(pct) || pct < 0 || pct > 100) {
      return NextResponse.json({ error: "Invalid academic percentage" }, { status: 400 });
    }
    if (isNaN(bdgt) || bdgt <= 0) {
      return NextResponse.json({ error: "Invalid budget amount" }, { status: 400 });
    }

    // 2. Least-loaded counselor assignment routing
    let assignedCounselorId: string | null = null;
    let counselorWhatsApp: string | null = null;

    const { data: counselors, error: counselorErr } = await db
      .from("counselors")
      .select("id, phone, is_active")
      .eq("is_active", true);

    if (!counselorErr && counselors && counselors.length > 0) {
      // Query standard student workload per active counselor
      const { data: studentCounts } = await db
        .from("students")
        .select("counselor_id");

      const workloadMap: { [key: string]: number } = {};
      counselors.forEach(c => { workloadMap[c.id] = 0; });

      if (studentCounts) {
        studentCounts.forEach((s: any) => {
          if (s.counselor_id && workloadMap[s.counselor_id] !== undefined) {
            workloadMap[s.counselor_id]++;
          }
        });
      }

      // Find counselor with lowest active load
      let leastLoadedId = counselors[0].id;
      let minLoad = workloadMap[counselors[0].id];

      for (let i = 1; i < counselors.length; i++) {
        const cId = counselors[i].id;
        if (workloadMap[cId] < minLoad) {
          minLoad = workloadMap[cId];
          leastLoadedId = cId;
        }
      }

      assignedCounselorId = leastLoadedId;
      const matchedCounselor = counselors.find(c => c.id === leastLoadedId);
      counselorWhatsApp = matchedCounselor?.phone || null;
    }

    // 3. Lead score & Priority derivation
    // Academic (40%), English test score (30%), Budget (30%)
    let academicScore = pct * 0.4;
    let testScorePoints = 0;
    if (scoreVal) {
      if (testType === "IELTS" && scoreVal >= 6.5) testScorePoints = 30;
      else if (testType === "IELTS" && scoreVal >= 6.0) testScorePoints = 20;
      else if (testType === "PTE" && scoreVal >= 58) testScorePoints = 30;
      else if (testType === "PTE" && scoreVal >= 50) testScorePoints = 20;
      else testScorePoints = 10;
    } else {
      testScorePoints = 15; // not taken fallback
    }

    let budgetPoints = 0;
    // Standardize currency evaluation relative to base limits
    // standard budget check for hot limit (~15,000 in USD/GBP/AUD or 15L in INR/NPR)
    if (currency === "INR" || currency === "NPR") {
      if (bdgt >= 1500000) budgetPoints = 30;
      else if (bdgt >= 1000000) budgetPoints = 20;
      else budgetPoints = 10;
    } else {
      if (bdgt >= 15000) budgetPoints = 30;
      else if (bdgt >= 10000) budgetPoints = 20;
      else budgetPoints = 10;
    }

    const leadScoreValue = Math.round(academicScore + testScorePoints + budgetPoints);
    let leadScore: "Hot" | "Warm" | "Cold" = "Cold";
    if (leadScoreValue >= 80) leadScore = "Hot";
    else if (leadScoreValue >= 50) leadScore = "Warm";

    // Priority derivation
    let priority: "High" | "Medium" | "Low" = "Low";
    if (leadScore === "Hot" && ((["INR", "NPR"].includes(currency) && bdgt >= 1500000) || (!["INR", "NPR"].includes(currency) && bdgt >= 15000))) {
      priority = "High";
    } else if (leadScore === "Warm" || leadScore === "Hot") {
      priority = "Medium";
    }

    // 4. University Matching & Score Optimizations
    const mappedCourseType = ["+2", "High School"].includes(qualification)
      ? "Undergraduate"
      : "Postgraduate";

    // Query published universities applying country and course type filters first
    const { data: universitiesList, error: uniErr } = await db
      .from("universities")
      .select("*")
      .eq("published", true)
      .eq("country", preferredCountry)
      .eq("course_type", mappedCourseType);

    const matches: any[] = [];
    if (!uniErr && universitiesList) {
      universitiesList.forEach((uni: University) => {
        let matchScoreVal = 0;

        // Cutoff matching (35 points)
        let cutoffMeet = true;
        if (uni.cutoff && scoreVal) {
          const ieltsMatch = uni.cutoff.match(/IELTS\s*(\d+(\.\d+)?)/i);
          if (ieltsMatch) {
            const minScore = parseFloat(ieltsMatch[1]);
            cutoffMeet = scoreVal >= minScore;
          }
        }
        matchScoreVal += cutoffMeet ? 35 : 10;

        // Fees budget matching (35 points)
        let feesMeet = true;
        if (uni.total_fees) {
          // Extract numeric digits from fees string
          const cleanFee = uni.total_fees.replace(/,/g, "");
          const feeDigits = cleanFee.match(/\d+/);
          if (feeDigits) {
            const parsedFee = parseInt(feeDigits[0], 10);
            feesMeet = bdgt >= parsedFee;
          }
        }
        matchScoreVal += feesMeet ? 35 : 10;

        // Course interest category mapping (30 points)
        const categoryMatch = uni.category && preferredCourse && 
          (uni.category.toLowerCase().includes(preferredCourse.toLowerCase()) || 
           preferredCourse.toLowerCase().includes(uni.category.toLowerCase()));
        matchScoreVal += categoryMatch ? 30 : 10;

        // Caps score at 100
        matchScoreVal = Math.min(matchScoreVal, 100);

        // Derive chance category
        let chance: "Safe" | "Target" | "Ambitious" = "Ambitious";
        if (matchScoreVal >= 80) chance = "Safe";
        else if (matchScoreVal >= 60) chance = "Target";

        matches.push({
          university_id: uni.id,
          university_name_snapshot: uni.name,
          match_score: matchScoreVal,
          admission_chance: chance,
          scholarship_estimate: pct >= 80 ? "Academic Merit Scholarship Eligible" : "Standard Bursary Eligible",
          logo_url: uni.logo_url
        });
      });
    }

    // Sort matches by match_score descending
    matches.sort((a, b) => b.match_score - a.match_score);

    // 5. Duplicate Protection Check (30-day window)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: existingLeads, error: dupCheckErr } = await db
      .from("eligibility_leads")
      .select("id")
      .or(`email.eq.${email},phone.eq.${phone}`)
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: false });

    let leadId: string;
    let isDuplicate = false;

    if (!dupCheckErr && existingLeads && existingLeads.length > 0) {
      leadId = existingLeads[0].id;
      isDuplicate = true;

      // Update existing lead fields
      const { error: updateErr } = await db
        .from("eligibility_leads")
        .update({
          name,
          phone,
          email,
          qualification,
          percentage: pct,
          budget: bdgt,
          currency,
          preferred_country: preferredCountry,
          preferred_course: preferredCourse,
          test_type: testType || null,
          test_score: scoreVal,
          intake,
          lead_score: leadScore,
          lead_score_value: leadScoreValue,
          priority,
          utm_source: utmSource || null,
          utm_medium: utmMedium || null,
          utm_campaign: utmCampaign || null,
          referrer: referrer || null,
          referral_code: referralCode || null,
          assigned_counselor_id: assignedCounselorId,
          updated_at: new Date().toISOString()
        })
        .eq("id", leadId);

      if (updateErr) throw updateErr;

      // Clear out old matches for the updated lead
      await db.from("eligibility_matches").delete().eq("lead_id", leadId);

      // Log activity "Lead Assessment Re-run"
      await db.from("eligibility_activities").insert([{
        lead_id: leadId,
        activity_type: "Lead Updated",
        description: "Re-run eligibility assessment from calculator.",
        created_by: null
      }]);
    } else {
      // Insert new eligibility lead row
      const { data: newLead, error: insertErr } = await db
        .from("eligibility_leads")
        .insert([{
          name,
          phone,
          email,
          qualification,
          percentage: pct,
          budget: bdgt,
          currency,
          preferred_country: preferredCountry,
          preferred_course: preferredCourse,
          test_type: testType || null,
          test_score: scoreVal,
          intake,
          lead_score: leadScore,
          lead_score_value: leadScoreValue,
          priority,
          utm_source: utmSource || null,
          utm_medium: utmMedium || null,
          utm_campaign: utmCampaign || null,
          referrer: referrer || null,
          referral_code: referralCode || null,
          assigned_counselor_id: assignedCounselorId,
          lead_status: "New"
        }])
        .select()
        .single();

      if (insertErr || !newLead) throw insertErr || new Error("Failed to insert lead");
      leadId = newLead.id;

      // Log activity "Lead Created"
      await db.from("eligibility_activities").insert([{
        lead_id: leadId,
        activity_type: "Lead Created",
        description: "Lead submitted qualification profile via eligibility calculator.",
        created_by: null
      }]);

      // Schedule automated reminders (Day 1, 3, 7, 14)
      const now = new Date();
      const remindersToInsert = [
        { lead_id: leadId, title: "Day 1 Follow-up: New lead outreach", due_at: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString() },
        { lead_id: leadId, title: "Day 3 Follow-up: Profile check-in", due_at: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString() },
        { lead_id: leadId, title: "Day 7 Follow-up: University choices review", due_at: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString() },
        { lead_id: leadId, title: "Day 14 Follow-up: Final validation", due_at: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString() }
      ];
      await db.from("eligibility_reminders").insert(remindersToInsert);
    }

    // 6. Insert new match results to eligibility_matches
    if (matches.length > 0) {
      const matchesToInsert = matches.map(m => ({
        lead_id: leadId,
        university_id: m.university_id,
        university_name_snapshot: m.university_name_snapshot,
        match_score: m.match_score,
        admission_chance: m.admission_chance,
        scholarship_estimate: m.scholarship_estimate
      }));
      await db.from("eligibility_matches").insert(matchesToInsert);
    }

    // 7. Referral Integration Hook
    if (referralCode && !isDuplicate) {
      // Find matching referrer student
      const { data: referrerStudent } = await db
        .from("students")
        .select("id, name")
        .eq("referral_code", referralCode)
        .single();

      if (referrerStudent) {
        // Log in standard referrals table
        await db.from("referrals").insert([{
          referrer_student_id: referrerStudent.id,
          referral_code: referralCode,
          referred_name: name,
          referred_email: email,
          referred_phone: phone,
          preferred_country: preferredCountry,
          preferred_intake: intake,
          status: "lead"
        }]);

        // Send dashboard notification alert to referrer
        await db.from("student_notifications").insert([{
          student_id: referrerStudent.id,
          title: "New Referral Registered! 🎯",
          content: `Your friend "${name}" checked their study abroad eligibility. Track their progress in your Referrals registry.`
        }]);
      }
    }

    // 8. Generate WhatsApp share and direct template URLs
    const formattedScore = matches.length > 0 ? matches[0].match_score : 0;
    const whatsappMsgText = `Hello, I completed the Annex Consultancy Eligibility Calculator.
Name: ${name}
Country: ${preferredCountry}
Course: ${preferredCourse}
Match Score: ${formattedScore}%

I’d like a consultation.`;

    const counselorPhoneClean = counselorWhatsApp ? counselorWhatsApp.replace(/[^0-9]/g, "") : "9779800000000"; // fallback business number
    const whatsappRedirectUrl = `https://wa.me/${counselorPhoneClean}?text=${encodeURIComponent(whatsappMsgText)}`;

    return NextResponse.json({
      success: true,
      leadId,
      matchScore: formattedScore,
      leadScore,
      priority,
      matches: matches.slice(0, 8), // return top 8 matching universities to client
      whatsappRedirectUrl
    });
  } catch (err: any) {
    console.error("API POST Eligibility Check Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
