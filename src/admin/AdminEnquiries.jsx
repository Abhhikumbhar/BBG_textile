import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { getEnquiries } from "@/lib/catalogService";
import { MessageSquare, Phone, Mail, User, Clock } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState(getEnquiries());

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            Wholesale Enquiries
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            Trade leads and bulk fabric quotations submitted by retailers & tailors
          </p>
        </div>

        {enquiries.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 text-gray-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <h3 className="font-serif text-base font-bold text-gray-700 mb-1">
              No Enquiries Yet
            </h3>
            <p className="text-xs">
              When customers submit enquiries from the Contact page, they will be archived here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enquiries.map((e, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-gray-900">{e.name}</div>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                    {e.category || "General"}
                  </span>
                </div>

                <div className="text-xs text-gray-600 space-y-1">
                  <div>Phone: <strong>{e.phone}</strong></div>
                  {e.email && <div>Email: {e.email}</div>}
                  <div className="p-3 bg-gray-50 rounded-xl mt-2 text-gray-700">
                    "{e.message}"
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <a
                    href={`https://wa.me/${(e.phone || "").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Hello ${e.name}, this is from SBBG Bharat Textile regarding your trade enquiry.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    <span>Reply on WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
