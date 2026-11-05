import React, { useState } from "react";
import {
  Mail,
  X,
  Send,
  CheckCircle2,
  AlertCircle,
  Phone,
  User,
  Package,
  Layers,
  Sparkles,
} from "lucide-react";
import { addEnquiry } from "@/lib/catalogService";

export default function MillRatesModal({ isOpen, onClose, defaultProduct = "" }) {
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    alternatePhone: "",
    email: "",
    requirement: defaultProduct || "Women's Premium Cotton Lycra Churidar Leggings",
    quantity: "5",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handlePhoneChange = (field, value) => {
    // Only accept numeric digits up to 10
    const digitsOnly = value.replace(/[^0-9]/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, [field]: digitsOnly }));
    if (error) setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    // Validation in clean English
    if (!formData.customerName.trim()) {
      setError("Please enter your full name or company name.");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Please enter a valid 10-digit mobile / WhatsApp number.");
      return;
    }

    if (!formData.alternatePhone || !/^\d{10}$/.test(formData.alternatePhone)) {
      setError("Please enter a valid 10-digit alternate mobile number.");
      return;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!formData.quantity || Number(formData.quantity) <= 0) {
      setError("Please specify the required quantity (minimum 1).");
      return;
    }

    // Save in local storage enquiries for admin panel
    try {
      const enquiryItem = {
        id: `ENQ-${Date.now()}`,
        name: formData.customerName.trim(),
        phone: formData.phone.trim(),
        alternatePhone: formData.alternatePhone.trim() || undefined,
        email: formData.email.trim(),
        requirement: formData.requirement,
        quantity: formData.quantity,
        message: formData.message.trim(),
        status: "NEW",
        createdAt: new Date().toISOString(),
      };
      addEnquiry(enquiryItem);

      // Try background sync with API
      fetch("/api/public/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enquiryItem),
      }).catch(() => {});
    } catch (err) {
      console.error("Enquiry save error", err);
    }

    // Format mailto link to open email draft directly to bbgtextilebharat1@gmail.com
    const emailSubject = encodeURIComponent(
      `Direct Mill Rates Enquiry: ${formData.requirement} (${formData.quantity} pcs) - ${formData.customerName}`
    );
    const emailBody = encodeURIComponent(
      `Hello BBG Textile Team,\n\n` +
        `I am requesting direct mill rates & wholesale quotation:\n\n` +
        `• Customer Name: ${formData.customerName}\n` +
        `• WhatsApp / Mobile No: ${formData.phone}\n` +
        (formData.alternatePhone ? `• Alternate Mobile No: ${formData.alternatePhone}\n` : "") +
        `• Email Address: ${formData.email}\n` +
        `• Requirement: ${formData.requirement}\n` +
        `• Required Quantity: ${formData.quantity} pcs\n` +
        (formData.message ? `• Additional Notes / Shades: ${formData.message}\n` : "") +
        `\nPlease share wholesale mill price card and delivery details.\n\nThank you!`
    );

    window.location.href = `mailto:bbgtextilebharat1@gmail.com?subject=${emailSubject}&body=${emailBody}`;

    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-gray-900">
              Quotation Request Submitted!
            </h3>
            <p className="text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
              Your wholesale enquiry has been generated. Our direct mill sales desk (<span className="font-semibold text-gray-800">bbgtextilebharat1@gmail.com</span>) will contact you with the wholesale rate card within 24 hours.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#1A365D] hover:bg-[#0F2444] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1A365D] to-[#2A4365] text-white flex items-center justify-center shrink-0 shadow-md">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Direct Mill Wholesale</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                  Wholesale & Mill Rates Enquiry
                </h3>
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-5 leading-relaxed">
              Fill out the form below to receive factory-direct wholesale prices and custom bulk quotations directly from our Sangli manufacturing mill.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Full Name / Business Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    placeholder="e.g., Ramesh Patil / Balaji Cloth Store"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A365D]/20 focus:border-[#1A365D] text-xs font-medium text-gray-900 transition-all placeholder:text-gray-400"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Mobile Numbers (Main + Alternate) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    WhatsApp / Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) => handlePhoneChange("phone", e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A365D]/20 focus:border-[#1A365D] text-xs font-medium text-gray-900 font-mono transition-all placeholder:text-gray-400"
                    />
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Alternate Mobile Number (10 Digits) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={formData.alternatePhone}
                      onChange={(e) =>
                        handlePhoneChange("alternatePhone", e.target.value)
                      }
                      placeholder="10-digit alternate number"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A365D]/20 focus:border-[#1A365D] text-xs font-medium text-gray-900 font-mono transition-all placeholder:text-gray-400"
                    />
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A365D]/20 focus:border-[#1A365D] text-xs font-medium text-gray-900 transition-all placeholder:text-gray-400"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Requirement & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Select Product <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.requirement}
                    onChange={(e) =>
                      setFormData({ ...formData, requirement: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A365D]/20 focus:border-[#1A365D] text-xs font-medium text-gray-900 transition-all"
                  >
                    <option value="Women's Premium Cotton Lycra Churidar Leggings">
                      Cotton Lycra Churidar Leggings
                    </option>
                    <option value="Women's 4-Way Stretch Cotton Lycra Tight Shorts">
                      4-Way Stretch Tight Shorts (Cycling)
                    </option>
                    <option value="Ankle-Length Bio-Washed Leggings">
                      Ankle-Length Bio-Washed Leggings
                    </option>
                    <option value="Pure Combed Cotton Shirting Fabric">
                      Pure Combed Cotton Shirting Fabric
                    </option>
                    <option value="Direct Mill Wholesale Catalog & Swatches">
                      Direct Mill Wholesale Catalog & Swatches
                    </option>
                    <option value="Other Mill Fabric Requirements">
                      Custom Bulk Order / Other Fabric
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Quantity (Pcs) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    placeholder="e.g. 50"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A365D]/20 focus:border-[#1A365D] text-xs font-bold text-center text-gray-900 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Message / Special Instructions */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Order Notes / Color Shades <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Specify required color shades (e.g. 10 Black, 10 Maroon), sizes, or transport preferences..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A365D]/20 focus:border-[#1A365D] text-xs font-medium text-gray-900 transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>Submit Wholesale Enquiry</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
