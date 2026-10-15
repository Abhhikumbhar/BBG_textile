import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "./ContactForm";
import { getSiteSettings } from "@/lib/data";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Building,
  ExternalLink,
} from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

export const metadata = {
  title: "Contact Us & Sangli Works | BBG Textile",
  description:
    "Contact BBG Textile in Kupwad MIDC, Sangli, Maharashtra. Submit a wholesale enquiry or reach out via WhatsApp.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const address =
    settings?.address ||
    "GROUND FLOOR, KHARE MALA, S.NO-204 PLOT NO 28, Kupwad MIDC Area, Madhavnagar, Sangli, Maharashtra - 416436, OLD KUPWAD ROAD, SANGLI - 416416";
  const phone = settings?.phone || "+91 98220 12345";
  const email = settings?.email || "info@bbgtextile.com";
  const whatsapp = settings?.whatsappNumber || "919822012345";
  const cleanWhatsApp = whatsapp.replace(/[^0-9]/g, "");

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header settings={settings || undefined} />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2 block">
              We Are Here To Assist
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
              Get in Touch with BBG Textile
            </h1>
            <p className="text-gray-500 text-base leading-relaxed">
              Whether you need fabric samples, customized bulk mill rates, or want to visit our works in Sangli, our trade team is at your service.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* LEFT: Contact Form (7 cols) */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

            {/* RIGHT: Direct Details & Address Card (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* WhatsApp Quick Card */}
              <div className="p-6 rounded-3xl bg-emerald-600 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-white/20 rounded-xl">
                    <WhatsAppIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold">
                      Direct WhatsApp Desk
                    </h3>
                    <p className="text-emerald-100 text-xs">
                      Instant reply during business hours
                    </p>
                  </div>
                </div>
                <p className="text-emerald-50 text-sm mb-5 leading-relaxed">
                  Have photos of the fabric weave or shade you require? Send them directly to our WhatsApp trade desk.
                </p>
                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                    "Hello BBG Textile, I would like to enquire about your fabric collection."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-white hover:bg-emerald-50 text-emerald-900 rounded-xl font-bold text-sm text-center block transition-colors shadow-sm"
                >
                  Chat with Us on WhatsApp &rarr;
                </a>
              </div>

              {/* Works & Office Location */}
              <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-6">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-[#1A365D] text-amber-400 rounded-xl shrink-0 mt-1">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-gray-900 mb-1">
                      Registered Works & Office
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {address}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100 text-sm">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                    <a href={`tel:${phone}`} className="hover:text-black">
                      {phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                    <a href={`mailto:${email}`} className="hover:text-black">
                      {email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Monday to Saturday: 9:30 AM to 8:00 PM</span>
                  </div>
                </div>

                {/* Google Maps link */}
                <div className="pt-4 border-t border-gray-100">
                  <a
                    href={
                      settings?.googleMapsUrl ||
                      "https://maps.google.com/?q=Kupwad+MIDC+Sangli+Maharashtra"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-800 rounded-xl text-xs font-bold border border-gray-200 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span>View Location on Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer settings={settings || undefined} />
    </div>
  );
}
