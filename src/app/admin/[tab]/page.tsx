"use client";

import * as React from "react";
import AdminDashboard from "../page";

export default function AdminTabPage({ params }: { params: Promise<{ tab: string }> }) {
  // Resolve dynamic segment parameters asynchronously (Next.js 15+ convention)
  const resolvedParams = React.use(params);
  
  return <AdminDashboard initialTab={resolvedParams.tab} />;
}
