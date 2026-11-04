import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Award, Layers, ShieldCheck, Truck, Factory, Mail } from "lucide-react";

export default function MobileAboutView({ settings }) {
  const navigate = useNavigate();
  const email = settings?.email || "bbgtextilebharat1@gmail.com";

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
        <h1 className="font-serif text-lg font-extrabold text-stone-950">About Us</h1>
      </header>

      <main className="p-4 space-y-4 max-w-md mx-auto">
        {/* Hero Card */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs">
          <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-widest block mb-1">
            Sangli Textile Works • Made in Bharat
          </span>
          <h2 className="font-serif text-2xl font-extrabold text-stone-950 mb-2 leading-tight">
            SBBG Bharat Textile
          </h2>
          <p className="text-xs font-semibold text-stone-700 leading-relaxed mb-4">
            Manufacturer of premium 4-way stretch cotton lycra bottom wear, churidar leggings, and tight shorts, direct from our Kupwad MIDC works in Sangli.
          </p>

          <a
            href={`mailto:${email}?subject=${encodeURIComponent(
              "Hello BBG Textile, I would like to know more about your direct mill wholesale supply."
            )}`}
            className="w-full py-3 px-5 rounded-full bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
          >
            <Mail className="w-4 h-4 text-white" />
            <span>Connect via Email</span>
          </a>
        </div>

        {/* Quality Features */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3.5">
          <h3 className="font-serif text-base font-extrabold text-stone-950">
            Why Choose BBG Fabric?
          </h3>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#EFEAE2] flex items-center justify-center shrink-0 text-stone-800">
              <Layers className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-950">4-Way Super Stretch</h4>
              <p className="text-[11px] font-medium text-stone-600">
                Crafted with 95% super-combed cotton & 5% Lycra for ultimate flexibility.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-700">
              <ShieldCheck className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-950">Bio-Washed Softness</h4>
              <p className="text-[11px] font-medium text-stone-600">
                Enzyme bio-polishing ensures non-sheer comfort, zero color bleed, and no pill formation.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0 text-amber-800">
              <Award className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-950">Sangli Mill Direct Pricing</h4>
              <p className="text-[11px] font-medium text-stone-600">
                Wholesale direct pricing with zero middlemen margin.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
