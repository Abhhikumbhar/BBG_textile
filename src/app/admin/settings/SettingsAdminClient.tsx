"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Sliders,
  Check,
  Loader2,
  AlertCircle,
  Building,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Search,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";

interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  linkUrl?: string | null;
  buttonText?: string | null;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
}

export default function SettingsAdminClient() {
  const [activeTab, setActiveTab] = useState<"general" | "hero" | "about" | "banners">("general");

  const [settings, setSettings] = useState({
    businessName: "BBG TEXTILE",
    tagline: "Excellence in Quality Fabrics & Garments",
    phone: "+91 87673 22501",
    whatsappNumber: "8767322501",
    email: "bbgtextilebharat1@gmail.com",
    address:
      "GROUND FLOOR, KHARE MALA, S.NO-204 PLOT NO 28, Kupwad MIDC Area, Madhavnagar, Sangli, Maharashtra - 416436, OLD KUPWAD ROAD, SANGLI - 416416",
    city: "Sangli",
    state: "Maharashtra",
    pincode: "416416",
    googleMapsUrl: "https://maps.google.com/?q=Kupwad+MIDC+Sangli+Maharashtra",
    onlineShoppingEnabled: true,
    currencySymbol: "₹",
    announcementText:
      "Premium Fabrics & Garments — Direct Mill Wholesale Supply",
    heroTitle: "Crafting Timeless Quality in Every Thread",
    heroSubtitle:
      "Renowned manufacturer & supplier of fine shirting, premium suiting, uniform textiles, and authentic ethnic weaves based in Sangli, Maharashtra.",
    aboutTitle: "The BBG Textile Legacy",
    aboutStory:
      "BBG Textile has been a dedicated cornerstone of quality fabric production and wholesale distribution in Maharashtra. Situated in the heart of Sangli's Kupwad MIDC industrial hub, we bridge traditional craftsmanship with modern textile innovation.",
    aboutMission:
      "To deliver unmatched fabric reliability, transparent pricing, and swift dispatch for wholesale partners, garment manufacturers, and discerning retail clients.",
    aboutSpecialties:
      "• Pure Cotton & Giza Shirting\n• Wrinkle-Resistant Poly-Viscose Suiting\n• Custom Dyeing & Mill-Finish Linens\n• High-Tenacity Uniform & Workwear Fabrics\n• Traditional Ethnic & Festive Kurta Materials",
    seoTitle: "BBG Textile | Premium Fabrics & Textiles in Sangli, Maharashtra",
    seoDescription:
      "BBG Textile in Kupwad MIDC, Sangli. Manufacturer and wholesale supplier of premium shirting, suiting, and ethnic fabrics.",
    instagramUrl: "https://instagram.com/bbgtextile",
    facebookUrl: "https://facebook.com/bbgtextile",
  });

  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: string; msg: string } | null>(null);

  // New banner form state
  const [newBanner, setNewBanner] = useState({
    title: "",
    subtitle: "",
    linkUrl: "/products",
    buttonText: "Explore Collection",
    imageUrl: "",
    displayOrder: 1,
  });
  const [uploadingBanner, setUploadingBanner] = useState(false);

  useEffect(() => {
    Promise.all([fetch("/api/admin/settings"), fetch("/api/admin/banners")])
      .then(async ([setRes, banRes]) => {
        const setData = await setRes.json();
        const banData = await banRes.json();
        if (setData.settings) setSettings(setData.settings);
        if (banData.banners) setBanners(banData.banners);
      })
      .catch(() => {
        setNotification({ type: "error", msg: "Failed to load settings" });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save settings");

      setNotification({
        type: "success",
        msg: "Website content & settings updated live across storefront!",
      });
    } catch (err: any) {
      setNotification({ type: "error", msg: err.message || "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBanner(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: data });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      setNewBanner((prev) => ({ ...prev, imageUrl: json.url }));
    } catch (err: any) {
      alert(err.message || "Failed to upload banner photo");
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBanner.title || !newBanner.imageUrl) {
      alert("Title and Image URL are required");
      return;
    }

    try {
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBanner),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to add banner");

      setBanners((prev) => [...prev, json.banner]);
      setNewBanner({
        title: "",
        subtitle: "",
        linkUrl: "/products",
        buttonText: "Explore Collection",
        imageUrl: "",
        displayOrder: banners.length + 2,
      });
      setNotification({ type: "success", msg: "Banner added to homepage" });
    } catch (err: any) {
      alert(err.message || "Failed to create banner");
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm("Are you sure you want to remove this promotional banner?")) return;

    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setBanners((prev) => prev.filter((b) => b.id !== id));
      setNotification({ type: "success", msg: "Banner removed" });
    } catch {
      alert("Failed to delete banner");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-[#1A365D] animate-spin mb-3" />
        <p className="text-gray-400 text-xs">Loading website content settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
          Website Content & Settings Management
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
          Update business address, contact numbers, homepage banners, and SEO without editing source code.
        </p>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <span>{notification.msg}</span>
          <button
            onClick={() => setNotification(null)}
            className="text-gray-400 hover:text-gray-600 font-bold ml-2"
          >
            &times;
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 space-x-2">
        <button
          onClick={() => setActiveTab("general")}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "general"
              ? "border-[#1A365D] text-[#1A365D]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          General & Contact Details
        </button>
        <button
          onClick={() => setActiveTab("hero")}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "hero"
              ? "border-[#1A365D] text-[#1A365D]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Homepage & SEO
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "about"
              ? "border-[#1A365D] text-[#1A365D]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          About Us & Mill Story
        </button>
        <button
          onClick={() => setActiveTab("banners")}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "banners"
              ? "border-[#1A365D] text-[#1A365D]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Home Promotional Banners ({banners.length})
        </button>
      </div>

      {/* TAB 1: GENERAL & CONTACT DETAILS */}
      {activeTab === "general" && (
        <form
          onSubmit={handleSaveSettings}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Business Name
              </label>
              <input
                type="text"
                required
                value={settings.businessName}
                onChange={(e) =>
                  setSettings({ ...settings, businessName: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#1A365D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Tagline / Slogan
              </label>
              <input
                type="text"
                value={settings.tagline || ""}
                onChange={(e) =>
                  setSettings({ ...settings, tagline: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#1A365D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Primary Phone Number *
              </label>
              <input
                type="text"
                required
                value={settings.phone}
                onChange={(e) =>
                  setSettings({ ...settings, phone: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#1A365D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                WhatsApp Business Number *
              </label>
              <input
                type="text"
                required
                value={settings.whatsappNumber}
                onChange={(e) =>
                  setSettings({ ...settings, whatsappNumber: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#1A365D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Official Email Address *
              </label>
              <input
                type="email"
                required
                value={settings.email}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#1A365D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Registered Office & Works Address * (Sangli)
            </label>
            <textarea
              required
              rows={2}
              value={settings.address}
              onChange={(e) =>
                setSettings({ ...settings, address: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#1A365D] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                City
              </label>
              <input
                type="text"
                value={settings.city}
                onChange={(e) =>
                  setSettings({ ...settings, city: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                State
              </label>
              <input
                type="text"
                value={settings.state}
                onChange={(e) =>
                  setSettings({ ...settings, state: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Postal Pincode
              </label>
              <input
                type="text"
                value={settings.pincode}
                onChange={(e) =>
                  setSettings({ ...settings, pincode: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm"
              />
            </div>
          </div>

          {/* Online Shopping Mode Toggle */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-amber-900 uppercase">
                Online Shopping & Checkout Feature
              </h3>
              <p className="text-xs text-amber-700 mt-0.5">
                Enable to accept online orders with Cart & Checkout. Disable to enforce pure Wholesale WhatsApp Enquiry mode.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.onlineShoppingEnabled}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    onlineShoppingEnabled: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A365D]"></div>
            </label>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#1A365D] hover:bg-[#2A4365] text-white rounded-xl text-xs font-bold disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>Save General Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: HOMEPAGE & SEO */}
      {activeTab === "hero" && (
        <form
          onSubmit={handleSaveSettings}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6"
        >
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Top Notification Announcement Bar Text
            </label>
            <input
              type="text"
              value={settings.announcementText || ""}
              onChange={(e) =>
                setSettings({ ...settings, announcementText: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#1A365D]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Homepage Hero Title *
            </label>
            <input
              type="text"
              required
              value={settings.heroTitle}
              onChange={(e) =>
                setSettings({ ...settings, heroTitle: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#1A365D]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Homepage Hero Subtitle
            </label>
            <textarea
              rows={2}
              value={settings.heroSubtitle || ""}
              onChange={(e) =>
                setSettings({ ...settings, heroSubtitle: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm resize-none focus:ring-2 focus:ring-[#1A365D]"
            />
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
              Search Engine Optimization (SEO Metadata)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Meta Title *
                </label>
                <input
                  type="text"
                  required
                  value={settings.seoTitle}
                  onChange={(e) =>
                    setSettings({ ...settings, seoTitle: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#1A365D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Meta Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={settings.seoDescription}
                  onChange={(e) =>
                    setSettings({ ...settings, seoDescription: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm resize-none focus:ring-2 focus:ring-[#1A365D]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#1A365D] hover:bg-[#2A4365] text-white rounded-xl text-xs font-bold disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>Save Homepage & SEO Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: ABOUT US & MILL STORY */}
      {activeTab === "about" && (
        <form
          onSubmit={handleSaveSettings}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6"
        >
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              About Section Heading *
            </label>
            <input
              type="text"
              required
              value={settings.aboutTitle}
              onChange={(e) =>
                setSettings({ ...settings, aboutTitle: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#1A365D]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              The BBG Textile Story (Full narrative) *
            </label>
            <textarea
              required
              rows={6}
              value={settings.aboutStory}
              onChange={(e) =>
                setSettings({ ...settings, aboutStory: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm resize-none focus:ring-2 focus:ring-[#1A365D]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Mission Statement
            </label>
            <textarea
              rows={2}
              value={settings.aboutMission || ""}
              onChange={(e) =>
                setSettings({ ...settings, aboutMission: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm resize-none focus:ring-2 focus:ring-[#1A365D]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Fabric Specialities (One per line)
            </label>
            <textarea
              rows={4}
              value={settings.aboutSpecialties || ""}
              onChange={(e) =>
                setSettings({ ...settings, aboutSpecialties: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm resize-none font-mono text-xs focus:ring-2 focus:ring-[#1A365D]"
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#1A365D] hover:bg-[#2A4365] text-white rounded-xl text-xs font-bold disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>Save About Us Content</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: HOMEPAGE PROMOTIONAL BANNERS */}
      {activeTab === "banners" && (
        <div className="space-y-6">
          {/* Add New Banner Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-bold text-gray-900">
              Add Promotional Hero Banner
            </h2>

            <form onSubmit={handleCreateBanner} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Banner Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBanner.title}
                    onChange={(e) =>
                      setNewBanner({ ...newBanner, title: e.target.value })
                    }
                    placeholder="e.g. Festive Collection 2026"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={newBanner.subtitle}
                    onChange={(e) =>
                      setNewBanner({ ...newBanner, subtitle: e.target.value })
                    }
                    placeholder="e.g. Exclusive hand-finished Jacquards"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={newBanner.buttonText}
                    onChange={(e) =>
                      setNewBanner({ ...newBanner, buttonText: e.target.value })
                    }
                    placeholder="e.g. Explore Collection"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Button Link URL
                  </label>
                  <input
                    type="text"
                    value={newBanner.linkUrl}
                    onChange={(e) =>
                      setNewBanner({ ...newBanner, linkUrl: e.target.value })
                    }
                    placeholder="e.g. /products?category=cotton-shirting"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
              </div>

              {/* Banner Photo Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Banner Image *
                </label>
                <div className="flex items-center gap-4">
                  {newBanner.imageUrl && (
                    <div className="relative w-24 h-14 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                      <Image
                        src={newBanner.imageUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <label className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingBanner ? "Uploading..." : "Upload Banner Image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerUpload}
                      className="hidden"
                    />
                  </label>
                  {newBanner.imageUrl && (
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      ✓ Image ready
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={uploadingBanner || !newBanner.imageUrl}
                  className="px-5 py-2 bg-[#1A365D] hover:bg-[#2A4365] text-white rounded-xl text-xs font-bold disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Banner</span>
                </button>
              </div>
            </form>
          </div>

          {/* Existing Banners Grid */}
          <div className="space-y-4">
            <h3 className="font-serif text-base font-bold text-gray-900">
              Active Homepage Banners ({banners.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {banners.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/7] bg-gray-100 overflow-hidden">
                    <Image
                      src={b.imageUrl}
                      alt={b.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 flex justify-between items-start">
                    <div>
                      <h4 className="font-serif font-bold text-sm text-gray-900">
                        {b.title}
                      </h4>
                      {b.subtitle && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                          {b.subtitle}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteBanner(b.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
