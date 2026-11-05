import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteSettings } from "@/lib/catalogService";
import {
  PackageCheck,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  Printer,
} from "lucide-react";

export default function TrackOrderPage() {
  const [searchParams] = useSearchParams();
  const initialOrderNo = searchParams.get("order") || "";
  const [orderQuery, setOrderQuery] = useState(initialOrderNo);
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bbg_orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        setRecentOrders(parsed.slice(0, 3));
      }
    } catch (e) {}

    if (initialOrderNo) {
      handleTrack(initialOrderNo);
    }
  }, [initialOrderNo]);

  const handleTrack = async (numToSearch) => {
    const q = (numToSearch || orderQuery).trim().replace(/^#/, "");
    if (!q) return;

    setLoading(true);
    setSearched(true);

    try {
      // 1. Try local storage
      const stored = localStorage.getItem("bbg_orders");
      let found = null;
      if (stored) {
        const list = JSON.parse(stored);
        found = list.find(
          (o) =>
            o.orderNumber?.toLowerCase() === q.toLowerCase() ||
            o.customerPhone === q
        );
      }

      // 2. Try single order item
      if (!found) {
        const single = localStorage.getItem(`order_${q}`);
        if (single) found = JSON.parse(single);
      }

      // 3. Try Cloud Upstash Redis
      if (!found) {
        try {
          const res = await fetch("https://innocent-mosquito-98340.upstash.io", {
            method: "POST",
            headers: {
              Authorization:
                "Bearer gQAAAAAAAYAkAQIgcDJiNjQxZTg2NTBmMzk0YTQ4Yjk0YWMzZDdjZWYzMzUyZQ",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(["GET", `bbg_order:${q}`]),
          });
          const data = await res.json();
          if (data?.result) {
            found = JSON.parse(data.result);
          }
        } catch (err) {}
      }

      setSearchedOrder(found);
    } catch (e) {
      setSearchedOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStepActiveIndex = (status) => {
    switch (status) {
      case "CONFIRMED":
        return 1;
      case "PROCESSING":
        return 2;
      case "SHIPPED":
        return 3;
      case "DELIVERED":
        return 4;
      default:
        return 0; // PENDING
    }
  };

  const steps = [
    { title: "Order Placed", desc: "Received at Sangli Mill" },
    { title: "Confirmed", desc: "Wholesale Order Accepted" },
    { title: "Packed & Quality Checked", desc: "4-Way Lycra Mill Inspection" },
    { title: "Dispatched & In Transit", desc: "Handed over to Transport / Courier" },
    { title: "Delivered", desc: "Delivered to Customer" },
  ];

  const currentStep = getStepActiveIndex(searchedOrder?.status);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Header settings={siteSettings} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Title */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="w-14 h-14 bg-gradient-to-tr from-amber-500 to-amber-200 text-[#0B1220] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <Truck className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Track Your Order
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm">
            Enter your Order ID (e.g. <strong>BBG-482103</strong>) or your 10-digit mobile number to track live dispatch status from our Sangli textile works.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200/80 mb-8 max-w-2xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="Enter Order ID or Mobile Number"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#1A365D] focus:ring-1 focus:ring-[#1A365D]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="py-3.5 px-8 bg-[#1A365D] hover:bg-[#0F2444] text-white font-bold rounded-2xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Track Status</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick past orders chips */}
          {recentOrders.length > 0 && !searched && (
            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-gray-400 font-bold uppercase">Recent:</span>
              {recentOrders.map((ro) => (
                <button
                  key={ro.orderNumber}
                  type="button"
                  onClick={() => {
                    setOrderQuery(ro.orderNumber);
                    handleTrack(ro.orderNumber);
                  }}
                  className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold border border-amber-200 transition-colors"
                >
                  #{ro.orderNumber}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tracking Result Card */}
        {searched && (
          searchedOrder ? (
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-200/80 space-y-8 animate-in fade-in zoom-in-95 duration-200">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-gray-100 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold text-gray-400">Order ID:</span>
                    <span className="font-mono text-lg font-bold text-[#1A365D]">
                      #{searchedOrder.orderNumber}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Customer: <strong className="text-gray-800">{searchedOrder.customerName}</strong> • {searchedOrder.city}, {searchedOrder.state}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{searchedOrder.status || "CONFIRMED"}</span>
                  </span>
                </div>
              </div>

              {/* Courier Tracking Badge if Shipped */}
              {(searchedOrder.courierName || searchedOrder.trackingNumber) && (
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200/80 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-200/70 text-purple-900 flex items-center justify-center shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-purple-700 block">
                        Transport / Dispatch Logistics
                      </span>
                      <p className="font-bold text-gray-900 text-sm">
                        {searchedOrder.courierName || "V-Trans Sangli"}
                      </p>
                    </div>
                  </div>
                  {searchedOrder.trackingNumber && (
                    <div className="sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-gray-500 block">
                        LR / Bilti Number
                      </span>
                      <span className="font-mono font-bold text-[#1A365D] text-sm">
                        {searchedOrder.trackingNumber}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Progress Steps Timeline */}
              <div className="py-4">
                <h3 className="font-serif text-base font-bold text-gray-900 mb-6">
                  Shipment Progress Timeline
                </h3>
                <div className="relative">
                  {/* Progress Line */}
                  <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
                    {steps.map((st, i) => {
                      const isCompleted = i <= currentStep;
                      const isCurrent = i === currentStep;
                      return (
                        <div key={i} className="flex sm:flex-col items-center gap-4 sm:gap-2 sm:text-center">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                              isCompleted
                                ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                                : "bg-gray-100 text-gray-400 border border-gray-200"
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                          </div>
                          <div>
                            <span
                              className={`block text-xs font-bold ${
                                isCurrent
                                  ? "text-[#1A365D]"
                                  : isCompleted
                                  ? "text-gray-900"
                                  : "text-gray-400"
                              }`}
                            >
                              {st.title}
                            </span>
                            <span className="block text-[10px] text-gray-500 mt-0.5">
                              {st.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Items Summary in Track Card */}
              <div className="pt-6 border-t border-gray-100">
                <h4 className="font-bold text-xs uppercase text-gray-400 tracking-wider mb-3">
                  Items in this Shipment
                </h4>
                <div className="space-y-2">
                  {searchedOrder.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-lg border border-gray-200"
                          />
                        )}
                        <div>
                          <p className="font-bold text-gray-900">{item.name}</p>
                          <p className="text-gray-500 text-[11px]">
                            {item.color || ""} {item.size ? `• ${item.size}` : ""} • Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">
                        ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* View / Download Official Bill */}
                <div className="mt-5 p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-xs text-stone-800">
                    <Printer className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Official Tax Invoice & Cash Memo available for this shipment.</span>
                  </div>
                  <Link
                    to={`/order-success/${searchedOrder.orderNumber}`}
                    className="w-full sm:w-auto px-4 py-2 bg-[#1A365D] hover:bg-[#0F2444] text-white rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-300" />
                    <span>View & Save Bill (PDF)</span>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-gray-200 shadow-sm max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-gray-900">
                Order Not Found
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                We could not find an order matching <strong className="text-gray-900 font-mono">"{orderQuery}"</strong>. Please verify the order number from your confirmation email or order receipt.
              </p>
              <div className="pt-2">
                <a
                  href={`mailto:${siteSettings?.email || "bbgtextilebharat1@gmail.com"}?subject=${encodeURIComponent(
                    `Need Help Tracking Order #${orderQuery}`
                  )}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1A365D] hover:bg-[#0F2444] text-white text-xs font-bold transition-all shadow-xs"
                >
                  <Mail className="w-4 h-4 text-white" />
                  <span>Email Tracking Support Desk</span>
                </a>
              </div>
            </div>
          )
        )}
      </main>

      <Footer settings={siteSettings} />
    </div>
  );
}
