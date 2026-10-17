import React from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/data";
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

export const metadata = {
  title: "About Us | BBG Textile Sangli",
  description:
    "Learn about BBG Textile, manufacturer and wholesale fabric distributor based in Kupwad MIDC, Sangli, Maharashtra. Specializing in 4-way stretch cotton lycra garments and premium mill textiles.",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const address =
    settings?.address ||
    "GROUND FLOOR, KHARE MALA, S.NO-204 PLOT NO 28, Kupwad MIDC Area, Madhavnagar, Sangli, Maharashtra - 416436, OLD KUPWAD ROAD, SANGLI - 416416";
  const phone = settings?.phone || "+91 87673 22501";
  const email = settings?.email || "bbgtextilebharat1@gmail.com";
  const whatsapp = settings?.whatsappNumber || "918767322501";
  const cleanWhatsApp = whatsapp.replace(/[^0-9]/g, "");

  const specialtiesList = [
    "4-Way Stretch Cotton Lycra Churidar Leggings",
    "Ankle-Length Bio-Washed Leggings",
    "Active & Comfort Tight Shorts",
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
      title: "High-Gauge Circular Knitting",
      desc: "Our high-precision knitting machines weave a dense 220–250 GSM 4-way stretch fabric that guarantees complete opacity with zero sheer see-through.",
      icon: "⚙️",
    },
    {
      step: "03",
      title: "Eco Bio-Wash & Reactive Dyeing",
      desc: "An advanced enzymatic bio-polishing bath removes surface fuzz, creating an ultra-soft handfeel and locking vibrant, fade-proof colors that never bleed.",
      icon: "🎨",
    },
    {
      step: "04",
      title: "Reinforced Tailoring & QC Audit",
      desc: "Every single piece is finished with 4-thread flatlock stitching and gentle anti-roll waistbands, followed by individual quality inspection before bulk dispatch.",
      icon: "✨",
    },
  ];

  const pillars = [
    {
      title: "Direct Mill Wholesale Supply",
      desc: "Zero middlemen, agents, or trading markups. You get direct mill pricing from our Sangli plant, providing maximum profit margins for your retail and wholesale business.",
      icon: <Factory className="w-6 h-6 text-amber-600" />,
    },
    {
      title: "4-Way Super Stretch Lycra",
      desc: "Engineered with 95% combed cotton and 5% premium elastane to deliver unrestricted movement, gentle shape retention, and supreme comfort all day long.",
      icon: <Layers className="w-6 h-6 text-amber-600" />,
    },
    {
      title: "100% Bio-Washed & Colorfast",
      desc: "Special enzyme bio-wash treatment ensures cloud-soft cotton touch, zero surface pilling, and wash-fast color that stays fresh through 100+ laundry cycles.",
      icon: <Sparkles className="w-6 h-6 text-amber-600" />,
    },
    {
      title: "Swift Dispatch from Sangli Hub",
      desc: "Conveniently located in Kupwad MIDC, connected directly to major freight transport lines (VRL, TCI, Safechem) for express delivery across Maharashtra and India.",
      icon: <Truck className="w-6 h-6 text-amber-600" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <Header settings={settings || undefined} />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="bg-gradient-to-b from-[#0B1A30] via-[#102444] to-[#1A365D] text-white py-16 sm:py-24 relative overflow-hidden">
          {/* Subtle textile texture backdrop */}
          <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none">
            <Image
              src="/images/studio-backdrop-hd.jpg"
              alt="BBG Textile Studio Texture Backdrop"
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-6 backdrop-blur-sm">
              <span>🏛️</span>
              <span>Kupwad MIDC, Sangli • Maharashtra&apos;s Textile Hub</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              The BBG Textile Legacy
            </h1>

            <p className="text-gray-200 text-base sm:text-xl leading-relaxed max-w-3xl mx-auto mb-10">
              Crafting premium 4-way stretch cotton lycra garments, churidar leggings, and fine mill fabrics with uncompromising craftsmanship, modern circular knitting, and trusted direct-mill wholesale supply.
            </p>

            {/* 3 Metrics Counter Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-6 border-t border-white/15">
              <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="font-serif text-xl sm:text-2xl font-bold text-amber-400">Since Early Years</div>
                <div className="text-xs text-gray-300 mt-1 uppercase tracking-wider">Established Textile Heritage</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="font-serif text-2xl sm:text-3xl font-bold text-amber-400">100%</div>
                <div className="text-xs text-gray-300 mt-1 uppercase tracking-wider">Bio-Washed Combed Cotton</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="font-serif text-2xl sm:text-3xl font-bold text-amber-400">100+</div>
                <div className="text-xs text-gray-300 mt-1 uppercase tracking-wider">Wholesale Partners</div>
              </div>
            </div>
          </div>
        </section>

        {/* STORY SECTION: Rooted in Sangli's Weaving Capital */}
        <section className="py-16 sm:py-24 bg-white border-b border-[#EAE3D6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Story Text */}
              <div className="lg:col-span-7">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2 block">
                  Our Heritage & Identity
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  Rooted in Sangli&apos;s Renowned Textile Tradition
                </h2>
                <div className="text-gray-600 text-base leading-relaxed space-y-4 font-normal">
                  <p>
                    Headquartered in the historic industrial corridor of <strong>Kupwad MIDC, Sangli</strong> — widely celebrated as Maharashtra&apos;s textile and yarn hub — <strong>BBG TEXTILE</strong> represents the perfect blend of traditional Indian weaving wisdom and modern circular knitting innovation.
                  </p>
                  <p>
                    We specialize in manufacturing high-density <strong>4-way stretch cotton lycra churidar leggings, ankle-length leggings, and active tight shorts</strong>, alongside premium pure cotton shirting, suiting, and institutional uniform textiles. Every fabric roll is spun from handpicked long-staple cotton, tested for tensile elasticity, and treated with an eco-friendly enzyme bio-wash.
                  </p>
                  <p>
                    Unlike middlemen and trading agents who inflate wholesale costs, BBG Textile operates on a <strong>direct mill-to-retailer model</strong>. We supply leading cloth stores, saree showrooms, boutique chains, and garment brands with certified consistent GSM, colorfast assurance, and guaranteed ready dispatch.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                      "Hello BBG Textile, I am interested in wholesale fabric & leggings catalog. Please share details."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl font-bold text-sm shadow-md transition-all inline-flex items-center gap-2 hover:shadow-lg"
                  >
                    <WhatsAppIcon className="w-5 h-5 text-white" />
                    <span>Inquire for Wholesale Supply</span>
                  </a>
                  <Link
                    href="/products"
                    className="px-6 py-3.5 bg-[#1A365D] hover:bg-[#2A4365] text-white rounded-xl font-bold text-sm transition-all shadow-md inline-flex items-center gap-2"
                  >
                    <span>View Product Collection</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Textile Craft Imagery Showcase */}
              <div className="lg:col-span-5 space-y-4">
                <div className="relative rounded-3xl overflow-hidden border border-[#E5DAC8] shadow-2xl bg-gradient-to-b from-[#F8F4EE] to-[#EFE8DE] aspect-[4/3] group">
                  <Image
                    src="/images/products/bbg-studio-hd-crimson-red.jpg"
                    alt="BBG Textile Premium 4-Way Stretch Cotton Lycra Leggings"
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                      Signature Collection
                    </span>
                    <h3 className="font-serif text-lg font-bold">
                      Premium 4-Way Stretch Cotton Lycra Leggings
                    </h3>
                    <p className="text-xs text-gray-200 mt-1">
                      Bio-Washed • Direct Mill Supply • Sangli, Maharashtra
                    </p>
                  </div>
                </div>

                {/* Subcard with trust badges */}
                <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E5DAC8] shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-serif text-sm font-bold text-gray-900">
                      Fabric Quality Certification
                    </span>
                    <span className="text-xs text-emerald-700 bg-emerald-50 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                      ✓ Lab Verified
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 text-xs text-gray-700">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-600" />
                      <span>95% Combed Cotton</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-600" />
                      <span>4-Way Super Stretch</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-600" />
                      <span>Zero Fade Colorfast</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-600" />
                      <span>Dual Enzyme Bio-Wash</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 PILLARS OF EXCELLENCE */}
        <section className="py-16 sm:py-24 bg-[#F8F5EF] border-b border-[#EAE3D6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2 block">
                Why BBG Textile
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Four Pillars of Our Manufacturing Excellence
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Engineered for wholesale buyers, apparel retailers, and tailoring houses who refuse to compromise on fabric reliability and customer delight.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pillars.map((p, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-[#E5DAC8] shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center mb-5">
                    {p.icon}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-gray-900 mb-2">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4-STEP MANUFACTURING LIFECYCLE */}
        <section className="py-16 sm:py-24 bg-white border-b border-[#EAE3D6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2 block">
                Our Production Process
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                From Raw Cotton Yarn to Finished Garment
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                How our integrated Sangli facility transforms raw long-staple cotton into luxurious, shape-retaining 4-way lycra garments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="relative bg-[#FAF8F5] rounded-3xl p-7 border border-[#E8DFD3] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl">{step.icon}</span>
                      <span className="text-xs font-extrabold font-mono text-amber-700 bg-amber-100/70 px-2.5 py-1 rounded-full">
                        STAGE {step.step}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-gray-900 mb-2.5">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#E8DFD3]/70 flex items-center gap-1.5 text-xs font-semibold text-[#1A365D]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mill Quality Check Passed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUCT SPECIALITIES GRID */}
        <section className="py-16 sm:py-20 bg-[#FBF9F5] border-b border-[#EAE3D6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2 block">
                Comprehensive Catalog
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Core Textile & Garment Specialities
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Ready in stock for bulk dispatch to wholesalers, retailers, and garment labels.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {specialtiesList.map((spec, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-white border border-[#E5DAC8] shadow-sm flex items-start gap-3 hover:border-amber-400 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-800 leading-snug">
                    {spec}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1A365D] hover:bg-[#2A4365] text-white rounded-xl text-sm font-bold shadow-md transition-all"
              >
                <span>Browse Complete Product Range</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* MISSION & VISION */}
        <section className="py-16 sm:py-24 bg-white border-b border-[#EAE3D6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#102444] to-[#1A365D] text-white shadow-xl relative overflow-hidden">
                <span className="text-amber-400 font-mono text-xs font-bold uppercase tracking-widest block mb-3">
                  Our Mission
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-4">
                  Integrity, Consistency & Mill-Direct Value
                </h3>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
                  To empower Indian clothing merchants, retail showrooms, and garment creators by delivering certified, defect-free 4-way stretch fabrics and garments with swift dispatch, honest wholesale pricing, and long-term partnership commitment.
                </p>
              </div>

              <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#FAF7F2] to-[#F1E9DC] border border-[#E2D5C3] shadow-sm">
                <span className="text-amber-800 font-mono text-xs font-bold uppercase tracking-widest block mb-3">
                  Our Vision
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Taking Sangli&apos;s Textile Prowess Nationwide
                </h3>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  To make <strong>BBG TEXTILE</strong> the benchmark of Indian circular-knit excellence — ensuring that every woman wearing our leggings experiences feather-light comfort, zero-sag elasticity, and authentic Indian mill craftsmanship.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* REGISTERED MILL WORKS & CONTACT CARD */}
        <section className="py-16 sm:py-24 bg-[#F8F5EF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2 block">
                Manufacturing & Registered Office
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Visit BBG Textile in Sangli
              </h2>
              <p className="text-gray-600 text-sm">
                We welcome bulk buyers, retailers, and garment partners for plant visits and fabric swatching.
              </p>
            </div>

            <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-[#E5DAC8] shadow-lg">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3.5 bg-[#1A365D] text-amber-400 rounded-2xl shrink-0 shadow-md">
                  <Building className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-gray-900 mb-1">
                    {settings?.businessName || "BBG TEXTILE EXPORTER"}
                  </h3>
                  <p className="text-amber-800 text-xs font-semibold uppercase tracking-wider mb-2">
                    Direct Mill Works & Head Office
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {address}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-t border-b border-gray-100 text-sm">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <div className="text-[11px] text-gray-400 uppercase font-bold">Direct Phone</div>
                    <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} className="text-gray-800 font-semibold hover:text-amber-700">
                      {phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <div className="text-[11px] text-gray-400 uppercase font-bold">Email Inquiries</div>
                    <a href={`mailto:${email}`} className="text-gray-800 font-semibold hover:text-amber-700">
                      {email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3.5">
                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                    "Hello BBG Textile, I want to inquire about wholesale order / mill visit."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl text-center text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <WhatsAppIcon className="w-5 h-5 text-white" />
                  <span>WhatsApp Mill Representative</span>
                </a>
                <Link
                  href="/contact"
                  className="flex-1 py-3.5 bg-[#1A365D] hover:bg-[#2A4365] text-white rounded-xl text-center text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Open Contact & Enquiry Form</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings || undefined} />
    </div>
  );
}
