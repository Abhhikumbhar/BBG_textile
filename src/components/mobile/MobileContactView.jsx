import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";

export default function MobileContactView({ settings }) {
  const navigate = useNavigate();
  const address =
    settings?.address ||
    "GROUND FLOOR, KHARE MALA, S.NO-204 PLOT NO 28, Kupwad MIDC Area, Madhavnagar, Sangli, Maharashtra - 416436";
  const phone = settings?.phone || "+91 87673 22501";
  const email = settings?.email || "bbgtextilebharat1@gmail.com";

  const [name, setName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [productType, setProductType] = useState("Churidar Leggings");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanPhone = userPhone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setError(null);
    const subject = encodeURIComponent(`Trade Enquiry: ${name} — ${productType}`);
    const body = encodeURIComponent(
      `NEW TRADE ENQUIRY — BBG TEXTILE\n\n` +
      `• Name: ${name}\n` +
      `• Phone: ${userPhone}\n` +
      `• Product: ${productType}\n` +
      `• Message: ${message || "Interested in wholesale rates"}\n`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-28 text-stone-900">
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md px-4 py-3.5 flex items-center gap-3 border-b border-stone-200/60">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-stone-900 hover:bg-stone-200/60"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
        </button>
        <h1 className="font-serif text-lg font-extrabold text-stone-950">Contact Us</h1>
      </header>

      <main className="p-4 space-y-4 max-w-md mx-auto">
        {/* Quick Contact Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href={`mailto:${email}?subject=${encodeURIComponent("Trade Enquiry — SBBG Bharat Textile")}`}
            className="p-4 rounded-3xl bg-blue-50 border border-blue-200 flex flex-col items-center text-center active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-[#1A365D] text-white flex items-center justify-center mb-2 shadow-xs">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-bold text-stone-950">Email Support</span>
            <span className="text-[10px] text-stone-600 font-medium">{email}</span>
          </a>

          <a
            href={`tel:${phone}`}
            className="p-4 rounded-3xl bg-stone-100 border border-stone-200 flex flex-col items-center text-center active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-stone-950 text-white flex items-center justify-center mb-2 shadow-xs">
              <Phone className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-stone-950">Call Mill</span>
            <span className="text-[10px] text-stone-600 font-medium">+91 87673 22501</span>
          </a>
        </div>

        {/* Address Card */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 text-stone-950 font-bold text-xs uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-stone-800" />
            <span>Manufacturing Works</span>
          </div>
          <p className="text-xs font-medium text-stone-700 leading-relaxed">
            {address}
          </p>
          <div className="pt-2 flex items-center gap-2 text-[11px] font-semibold text-stone-600">
            <Clock className="w-3.5 h-3.5" />
            <span>Mon - Sat: 9:00 AM - 8:00 PM</span>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs">
          <h3 className="font-serif text-base font-extrabold text-stone-950 mb-1">
            Send Trade Inquiry
          </h3>
          <p className="text-xs text-stone-600 mb-4 font-medium">
            Directly connect with factory management for custom bulk inquiries.
          </p>

          {error && (
            <div className="mb-3 p-3 rounded-2xl bg-red-50 border border-red-200 text-center text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          {submitted ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Inquiry initiated! Email draft prepared.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Your Name / Business Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-[#FAF8F5] border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 font-medium"
                />
              </div>
              <div>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  required
                  placeholder="Phone Number (10 Digits)"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-[#FAF8F5] border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 font-medium"
                />
              </div>
              <div>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-[#FAF8F5] border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 font-medium"
                >
                  <option value="Churidar Leggings">Women's Churidar Leggings</option>
                  <option value="Tight Shorts">Women's Cotton Tight Shorts</option>
                  <option value="Both Collections">Both Collections</option>
                </select>
              </div>
              <div>
                <textarea
                  rows={3}
                  placeholder="Order quantity / required shades..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-[#FAF8F5] border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 font-medium resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Submit via Email</span>
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
