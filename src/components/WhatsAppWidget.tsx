"use client";

import React from "react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

export default function WhatsAppWidget({
  whatsappNumber = "919822012345",
}: {
  whatsappNumber?: string;
}) {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");

  return (
    <a
      href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent(
        "Hello BBG Textile, I am visiting your website and have an enquiry regarding your products."
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 sm:w-15 sm:h-15 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-[0_6px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-110 flex items-center justify-center group"
      aria-label="Direct WhatsApp Enquiry"
      title="Chat on WhatsApp"
    >
      <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white transition-transform group-hover:scale-105" />
    </a>
  );
}
