import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  Award,
  ArrowRight,
  Clock,
} from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

interface FooterProps {
  settings?: {
    businessName?: string | null;
    tagline?: string | null;
    phone?: string | null;
    whatsappNumber?: string | null;
    email?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    pincode?: string | null;
  } | null;
}

export default function Footer({ settings }: FooterProps) {
  const businessName = settings?.businessName || "BBG TEXTILE EXPORTER";
  const address =
    settings?.address ||
    "GROUND FLOOR, KHARE MALA, S.NO-204 PLOT NO 28, Kupwad MIDC Area, Madhavnagar, Sangli, Maharashtra - 416436, OLD KUPWAD ROAD, SANGLI - 416416";
  const phone = settings?.phone || "+91 87673 22501";
  const email = settings?.email || "bbgtextilebharat1@gmail.com";
  const whatsapp = settings?.whatsappNumber || "918767322501";
  const cleanWhatsApp = whatsapp.replace(/[^0-9]/g, "");

  return (
    <footer className="bg-[#0A121E] text-gray-300 pt-16 pb-12 border-t border-amber-500/15">
      {/* Top Value Propositions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/30 transition-all">
            <div className="p-3 bg-amber-500/10 border border-amber-400/25 rounded-xl text-amber-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-serif font-semibold text-base mb-1">
                Authentic Mill Quality
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Precision spun and woven textiles rigorously tested for colorfastness and drape.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/30 transition-all">
            <div className="p-3 bg-amber-500/10 border border-amber-400/25 rounded-xl text-amber-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-serif font-semibold text-base mb-1">
                Wholesale & Bulk Supply
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Direct dispatch across Maharashtra, Karnataka, and pan-India with competitive trade rates.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/30 transition-all">
            <div className="p-3 bg-amber-500/10 border border-amber-400/25 rounded-xl text-amber-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-serif font-semibold text-base mb-1">
                Sangli Textile Heritage
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Established manufacturing footprint in Kupwad MIDC trusted by tailors, brands, and institutions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <div className="mb-5 inline-block bg-white rounded-xl px-3 py-1.5 shadow-sm">
              <Image
                src="/images/logo/bbg-logo-horizontal.png"
                alt="BBG TEXTILE EXPORTER - Premium Fabrics & Garments"
                width={280}
                height={72}
                className="h-9 w-auto object-contain"
              />
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Manufacturers and wholesale suppliers of premium cotton shirtings, suiting blends, linens, and institutional fabrics based in Sangli.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/${cleanWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>WhatsApp Business</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/products"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  Product Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/products?featured=true"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  Featured Collections
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  About Our Mill & Story
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  Contact & Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/products?category=womens-bottom-wear"
                  className="hover:text-white transition-colors"
                >
                  Women&apos;s Bottom Wear
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=churidar-leggings"
                  className="hover:text-white transition-colors"
                >
                  Churidar Cotton Leggings
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=cycling-shorts"
                  className="hover:text-white transition-colors"
                >
                  Tight & Active Shorts
                </Link>
              </li>
              <li>
                <Link
                  href="/products?newArrival=true"
                  className="hover:text-white transition-colors"
                >
                  New Arrivals 2026
                </Link>
              </li>
              <li>
                <Link
                  href="/products?featured=true"
                  className="hover:text-white transition-colors"
                >
                  B2B Wholesale Bundles
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Address & Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Registered Office & Works
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-gray-300 leading-snug">
                  {address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href={`tel:${phone}`}
                  className="hover:text-white transition-colors"
                >
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="hover:text-white transition-colors"
                >
                  {email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-gray-400">
                  Mon – Sat: 9:30 AM – 8:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-gray-800 text-xs text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>
          &copy; {new Date().getFullYear()} {businessName}. All rights reserved. Registered in Sangli, Maharashtra.
        </p>
        <div className="flex items-center space-x-6">
          <Link href="/about" className="hover:text-gray-400">
            About Us
          </Link>
          <Link href="/contact" className="hover:text-gray-400">
            Wholesale Enquiries
          </Link>
          <Link href="/admin/login" className="hover:text-gray-400">
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
