import React from "react";
import { useLocation } from "react-router-dom";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

export default function WhatsAppWidget({ whatsappNumber = "918767322501" }) {
  const location = useLocation();
  const pathname = location.pathname;
  const cleanNumber = (whatsappNumber && whatsappNumber.trim() ? whatsappNumber : "918767322501").replace(/[^0-9]/g, "");

  // On product detail page, sticky bar handles it
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
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1DA851] text-white rounded-full shadow-[0_6px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group touch-manipulation"
      aria-label="Direct WhatsApp Enquiry"
      title="Chat on WhatsApp"
    >
      <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white transition-transform group-hover:scale-105" />
    </a>
  );
}
