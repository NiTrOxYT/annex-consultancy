"use client";

import * as React from "react";
import AdminDashboard from "../page";

export default function AdminTabPage({ params }: { params: { tab?: string } | Promise<{ tab?: string }> }) {
  const [activeTabName, setActiveTabName] = React.useState<string>("bookings");

  React.useEffect(() => {
    Promise.resolve(params).then((p) => {
      if (p?.tab) {
        setActiveTabName(p.tab);
      }
    });
  }, [params]);

  return <AdminDashboard initialTab={activeTabName} />;
}
