import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { siteSettings } from "@/lib/catalogService";
import {
  ShieldCheck,
  ShoppingBag,
  ArrowLeft,
  Truck,
  CreditCard,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    shippingAddress: "",
    city: "Sangli",
    state: "Maharashtra",
    postalCode: "416416",
    paymentMethod: "WHATSAPP_COD",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cleanWhatsApp = (siteSettings?.whatsappNumber || "918767322501").replace(/[^0-9]/g, "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (items.length === 0) {
      setError("Your cart is empty. Please add items before checking out.");
      return;
    }
    if (!formData.customerName || !formData.customerPhone || !formData.shippingAddress) {
      setError("Please fill in your name, phone number, and delivery address.");
      return;
    }

    setLoading(true);
    setError(null);

    // Generate unique order number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `BBG-${new Date().getFullYear()}-${randomSuffix}`;

    const orderData = {
      orderNumber,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail,
      shippingAddress: formData.shippingAddress,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
      paymentMethod: formData.paymentMethod,
      notes: formData.notes,
      items: [...items],
      total: subtotal,
      createdAt: new Date().toISOString(),
    };

    // Save order in localStorage for confirmation screen
    try {
      localStorage.setItem(`order_${orderNumber}`, JSON.stringify(orderData));
      const pastOrders = JSON.parse(localStorage.getItem("bbg_orders") || "[]");
      localStorage.setItem("bbg_orders", JSON.stringify([orderData, ...pastOrders]));
    } catch (err) {
      console.error("Order storage error", err);
    }

    // Build WhatsApp message
    const itemSummary = items
      .map(
        (i, idx) =>
          `${idx + 1}. *${i.name}* (Color: ${i.color || "Standard"}, Size: ${i.size || "Standard"}) x ${i.quantity} = ₹${(i.price * i.quantity).toLocaleString("en-IN")}`
      )
      .join("\n");

    const message = encodeURIComponent(
      `*NEW ORDER RECEIVED — SBBG BHARAT TEXTILE*\n` +
      `Order ID: *#${orderNumber}*\n\n` +
      `*Customer Details:*\n` +
      `• Name: ${formData.customerName}\n` +
      `• Phone: ${formData.customerPhone}\n` +
      `• Address: ${formData.shippingAddress}, ${formData.city}, ${formData.state} - ${formData.postalCode}\n\n` +
      `*Ordered Items:*\n${itemSummary}\n\n` +
      `*Total Amount:* ₹${subtotal.toLocaleString("en-IN")}\n` +
      `*Payment Method:* ${formData.paymentMethod}\n` +
      (formData.notes ? `*Notes:* ${formData.notes}\n\n` : `\n`) +
      `Please confirm dispatch schedule.`
    );

    // Open WhatsApp in new tab
    window.open(`https://wa.me/${cleanWhatsApp}?text=${message}`, "_blank");

    // Clear cart and redirect to order success page
    clearCart();
    setLoading(false);
    navigate(`/order-success/${orderNumber}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header settings={siteSettings} />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-8 text-sm">
            <Link to="/cart" className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 font-medium">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Cart</span>
            </Link>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Finalize Fabric Order
          </h1>
          <p className="text-gray-500 text-sm mb-10">
            Submit your wholesale order and delivery address. Our trade coordinator will confirm dispatch via WhatsApp.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Form (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="font-serif text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">
                  Customer & Delivery Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="e.g. Ramesh Patil"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      WhatsApp / Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Full Delivery Address / Shop Name *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.shippingAddress}
                    onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                    placeholder="Shop No., Street, Landmark, Area..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      State
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Pincode
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                    />
                  </div>
                </div>

                {/* Payment Option */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Payment Preference
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-3 p-4 rounded-2xl border border-amber-300 bg-amber-50/50 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        checked={formData.paymentMethod === "WHATSAPP_COD"}
                        onChange={() => setFormData({ ...formData, paymentMethod: "WHATSAPP_COD" })}
                        className="text-[#1A365D] focus:ring-[#1A365D]"
                      />
                      <div>
                        <div className="text-xs font-bold text-gray-900">
                          WhatsApp Confirmation / COD
                        </div>
                        <div className="text-[11px] text-gray-500">
                          Confirm over WhatsApp before transport
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 rounded-2xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        checked={formData.paymentMethod === "BANK_TRANSFER"}
                        onChange={() => setFormData({ ...formData, paymentMethod: "BANK_TRANSFER" })}
                        className="text-[#1A365D] focus:ring-[#1A365D]"
                      />
                      <div>
                        <div className="text-xs font-bold text-gray-900">
                          Direct Mill Bank / RTGS
                        </div>
                        <div className="text-[11px] text-gray-500">
                          Invoice dispatched with GST details
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Order Notes or Special Instructions
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Please arrange transport via Sangli goods transport..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || items.length === 0}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <WhatsAppIcon className="w-5 h-5 text-slate-950" />
                  <span>{loading ? "Placing Order..." : "Place Order via WhatsApp"}</span>
                </button>
              </form>
            </div>

            {/* Order Summary (5 cols) */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="font-serif text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">
                Items in Order ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>

              <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center gap-3">
                    <img
                      src={item.image || "/images/products/bbg-studio-hd-cs-white.jpg"}
                      alt={item.name}
                      className="w-14 h-16 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-200"
                    />
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        {item.color && <span>{item.color} • </span>}
                        Qty: {item.quantity}
                      </p>
                      <div className="text-xs font-bold text-[#1A365D] mt-0.5">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Transport Delivery</span>
                  <span className="text-emerald-700 font-medium">To be quoted on WhatsApp</span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Payable</span>
                  <span className="text-2xl font-bold text-[#1A365D]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="font-bold">✓ Direct Factory Guarantee</div>
                <div>All fabrics are dispatched directly from our mill works in Kupwad MIDC, Sangli.</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer settings={siteSettings} />
    </div>
  );
}
