"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  MessageSquare,
  Phone,
  Mail,
  Edit,
  Trash2,
  X,
  Check,
  Loader2,
  AlertCircle,
  Calendar,
} from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  message: string;
  status: "NEW" | "CONTACTED" | "IN_PROGRESS" | "RESOLVED";
  internalNotes?: string | null;
  product?: { name: string; sku: string } | null;
  createdAt: string;
}

interface EnquiriesAdminClientProps {
  initialEnquiries?: Enquiry[];
}

export default function EnquiriesAdminClient({ initialEnquiries = [] }: EnquiriesAdminClientProps) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);

  // Modal / Drawer state for editing status & notes
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [status, setStatus] = useState<string>("NEW");
  const [internalNotes, setInternalNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: string; msg: string } | null>(
    null
  );

  const fetchEnquiries = async () => {
    try {
      const query = new URLSearchParams();
      if (search) query.set("search", search);
      if (statusFilter !== "ALL") query.set("status", statusFilter);

      const res = await fetch(`/api/admin/enquiries?${query.toString()}`);
      const data = await res.json();
      if (data?.enquiries) {
        setEnquiries(data.enquiries);
      }
    } catch {
      console.error("Failed to fetch enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [search, statusFilter]);


  const openEditModal = (enq: Enquiry) => {
    setSelectedEnquiry(enq);
    setStatus(enq.status);
    setInternalNotes(enq.internalNotes || "");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${selectedEnquiry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, internalNotes }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Update failed");

      setNotification({
        type: "success",
        msg: "Enquiry status & internal notes updated",
      });
      setSelectedEnquiry(null);
      fetchEnquiries();
    } catch (err: any) {
      setNotification({
        type: "error",
        msg: err.message || "Failed to update enquiry",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry record?")) return;

    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setNotification({ type: "success", msg: "Enquiry record deleted" });
      fetchEnquiries();
    } catch {
      setNotification({ type: "error", msg: "Failed to delete enquiry" });
    }
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case "NEW":
        return "bg-purple-100 text-purple-800";
      case "CONTACTED":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-amber-100 text-amber-800";
      case "RESOLVED":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
          Customer & Wholesale Inquiries
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
          Inquiries received through the website contact form and product pages.
        </p>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <span>{notification.msg}</span>
          <button
            onClick={() => setNotification(null)}
            className="text-gray-400 hover:text-gray-600 font-bold ml-2"
          >
            &times;
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, phone, message content..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
        >
          <option value="ALL">All Inquiries</option>
          <option value="NEW">New (Uncontacted)</option>
          <option value="CONTACTED">Contacted</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading && enquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-[#1A365D] animate-spin mb-2" />
            <p className="text-gray-400 text-xs">Loading inquiries...</p>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-xs">
            No inquiries matching the selected criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Message / Requirement</th>
                  <th className="py-3 px-4">Related Product</th>
                  <th className="py-3 px-4">Internal Notes</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enquiries.map((enq) => {
                  const cleanPhone = enq.phone.replace(/[^0-9]/g, "");
                  return (
                    <tr key={enq.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-gray-900">{enq.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-gray-500">
                            {enq.phone}
                          </span>
                          <a
                            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                              `Hello ${enq.name}, thank you for contacting BBG Textile. Regarding your enquiry:`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:text-emerald-700"
                            title="Reply on WhatsApp"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        {enq.email && (
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {enq.email}
                          </p>
                        )}
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <p className="text-gray-700 line-clamp-2 leading-relaxed">
                          {enq.message}
                        </p>
                      </td>

                      <td className="py-3 px-4">
                        {enq.product ? (
                          <span className="font-medium text-[#1A365D]">
                            {enq.product.name} ({enq.product.sku})
                          </span>
                        ) : (
                          <span className="text-gray-400">General Enquiry</span>
                        )}
                      </td>

                      <td className="py-3 px-4 max-w-[160px]">
                        {enq.internalNotes ? (
                          <p className="text-gray-600 italic text-[11px] truncate">
                            {enq.internalNotes}
                          </p>
                        ) : (
                          <span className="text-gray-400 text-[10px]">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-gray-400 text-[11px]">
                        {new Date(enq.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusBadge(
                            enq.status
                          )}`}
                        >
                          {enq.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(enq)}
                            className="p-1.5 text-blue-600 hover:text-blue-800"
                            title="Update Status / Notes"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(enq.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* UPDATE STATUS & NOTES MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-serif text-lg font-bold text-gray-900">
                Update Customer Enquiry
              </h2>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-xl text-xs space-y-1">
              <p className="font-bold text-gray-900">
                {selectedEnquiry.name} ({selectedEnquiry.phone})
              </p>
              <p className="text-gray-600 italic">
                &ldquo;{selectedEnquiry.message}&rdquo;
              </p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Enquiry Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-[#1A365D]"
                >
                  <option value="NEW">New (Uncontacted)</option>
                  <option value="CONTACTED">Contacted by Phone / WhatsApp</option>
                  <option value="IN_PROGRESS">In Progress (Sample / Quote Sent)</option>
                  <option value="RESOLVED">Resolved (Order Placed or Closed)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Internal Staff Notes
                </label>
                <textarea
                  rows={3}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="e.g. Sent 60s Oxford fabric sample to Kolhapur. Follow up on Monday..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs resize-none focus:ring-2 focus:ring-[#1A365D]"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#1A365D] hover:bg-[#2A4365] text-white rounded-xl text-xs font-bold disabled:opacity-50 flex items-center gap-1.5"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Notes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
