"use client";

import React, { useState, useEffect } from "react";
import { History, Shield, Clock, Loader2, User } from "lucide-react";

interface AuditLog {
  id: string;
  action: string;
  details?: string | null;
  ipAddress?: string | null;
  createdAt: string;
  adminUser?: { name: string; email: string; role: string } | null;
}

interface AuditLogsClientProps {
  initialLogs?: AuditLog[];
}

export default function AuditLogsClient({ initialLogs = [] }: AuditLogsClientProps) {
  const [logs, setLogs] = useState<AuditLog[]>(initialLogs);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/audit-logs")
      .then((res) => res.json())
      .then((data) => {
        if (data?.logs) setLogs(data.logs);
      })
      .catch(() => console.error("Failed to load logs"));
  }, []);

  const getActionBadge = (action: string) => {
    if (action.includes("DELETE")) return "bg-red-100 text-red-800";
    if (action.includes("CREATE")) return "bg-emerald-100 text-emerald-800";
    if (action.includes("UPDATE")) return "bg-blue-100 text-blue-800";
    if (action.includes("LOGIN")) return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
          Security & Audit Logging
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
          Immutable audit record of all administrative actions, logins, product modifications, and order status changes.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading && logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-[#1A365D] animate-spin mb-2" />
            <p className="text-gray-400 text-xs">Querying security audit logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-xs">
            No audit records logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Action Type</th>
                  <th className="py-3 px-4">Admin Account</th>
                  <th className="py-3 px-4">Action Details</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${getActionBadge(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-semibold text-gray-900">
                          {log.adminUser?.name || "System"}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400">
                        {log.adminUser?.email}
                      </p>
                    </td>

                    <td className="py-3 px-4 text-gray-700">
                      {log.details || "—"}
                    </td>

                    <td className="py-3 px-4 text-gray-400 text-[11px] whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
