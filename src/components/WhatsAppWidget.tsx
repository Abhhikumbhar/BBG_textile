"use client";

import React from "react";
import { usePathname } from "next/navigation";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

export default function WhatsAppWidget({
  whatsappNumber = "919822012345",
}: {
  whatsappNumber?: string;
}) {
  const pathname = usePathname();
  const cleanNumber = (whatsappNumber && whatsappNumber.trim() ? whatsappNumber : "919822012345").replace(/[^0-9]/g, "");

  // On product detail page, the sticky bottom bar already provides WhatsApp CTA
  if (pathname?.startsWith("/products/")) {
    return null;
  }

  return (
    <a
      href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent(
        "Hello BBG Textile, I am visiting your website and have an enquiry regarding your products."
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 w-13 h-13 sm:w-15 sm:h-15 bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1DA851] text-white rounded-full shadow-[0_6px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group touch-manipulation"
      aria-label="Direct WhatsApp Enquiry"
      title="Chat on WhatsApp"
    >
      <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white transition-transform group-hover:scale-105" />
    </a>
  );
}
