import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { siteSettings, decrementStockForOrder } from "@/lib/catalogService";
import { pushOrderToCloud } from "@/lib/cloudSync";
import { loadRazorpayScript, RAZORPAY_KEY_ID } from "@/lib/razorpay";
import {
  ShieldCheck,
  ShoppingBag,
  ArrowLeft,
  Truck,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Mail,
} from "lucide-react";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, subtotal, clearCart } = useCart();

  const searchParams = new URLSearchParams(location.search);
  const initialMethod = "ONLINE_RAZORPAY";

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    alternatePhone: "",
    customerEmail: "",
    shippingAddress: "",
    city: "Sangli",
    state: "Maharashtra",
    postalCode: "416416",
    paymentMethod: initialMethod,
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      setError("Your cart is empty. Please add items before checking out.");
      return;
    }
    const cleanPhone = formData.customerPhone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit primary mobile number before proceeding.");
      return;
    }
    const cleanAlt = (formData.alternatePhone || "").replace(/\D/g, "");
    if (cleanAlt.length !== 10) {
      setError("Please enter a valid 10-digit alternate mobile number before proceeding.");
      return;
    }
    if (!formData.customerEmail || !formData.customerEmail.includes("@") || !formData.customerEmail.includes(".")) {
      setError("Please enter a valid email address (e.g. name@company.com) before proceeding.");
      return;
    }
    if (!formData.customerName || !formData.customerName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!formData.shippingAddress || !formData.shippingAddress.trim()) {
      setError("Please enter your complete delivery address.");
      return;
    }

    setLoading(true);
    setError(null);

    // Generate unique order number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `BBG-${new Date().getFullYear()}-${randomSuffix}`;

    // --- OPTION A: PAY ONLINE VIA RAZORPAY ---
    if (formData.paymentMethod === "ONLINE_RAZORPAY") {
      try {
        const loaded = await loadRazorpayScript();
        if (!loaded || !window.Razorpay) {
          throw new Error("Razorpay checkout is loading. Please check your connection and try again.");
        }

        const options = {
          key: RAZORPAY_KEY_ID,
          amount: Math.round(subtotal * 100), // amount in paise
          currency: "INR",
          name: "BBG Textile",
          description: `Order #${orderNumber}`,
          image: "/icon.png",
          prefill: {
            name: formData.customerName,
            email: formData.customerEmail || "",
            contact: formData.customerPhone,
          },
          theme: {
            color: "#1A365D",
          },
          handler: function (response) {
            const paymentId = response.razorpay_payment_id;

            const orderData = {
              orderNumber,
              customerName: formData.customerName,
              customerPhone: formData.customerPhone,
              alternatePhone: formData.alternatePhone || "",
              customerEmail: formData.customerEmail,
              shippingAddress: formData.shippingAddress,
              city: formData.city,
              state: formData.state,
              postalCode: formData.postalCode,
              paymentMethod: "ONLINE_RAZORPAY",
              paymentStatus: "PAID",
              paymentId: paymentId,
              notes: formData.notes,
              items: [...items],
              total: subtotal,
              createdAt: new Date().toISOString(),
            };

            // Save order in localStorage and push to Cloud for Instant Admin visibility
            try {
              localStorage.setItem(`order_${orderNumber}`, JSON.stringify(orderData));
              const pastOrders = JSON.parse(localStorage.getItem("bbg_orders") || "[]");
              localStorage.setItem("bbg_orders", JSON.stringify([orderData, ...pastOrders]));
              pushOrderToCloud(orderData);
            } catch (err) {
              console.error("Order storage error", err);
            }

            // Sync with backend API if available
            fetch("/api/public/checkout", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...formData,
                paymentMethod: "ONLINE_RAZORPAY",
                paymentId: paymentId,
                items: items.map((i) => ({
                  productId: i.id,
                  color: i.color,
                  size: i.size,
                  quantity: i.quantity,
                })),
              }),
            }).catch(() => {});

            // Decrement stock so after 5 orders the product automatically closes
            decrementStockForOrder(items);

            // Clear cart and redirect to order success page
            clearCart();
            setLoading(false);
            navigate(`/order-success/${orderNumber}`);
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          setError(
            `Payment could not be completed: ${response.error?.description || "Transaction declined"}. Please retry with UPI, Card or NetBanking.`
          );
          setLoading(false);
        });
        rzp.open();
        return;
      } catch (err) {
        setError(err.message || "Failed to initialize online payment.");
        setLoading(false);
        return;
      }
    }

    // --- OPTION B: CASH ON DELIVERY / BANK TRANSFER ---
    const orderData = {
      orderNumber,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      alternatePhone: formData.alternatePhone || "",
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

    // Save order in localStorage and push to Cloud for Instant Admin visibility
    try {
      localStorage.setItem(`order_${orderNumber}`, JSON.stringify(orderData));
      const pastOrders = JSON.parse(localStorage.getItem("bbg_orders") || "[]");
      localStorage.setItem("bbg_orders", JSON.stringify([orderData, ...pastOrders]));
      pushOrderToCloud(orderData);
    } catch (err) {
      console.error("Order storage error", err);
    }

    // Decrement stock so after 5 orders the product automatically closes
    decrementStockForOrder(items);

    // Clear cart and redirect to order success page directly without opening WhatsApp
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
            Submit your order and delivery address. Your invoice and dispatch schedule will be confirmed directly.
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
                      Mobile Number (10 Digits) *
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      required
                      value={formData.customerPhone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setFormData({ ...formData, customerPhone: val });
                      }}
                      placeholder="10-digit mobile number"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Alternate Mobile Number (10 Digits) *
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      required
                      value={formData.alternatePhone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setFormData({ ...formData, alternatePhone: val });
                      }}
                      placeholder="10-digit alternate number"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      placeholder="name@company.com"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                    />
                  </div>
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
                    Payment Method
                  </label>
                  <div className="p-4 rounded-2xl border-2 border-[#1A365D] bg-blue-50/70 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1A365D] text-white flex items-center justify-center shrink-0">
                        <CreditCard className="w-5 h-5 text-amber-300" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-gray-900">
                            Pay Online (Razorpay Gateway)
                          </span>
                          <span className="px-2 py-0.5 text-[9px] font-bold bg-[#1A365D] text-white rounded">
                            Instant & Secure
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-600 mt-0.5">
                          UPI, Google Pay, PhonePe, Paytm, Debit/Credit Card & NetBanking
                        </div>
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-[#1A365D] shrink-0" />
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
                  className="w-full py-4 bg-[#1A365D] hover:bg-[#0F2444] text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CreditCard className="w-5 h-5 text-amber-300" />
                  <span>
                    {loading
                      ? "Opening Secure Razorpay..."
                      : `Pay Online & Place Order • ₹${subtotal.toLocaleString("en-IN")}`}
                  </span>
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
                  <span className="text-emerald-700 font-medium">Free Mill Dispatch</span>
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
