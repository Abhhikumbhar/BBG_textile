import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteSettings } from "@/lib/catalogService";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Building,
  ExternalLink,
  Send,
  CheckCircle2,
} from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

export default function ContactPage() {
  const address =
    siteSettings?.address ||
    "GROUND FLOOR, KHARE MALA, S.NO-204 PLOT NO 28, Kupwad MIDC Area, Madhavnagar, Sangli, Maharashtra - 416436, OLD KUPWAD ROAD, SANGLI - 416416";
  const phone = siteSettings?.phone || "+91 87673 22501";
  const email = siteSettings?.email || "bbgtextilebharat1@gmail.com";
  const whatsapp = siteSettings?.whatsappNumber || "918767322501";
  const cleanWhatsApp = whatsapp.replace(/[^0-9]/g, "");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    category: "Churidar Leggings",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const text = encodeURIComponent(
      `*NEW TRADE ENQUIRY — SBBG BHARAT TEXTILE*\n\n` +
      `• Name: ${form.name}\n` +
      `• Phone: ${form.phone}\n` +
      `• Email: ${form.email || "Not specified"}\n` +
      `• Product Interest: ${form.category}\n` +
      `• Message: ${form.message}\n\n` +
      `Please provide wholesale quotation & swatches.`
    );

    window.open(`https://wa.me/${cleanWhatsApp}?text=${text}`, "_blank");
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header settings={siteSettings} />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2 block">
              We Are Here To Assist
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
              Get in Touch with SBBG Bharat Textile
            </h1>
            <p className="text-gray-500 text-base leading-relaxed">
              Whether you need fabric samples, customized bulk mill rates, or want to visit our works in Sangli, our trade team is at your service.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* LEFT: Contact Form (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-gray-200 shadow-sm">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Send an Instant Wholesale Enquiry
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-8">
                Fill out the form below. We will immediately open your WhatsApp chat with your trade enquiry details ready to send.
              </p>

              {submitted && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Enquiry created! WhatsApp chat has been opened. Our team will respond shortly.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Anand Shinde"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="name@business.com"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Product Interest
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                    >
                      <option value="Churidar Leggings">Women's Churidar Leggings</option>
                      <option value="Cotton Tight Shorts">Women's Cotton Tight Shorts</option>
                      <option value="Bulk Shirting / Suiting">Bulk Shirting / Suiting Fabrics</option>
                      <option value="Custom Dyeing & Mill Rolls">Custom Dyeing & Mill Rolls</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Your Requirements / Quantity / City *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about the quantities, colors, or samples you need..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <WhatsAppIcon className="w-4 h-4 text-slate-950" />
                  <span>Send Enquiry via WhatsApp</span>
                </button>
              </form>
            </div>

            {/* RIGHT: Direct Details & Address Card (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* WhatsApp Quick Card */}
              <div className="p-6 rounded-3xl bg-emerald-500 text-white shadow-md space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/20 rounded-2xl">
                    <WhatsAppIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold">Fast WhatsApp Response</h3>
                    <p className="text-emerald-100 text-xs">Direct chat with trade desk</p>
                  </div>
                </div>
                <p className="text-emerald-50 text-xs leading-relaxed">
                  For instant mill quotations, swatches, or dispatch tracking, message us directly on WhatsApp.
                </p>
                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                    "Hello BBG Textile, I am reaching out through your website contact page."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 text-center bg-white text-emerald-700 font-bold rounded-xl text-xs shadow-sm hover:bg-emerald-50 transition-colors"
                >
                  Open WhatsApp Chat
                </a>
              </div>

              {/* Works Location Card */}
              <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-4">
                <h3 className="font-serif text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                  <Building className="w-4 h-4 text-amber-600" />
                  <span>Works & Factory Location</span>
                </h3>

                <div className="space-y-3 text-xs text-gray-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{address}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                    <a href={`tel:${phone}`} className="hover:text-gray-900 font-medium">
                      {phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                    <a href={`mailto:${email}`} className="hover:text-gray-900 font-medium">
                      {email}
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Monday – Saturday: 9:30 AM to 7:30 PM</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="https://maps.google.com/?q=Kupwad+MIDC+Sangli+Maharashtra"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A365D] hover:underline"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer settings={siteSettings} />
    </div>
  );
}
