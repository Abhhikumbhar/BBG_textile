import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  ShieldCheck,
  Truck,
  Award,
  ArrowRight,
  Clock,
} from "lucide-react";

export default function Footer({ settings }) {
  const businessName = settings?.businessName || "SBBG BHARAT TEXTILE";
  const address =
    settings?.address ||
    "GROUND FLOOR, KHARE MALA, S.NO-204 PLOT NO 28, Kupwad MIDC Area, Madhavnagar, Sangli, Maharashtra - 416436, OLD KUPWAD ROAD, SANGLI - 416416";
  const phone = settings?.phone || "+91 87673 22501";
  const email = settings?.email || "bbgtextilebharat1@gmail.com";

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
                Precision spun and woven textiles rigorously tested for colorfastness, stretch memory, and drape.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/30 transition-all">
            <div className="p-3 bg-amber-500/10 border border-amber-400/25 rounded-xl text-amber-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-serif font-semibold text-base mb-1">
                Direct Wholesale Rates
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Get factory-direct competitive wholesale rates for garment retailers, boutiques, and bulk buyers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/30 transition-all">
            <div className="p-3 bg-amber-500/10 border border-amber-400/25 rounded-xl text-amber-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-serif font-semibold text-base mb-1">
                Pan-India Dispatch
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Fast transport and logistics dispatch directly from our textile facility in Kupwad MIDC, Sangli.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-amber-200 flex items-center justify-center">
                <img
                  src="/images/logo/bbg-logo-icon.png"
                  alt="SBBG Textile Logo"
                  className="w-full h-full rounded-full object-cover bg-white"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <span className="font-serif text-xl font-bold text-white tracking-tight">
                {businessName}
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Premier manufacturer and exporter of premium 4-way stretch cotton lycra churidar leggings, active shorts, and fine mill fabrics in Sangli, Maharashtra.
            </p>
            <div className="pt-2">
              <a
                href={`mailto:${email}?subject=${encodeURIComponent("Enquiry — SBBG Bharat Textile Trade Team")}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                <Mail className="w-4 h-4 text-slate-950" />
                <span>Chat with Email</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-white font-semibold text-sm tracking-wide uppercase">
              Navigation
            </h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/" className="hover:text-amber-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-amber-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-amber-400 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-amber-400 transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 transition-colors">
                  About BBG Textile
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition-colors">
                  Contact & Works
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="hover:text-amber-400 transition-colors text-amber-300 font-medium">
                  7-Day Return Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div className="space-y-3">
            <h5 className="text-white font-semibold text-sm tracking-wide uppercase">
              Collections
            </h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  to="/products?category=churidar-leggings"
                  className="hover:text-amber-400 transition-colors"
                >
                  Churidar Leggings
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=cycling-shorts"
                  className="hover:text-amber-400 transition-colors"
                >
                  Cotton Tight Shorts
                </Link>
              </li>
              <li>
                <Link
                  to="/products?featured=true"
                  className="hover:text-amber-400 transition-colors"
                >
                  Featured Bottom Wear
                </Link>
              </li>
              <li>
                <Link
                  to="/products?newArrival=true"
                  className="hover:text-amber-400 transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Factory Contact */}
          <div className="space-y-3">
            <h5 className="text-white font-semibold text-sm tracking-wide uppercase">
              Works & Office
            </h5>
            <div className="space-y-2.5 text-sm text-gray-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                <span className="text-xs leading-relaxed">{address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="text-xs hover:text-white transition-colors"
                >
                  {email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/5 text-center sm:flex sm:justify-between sm:items-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} {businessName}. All rights reserved.</p>
        <div className="flex items-center justify-center gap-4 mt-2 sm:mt-0">
          <Link to="/return-policy" className="hover:text-amber-400 transition-colors">
            7-Day Returns & Refunds
          </Link>
          <span>•</span>
          <span>Crafted in Sangli, Maharashtra</span>
        </div>
      </div>
    </footer>
  );
}
