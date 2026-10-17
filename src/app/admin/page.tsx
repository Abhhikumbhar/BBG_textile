import React from "react";
import DashboardClient from "./DashboardClient";
import { getAdminDashboardData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const initialData = await getAdminDashboardData();
  return <DashboardClient initialData={initialData} />;
}

