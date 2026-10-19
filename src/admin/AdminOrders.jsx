import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { getOrders, updateOrderStatus } from "@/lib/catalogService";
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
} from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

export default function AdminOrders() {
  const [orders, setOrders] = useState(getOrders());
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleStatusChange = (orderNumber, newStatus) => {
    const updated = updateOrderStatus(orderNumber, newStatus);
    setOrders(updated);
    if (selectedOrder && selectedOrder.orderNumber === orderNumber) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "CONFIRMED":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">CONFIRMED</span>;
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            Customer Orders
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            Review customer orders, dispatch schedules, and WhatsApp confirmations
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 text-gray-400">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <h3 className="font-serif text-base font-bold text-gray-700 mb-1">
              No Orders Registered Yet
            </h3>
            <p className="text-xs">
              When customers complete the checkout form on your site, their orders will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((o) => (
                    <tr key={o.orderNumber} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#1A365D]">
                        #{o.orderNumber}
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
                        {getStatusBadge(o.status)}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-gray-900">
                    Order #{selectedOrder.orderNumber}
                  </h3>
                  <span className="text-[11px] text-gray-400">
                    {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customer Box */}
              <div className="p-4 bg-gray-50 rounded-2xl text-xs space-y-1.5 text-gray-700">
                <div className="font-bold text-sm text-gray-900 mb-1">
                  Customer & Delivery
                </div>
                <div>Name: <strong>{selectedOrder.customerName}</strong></div>
                <div>Phone: <strong>{selectedOrder.customerPhone}</strong></div>
                {selectedOrder.customerEmail && (
                  <div>Email: {selectedOrder.customerEmail}</div>
                )}
                <div>
                  Address: {selectedOrder.shippingAddress}, {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.postalCode}
                </div>
                {selectedOrder.notes && (
                  <div className="pt-1 text-amber-800">
                    Notes: <em>{selectedOrder.notes}</em>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <div className="font-bold text-xs uppercase tracking-wider text-gray-500">
                  Ordered Items
                </div>
                <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto border border-gray-100 rounded-2xl p-3 text-xs">
                  {selectedOrder.items?.map((it, idx) => (
                    <div key={idx} className="py-2 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-gray-900">{it.name}</div>
                        <div className="text-[11px] text-gray-400">
                          Qty: {it.quantity} {it.color && `• Color: ${it.color}`} {it.size && `• Size: ${it.size}`}
                        </div>
                      </div>
                      <div className="font-bold text-gray-900">
                        ₹{(it.price * it.quantity).toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total & Status Selector */}
              <div className="pt-2 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 block">Total Amount</span>
                  <span className="text-xl font-bold text-[#1A365D]">
                    ₹{(selectedOrder.total || 0).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-gray-600">Status:</label>
                  <select
                    value={selectedOrder.status || "PENDING"}
                    onChange={(e) =>
                      handleStatusChange(selectedOrder.orderNumber, e.target.value)
                    }
                    className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <a
                  href={`https://wa.me/${selectedOrder.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Hello ${selectedOrder.customerName}, this is regarding your order #${selectedOrder.orderNumber} with SBBG Bharat Textile.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Chat with Customer</span>
                </a>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
