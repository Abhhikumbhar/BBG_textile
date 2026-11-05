import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { getOrders, updateOrderStatus, recordOrderRefund } from "@/lib/catalogService";
import { syncOrdersFromCloud } from "@/lib/cloudSync";
import OfficialTaxInvoice from "@/components/OfficialTaxInvoice";
import {
  ShoppingBag,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Phone,
  Printer,
  X,
  RotateCcw,
  AlertCircle,
  Loader2,
  ShieldAlert,
  Mail,
  RefreshCw,
  Search,
  MapPin,
  ExternalLink,
  FileText,
} from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState(getOrders());
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isSyncing, setIsSyncing] = useState(false);

  // Tracking details state when updating an order
  const [courierName, setCourierName] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  // Refund modal states
  const [refundTargetOrder, setRefundTargetOrder] = useState(null);
  const [refundLoading, setRefundLoading] = useState(false);
  const [refundError, setRefundError] = useState(null);

  // Auto-sync with cloud on mount and periodically
  const fetchCloudOrders = async () => {
    setIsSyncing(true);
    const cloudMerged = await syncOrdersFromCloud();
    if (cloudMerged) {
      setOrders(cloudMerged);
    } else {
      setOrders(getOrders());
    }
    setIsSyncing(false);
  };

  useEffect(() => {
    fetchCloudOrders();
    const interval = setInterval(() => {
      syncOrdersFromCloud().then((res) => {
        if (res) setOrders(res);
      });
    }, 15000); // Check for new orders every 15s
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = (orderNumber, newStatus, customTracking = null) => {
    const target = orders.find((o) => o.orderNumber === orderNumber);

    // If changing to CANCELLED and was paid online, offer Razorpay refund
    if (
      newStatus === "CANCELLED" &&
      target &&
      target.paymentMethod === "ONLINE_RAZORPAY" &&
      target.paymentStatus === "PAID" &&
      target.paymentId
    ) {
      setRefundTargetOrder(target);
      return;
    }

    const trackingData = customTracking || {
      courierName: courierName || target?.courierName || "",
      trackingNumber: trackingNumber || target?.trackingNumber || "",
      updatedAt: new Date().toISOString(),
    };

    const updated = updateOrderStatus(orderNumber, newStatus, trackingData);
    setOrders(updated);
    if (selectedOrder && selectedOrder.orderNumber === orderNumber) {
      setSelectedOrder({ ...selectedOrder, status: newStatus, ...trackingData });
    }
  };

  const handleProcessRefund = async (order, alsoCancel = true) => {
    if (!order || !order.paymentId) return;

    setRefundLoading(true);
    setRefundError(null);

    try {
      const res = await fetch("/api/public/razorpay/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: order.paymentId,
          amount: order.total,
          orderNumber: order.orderNumber,
          reason: "Order cancelled by admin",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Razorpay refund request was declined");
      }

      // Record refund in storage
      const updated = recordOrderRefund(order.orderNumber, {
        refundId: data.refundId,
        refundAmount: data.amount,
        reason: "Cancelled & refunded by admin",
      });

      setOrders(updated);

      if (selectedOrder && selectedOrder.orderNumber === order.orderNumber) {
        setSelectedOrder({
          ...selectedOrder,
          status: "CANCELLED",
          paymentStatus: "REFUNDED",
          refundId: data.refundId,
        });
      }

      setRefundTargetOrder(null);
      setRefundLoading(false);
    } catch (err) {
      setRefundError(err.message || "Failed to process refund. Check Razorpay balance.");
      setRefundLoading(false);
    }
  };

  const handleCancelWithoutRefund = (orderNumber) => {
    const updated = updateOrderStatus(orderNumber, "CANCELLED");
    setOrders(updated);
    if (selectedOrder && selectedOrder.orderNumber === orderNumber) {
      setSelectedOrder({ ...selectedOrder, status: "CANCELLED" });
    }
    setRefundTargetOrder(null);
  };

  const getStatusBadge = (status, paymentStatus) => {
    if (paymentStatus === "REFUNDED") {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
          CANCELLED & REFUNDED
        </span>
      );
    }
    switch (status) {
      case "CONFIRMED":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">CONFIRMED</span>;
      case "PROCESSING":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">PROCESSING</span>;
      case "SHIPPED":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">SHIPPED</span>;
      case "DELIVERED":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">DELIVERED</span>;
      case "CANCELLED":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">CANCELLED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">PENDING</span>;
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      (o.orderNumber && o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.customerName && o.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.customerPhone && o.customerPhone.includes(searchQuery)) ||
      (o.city && o.city.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || (o.status || "PENDING") === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with Title and Sync Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
              Customer Orders
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm">
              Live orders from online store, tracking status, and dispatch details
            </p>
          </div>

          <button
            onClick={fetchCloudOrders}
            disabled={isSyncing}
            className="self-start sm:self-auto px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-amber-600" : ""}`} />
            <span>{isSyncing ? "Syncing Orders..." : "Refresh Orders"}</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, Customer Name, Phone, City..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#1A365D]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {["ALL", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? "bg-[#1A365D] text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 text-gray-400">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <h3 className="font-serif text-base font-bold text-gray-700 mb-1">
              No Orders Registered Yet
            </h3>
            <p className="text-xs">
              When customers complete checkout on the website or mobile app, their orders will appear here in real-time.
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-200 text-gray-400">
            <p className="text-xs">No orders match your search or filter.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((o) => (
                    <tr key={o.orderNumber} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#1A365D]">
                        #{o.orderNumber}
                      </td>
                      <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                        {o.createdAt
                          ? new Date(o.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "Recently"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900">{o.customerName}</div>
                        <div className="text-[11px] text-gray-400">{o.customerPhone}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {o.city || "Sangli"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {o.items?.length || 1} product(s)
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900">
                        ₹{(o.total || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(o.status, o.paymentStatus)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setInvoiceModalOrder(o)}
                            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 rounded-xl font-extrabold text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                            title="View / Save Tax Invoice (PDF)"
                          >
                            <Printer className="w-3.5 h-3.5 text-amber-800" />
                            <span>Bill</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedOrder(o);
                              setCourierName(o.courierName || "");
                              setTrackingNumber(o.trackingNumber || "");
                            }}
                            className="px-3 py-1.5 bg-[#1A365D] hover:bg-[#0F2444] text-white rounded-xl font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View & Dispatch</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Order Details & Dispatch Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5 animate-in fade-in zoom-in-95 duration-150 border border-gray-200">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div>
                  <span className="text-xs text-gray-400 uppercase font-bold tracking-widest block">
                    Order Details
                  </span>
                  <h3 className="font-serif text-xl font-bold text-gray-900">
                    Order #{selectedOrder.orderNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customer & Shipping Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-gray-50 p-4 rounded-2xl space-y-1.5">
                  <span className="font-bold text-gray-700 block uppercase tracking-wider text-[10px]">
                    Customer Information
                  </span>
                  <p className="font-bold text-gray-900 text-sm">{selectedOrder.customerName}</p>
                  <p className="text-gray-600 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{selectedOrder.customerPhone}</span>
                  </p>
                  {selectedOrder.customerEmail && (
                    <p className="text-gray-600 flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span>{selectedOrder.customerEmail}</span>
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl space-y-1.5">
                  <span className="font-bold text-gray-700 block uppercase tracking-wider text-[10px]">
                    Delivery Address
                  </span>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedOrder.shippingAddress}
                  </p>
                  <p className="font-semibold text-gray-900">
                    {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.postalCode}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <span className="font-bold text-gray-700 block uppercase tracking-wider text-[10px]">
                  Ordered Products ({selectedOrder.items?.length || 0})
                </span>
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="p-3 bg-white flex items-center justify-between text-xs">
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
                            {item.color ? `Color: ${item.color}` : ""} {item.size ? `• Size: ${item.size}` : ""}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-500">Qty: {item.quantity}</span>
                        <p className="font-bold text-gray-900">
                          ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-xl text-xs font-bold">
                  <span>Grand Total</span>
                  <span className="text-sm font-bold text-[#1A365D]">
                    ₹{(selectedOrder.total || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Live Tracking & Status Update Section */}
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-amber-700" />
                    <span>Order Tracking & Dispatch Status</span>
                  </span>
                  {getStatusBadge(selectedOrder.status, selectedOrder.paymentStatus)}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                      Change Status
                    </label>
                    <select
                      value={selectedOrder.status || "PENDING"}
                      onChange={(e) => handleStatusChange(selectedOrder.orderNumber, e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#1A365D]"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                      Courier / Transport Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. V-Trans, DTDC, Delhivery"
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#1A365D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                      Tracking / LR No.
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 192847102"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#1A365D]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      handleStatusChange(selectedOrder.orderNumber, selectedOrder.status || "CONFIRMED", {
                        courierName,
                        trackingNumber,
                      })
                    }
                    className="px-4 py-2 bg-[#1A365D] hover:bg-[#0F2444] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    Save Tracking Details
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 flex-wrap">
                {selectedOrder.status === "SHIPPED" ? (
                  <a
                    href={`mailto:${selectedOrder.customerEmail || ""}?subject=${encodeURIComponent(
                      `Order Dispatched! - #${selectedOrder.orderNumber} - SBBG Bharat Textile`
                    )}&body=${encodeURIComponent(
                      `Dear ${selectedOrder.customerName},\n\nGood news! Your order #${selectedOrder.orderNumber} has been dispatched from our Sangli Mill Works.\n\n` +
                      `Order Summary:\n` +
                      `• Order Number: #${selectedOrder.orderNumber}\n` +
                      `• Customer: ${selectedOrder.customerName}\n` +
                      `• Delivery Address: ${selectedOrder.shippingAddress}, ${selectedOrder.city}, ${selectedOrder.state} - ${selectedOrder.postalCode}\n` +
                      `• Total Amount: ₹${(selectedOrder.total || 0).toLocaleString("en-IN")}\n` +
                      `• Items: ${(selectedOrder.items || []).map((i) => `${i.name} (Qty: ${i.quantity})`).join(", ")}\n\n` +
                      `Dispatch Details:\n` +
                      `• Transport / Courier Name: ${selectedOrder.courierName || courierName || "V-Trans Sangli"}\n` +
                      `• LR / Tracking Number: ${selectedOrder.trackingNumber || trackingNumber || "Provided on request"}\n\n` +
                      `Warm regards,\nSBBG Bharat Textile, Sangli\nEmail: bbgtextilebharat1@gmail.com`
                    )}`}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-sm transition-all"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Send Dispatch Email (1-Click)</span>
                  </a>
                ) : (
                  <a
                    href={`mailto:${selectedOrder.customerEmail || ""}?subject=${encodeURIComponent(
                      `Regarding Order #${selectedOrder.orderNumber} - SBBG Bharat Textile`
                    )}&body=${encodeURIComponent(
                      `Hello ${selectedOrder.customerName},\n\nThis is regarding your order #${selectedOrder.orderNumber} with SBBG Bharat Textile.\n\nStatus: ${selectedOrder.status || "PENDING"}\nTotal Amount: ₹${(selectedOrder.total || 0).toLocaleString("en-IN")}\n\nThank you for choosing SBBG Bharat Textile!\nEmail: bbgtextilebharat1@gmail.com`
                    )}`}
                    className="px-4 py-2 bg-[#1A365D] hover:bg-[#0F2444] text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email Customer</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setInvoiceModalOrder(selectedOrder)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-950 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-4 h-4 text-stone-950" />
                  <span>Print Tax Invoice (A4 / PDF)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Official Tax Invoice Modal */}
        {invoiceModalOrder && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 shadow-2xl relative">
              <OfficialTaxInvoice
                order={invoiceModalOrder}
                onClose={() => setInvoiceModalOrder(null)}
              />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
