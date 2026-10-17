import React from "react";
import AuditLogsClient from "./AuditLogsClient";
import { getAdminAuditLogs } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminAuditLogsPage() {
  const initialLogs = await getAdminAuditLogs(50);
  return <AuditLogsClient initialLogs={initialLogs} />;
}

