import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteSettings } from "@/lib/catalogService";
import {
  ShieldCheck,
  CheckCircle2,
  Phone,
  Mail,
  Award,
  Truck,
  Building,
  Sparkles,
  Layers,
  ArrowRight,
  Factory,
  Check,
  PackageCheck,
  Users,
} from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

export default function AboutPage() {
  const address =
    siteSettings?.address ||
    "GROUND FLOOR, KHARE MALA, S.NO-204 PLOT NO 28, Kupwad MIDC Area, Madhavnagar, Sangli, Maharashtra - 416436, OLD KUPWAD ROAD, SANGLI - 416416";
  const phone = siteSettings?.phone || "+91 87673 22501";
  const email = siteSettings?.email || "bbgtextilebharat1@gmail.com";
  const whatsapp = siteSettings?.whatsappNumber || "918767322501";
  const cleanWhatsApp = whatsapp.replace(/[^0-9]/g, "");

  const specialtiesList = [
    "4-Way Stretch Cotton Lycra Churidar Leggings",
    "Ankle-Length Bio-Washed Leggings",
    "Active & Comfort Cotton Tight Shorts",
    "Pure Combed Cotton & Giza Shirting",
    "Wrinkle-Resistant Poly-Viscose Suiting",
    "Durable Institutional & School Uniform Fabrics",
    "Custom Reactive Dyeing & Mill-Finish Linens",
    "Ethnic & Festive Kurta Materials",
  ];

  const processSteps = [
    {
      step: "01",
      title: "Yarn Selection & Combing",
      desc: "We source 100% long-staple Indian combed cotton bolls and blend them with premium elastane for supreme elasticity, breathability, and bounce-back shape memory.",
      icon: "🧵",
    },
    {
      step: "02",
      title: "Precision Knitting & Weaving",
      desc: "High-gauge circular knitting and Sulzer loom weaving guarantee tight, non-sheer knit density with flawless texture and zero needle lines.",
      icon: "⚙️",
    },
    {
      step: "03",
      title: "Bio-Washing & Colorfast Dyeing",
      desc: "Organic enzyme bio-polishing strips microscopic yarn fuzz to deliver lasting softness that resists pilling, shrinking, and bleeding across repeated domestic washes.",
      icon: "✨",
    },
    {
      step: "04",
      title: "Hand-Inspection & Mill Dispatch",
      desc: "Every cut and roll is individually inspected under high-CRI textile lights for color uniformity, seam strength, and gather symmetry before dispatch from Sangli.",
      icon: "📦",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header settings={siteSettings} />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Heading */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2 block">
              Direct From The Heart of Maharashtra's Textile Belt
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900 mb-6">
              About SBBG Bharat Textile
            </h1>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              Based in Kupwad MIDC, Sangli, we are specialized manufacturers and wholesale distributors of premium 4-way stretch cotton lycra garments, churidar leggings, active shorts, and fine mill textiles.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 text-center shadow-xs">
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#1A365D] mb-1">
                Since Early Years
              </div>
              <div className="text-xs text-gray-500 font-medium">Textile Heritage</div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-200 text-center shadow-xs">
              <div className="font-serif text-3xl sm:text-4xl font-bold text-emerald-600 mb-1">
                100%
              </div>
              <div className="text-xs text-gray-500 font-medium">Super-Combed Cotton</div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-200 text-center shadow-xs">
              <div className="font-serif text-3xl sm:text-4xl font-bold text-[#1A365D] mb-1">
                Sangli
              </div>
              <div className="text-xs text-gray-500 font-medium">Works & Dispatch Hub</div>
            </div>
          </div>

          {/* Manufacturing Story */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20 bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-sm">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">
                Quality & Craftsmanship
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Engineered for All-Day Comfort and Enduring Elegance
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                At SBBG Bharat Textile, we believe that everyday garments deserve extraordinary care. Our flagship 4-way stretch churidar leggings and cotton tight shorts are produced using 95% super-combed cotton blended with authentic 5% elastane.
              </p>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Every meter of our textile is processed through state-of-the-art bio-polishing machines that eliminate short fiber ends, yielding a silk-smooth touch that remains colorfast wash after wash.
              </p>
              <div className="pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A365D] hover:bg-[#0F2444] text-white rounded-xl text-xs font-bold transition-colors"
                >
                  <span>Explore Our Collections</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {specialtiesList.map((spec, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-200/80"
                >
                  <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold text-gray-800 leading-snug">
                    {spec}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 4-Step Process */}
          <div className="mb-20">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1 block">
                From Raw Cotton To Finished Bottom Wear
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-gray-900">
                Our 4-Stage Manufacturing Standard
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((p, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl">{p.icon}</span>
                      <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                        {p.step}
                      </span>
                    </div>
                    <h3 className="font-serif text-base font-bold text-gray-900 mb-2">
                      {p.title}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Visit Works Callout */}
          <div className="bg-[#0D1B2A] rounded-3xl p-8 sm:p-12 text-white text-center max-w-4xl mx-auto border border-amber-500/20">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-3">
              Visit Our Mill Works in Sangli
            </h2>
            <p className="text-gray-300 text-sm max-w-xl mx-auto mb-6">
              Wholesale buyers, trade partners, and garment brands are warmly welcome to visit our works in Kupwad MIDC to inspect fabric samples and review wholesale contracts.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`https://wa.me/${cleanWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4 text-white" />
                <span>Contact via WhatsApp</span>
              </a>
              <Link
                to="/contact"
                className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-colors"
              >
                View Works Address & Map
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer settings={siteSettings} />
    </div>
  );
}
