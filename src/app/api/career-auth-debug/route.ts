import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email parameter" }, { status: 400 });
  }

  let authUserExists = false;
  let emailConfirmed = false;
  let authUserId: string | null = null;
  let profileExists = false;
  let profileTable = "none";
  let linkedCorrectly = false;
  let loginPossible = false;
  let failureReason = "";

  try {
    // 1. Check if auth user exists using the check_auth_user_status RPC helper
    const { data: authData, error: authError } = await supabase
      .rpc("check_auth_user_status", { email_to_check: email });

    if (authError) {
      console.warn("[Diagnostic Debug] RPC auth check failed:", authError.message);
      if (authError.message.includes("does not exist")) {
        failureReason = "Database schema helper functions do not exist. Please run migration 004_create_training_placement.sql first.";
        return NextResponse.json({
          authUserExists,
          emailConfirmed,
          profileExists,
          profileTable,
          linkedCorrectly,
          loginPossible,
          failureReason
        });
      }
    } else if (authData && authData.length > 0) {
      authUserExists = true;
      emailConfirmed = authData[0].email_confirmed;
      authUserId = authData[0].user_id;
    }

    // 2. Query profile in training_students
    let trainingStudent: any = null;
    let trainingErrorMsg: string | null = null;
    try {
      const { data, error } = await supabase
        .from("training_students")
        .select("id, auth_user_id, status")
        .eq("student_email", email)
        .maybeSingle();
      
      if (error) {
        trainingErrorMsg = error.message;
      } else {
        trainingStudent = data;
      }
    } catch (e: any) {
      trainingErrorMsg = e.message;
    }

    if (trainingErrorMsg && trainingErrorMsg.includes("does not exist")) {
      failureReason = "Database tables do not exist. Please run migration 004_create_training_placement.sql first.";
      return NextResponse.json({
        authUserExists,
        emailConfirmed,
        profileExists,
        profileTable,
        linkedCorrectly,
        loginPossible,
        failureReason
      });
    }

    let standardStudent: any = null;
    if (!trainingStudent) {
      // Check standard students
      const { data } = await supabase
        .from("students")
        .select("id, auth_user_id, status")
        .eq("email", email)
        .maybeSingle();
      standardStudent = data;
    }

    let profileStatus: string | null = null;
    let profileAuthUserId: string | null = null;

    if (trainingStudent) {
      profileExists = true;
      profileTable = "training_students";
      profileStatus = trainingStudent.status;
      profileAuthUserId = trainingStudent.auth_user_id;
    } else if (standardStudent) {
      profileExists = true;
      profileTable = "students";
      profileStatus = standardStudent.status;
      profileAuthUserId = standardStudent.auth_user_id;
    }

    // 3. Linkage validation
    if (authUserId && profileAuthUserId && authUserId === profileAuthUserId) {
      linkedCorrectly = true;
    }

    // 4. Decide why login might fail
    if (!authUserExists) {
      failureReason = "No user found in Supabase Auth matching this email address.";
    } else if (!emailConfirmed) {
      failureReason = "The Supabase Auth account exists but email is not confirmed. This blocks password sign-in unless email confirmation is disabled or the auto-confirm database trigger is active.";
    } else if (!profileExists) {
      failureReason = `User exists in Auth (ID: ${authUserId}) but no corresponding profile row was found in 'training_students' or 'students'.`;
    } else if (!linkedCorrectly) {
      failureReason = `Profile found in '${profileTable}' table, but is not linked to the Auth User ID (Profile links to: ${profileAuthUserId || "null"}, Auth User ID is: ${authUserId}).`;
    } else if (profileStatus !== "Active") {
      failureReason = `The student profile is linked, but has status '${profileStatus}' instead of 'Active'.`;
    } else {
      loginPossible = true;
      failureReason = "none";
    }

    return NextResponse.json({
      authUserExists,
      emailConfirmed,
      profileExists,
      profileTable,
      linkedCorrectly,
      loginPossible,
      failureReason
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
