import React from "react";
import { CheckCircle2, ShieldCheck, Printer, Download, ArrowLeft } from "lucide-react";

export function numberToWordsINR(amount) {
  const n = Math.round(Number(amount) || 0);
  if (n <= 0) return "Rupees Zero Only";

  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function convertGroup(num) {
    let s = "";
    if (num >= 100) {
      s += ones[Math.floor(num / 100)] + " Hundred ";
      num %= 100;
    }
    if (num >= 20) {
      s += tens[Math.floor(num / 10)] + " ";
      num %= 10;
    }
    if (num > 0) {
      s += ones[num] + " ";
    }
    return s.trim();
  }

  const crore = Math.floor(n / 10000000);
  let rem = n % 10000000;
  const lakh = Math.floor(rem / 100000);
  rem = rem % 100000;
  const thousand = Math.floor(rem / 1000);
  rem = rem % 1000;
  const hundred = rem;

  let words = "";
  if (crore > 0) words += convertGroup(crore) + " Crore ";
  if (lakh > 0) words += convertGroup(lakh) + " Lakh ";
  if (thousand > 0) words += convertGroup(thousand) + " Thousand ";
  if (hundred > 0) words += convertGroup(hundred) + " ";

  return `Rupees ${words.trim()} Only`;
}

export default function OfficialTaxInvoice({ order, onClose }) {
  if (!order) return null;

  const orderNum = order.orderNumber || "ORDER";
  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

  const items = Array.isArray(order.items) ? order.items : [];
  const subtotal = order.total || items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 1), 0);
  // Inclusive 5% GST calculation for textiles
  const taxableValue = Math.round((subtotal / 1.05) * 100) / 100;
  const gstAmount = Math.round((subtotal - taxableValue) * 100) / 100;
  const cgst = Math.round((gstAmount / 2) * 100) / 100;
  const sgst = Math.round((gstAmount / 2) * 100) / 100;

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `BBG_Tax_Invoice_${orderNum}`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const handleDownloadHtml = () => {
    const printContent = document.getElementById("bbg-official-tax-invoice");
    if (!printContent) return;

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>BBG_Tax_Invoice_${orderNum}</title>
  <style>
    @page { size: A4 portrait; margin: 10mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; margin: 0; padding: 20px; background: #fff; color: #111; }
    .tax-card { max-width: 800px; margin: 0 auto; border: 2px solid #1A365D; border-radius: 8px; padding: 24px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 10px; font-size: 12px; text-align: left; }
    th { background: #F1F5F9; font-weight: 700; color: #1e293b; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .stamp { display: inline-block; padding: 4px 12px; border: 2px solid #059669; color: #059669; font-weight: 800; border-radius: 6px; text-transform: uppercase; font-size: 11px; }
  </style>
</head>
<body>
  ${printContent.outerHTML}
  <script>
    window.onload = function() { window.print(); }
  </script>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `BBG_Tax_Invoice_${orderNum}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full">
      {/* Action Toolbar (Hidden during print) */}
      <div className="no-print mb-6 p-4 bg-gradient-to-r from-[#1A365D] via-[#0F2444] to-[#1A365D] rounded-2xl text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Official Tax Invoice & Cash Memo</h4>
            <p className="text-xs text-white/70">
              Verified Order <span className="font-mono font-bold text-emerald-300">#{orderNum}</span> • Standard A4 Printable & PDF Save Format
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          <button
            onClick={handleDownloadHtml}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            title="Download offline copy"
          >
            <Download className="w-4 h-4 text-emerald-300" />
            <span>Download Copy</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-95"
          >
            <Printer className="w-4 h-4 text-stone-950" />
            <span>Save as PDF / Print Bill</span>
          </button>
        </div>
      </div>

      {/* The Printable A4 Tax Invoice Card */}
      <div
        id="bbg-official-tax-invoice"
        className="bg-white text-gray-900 border-2 border-stone-800 rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto shadow-md print:shadow-none print:border-stone-800 print:p-4 print:max-w-none print:m-0 print:rounded-none"
      >
        {/* Mill Header Banner */}
        <div className="border-b-2 border-stone-800 pb-5 mb-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Official Manufacturer & Wholesale Exporter
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1A365D] tracking-tight mt-1">
                SBBG TEXTILE EXPORTER
              </h1>
              <p className="text-xs font-semibold text-stone-700">
                SBBG BHARAT TEXTILE MILL WORKS
              </p>
              <p className="text-[11px] text-stone-600 max-w-md mt-0.5 leading-tight">
                Plot No. C-14, Kupwad MIDC, Sangli, Maharashtra - 416436, India
              </p>
              <div className="text-[11px] text-stone-600 mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                <span><strong>Phone:</strong> +91 87673 22501</span>
                <span><strong>Email:</strong> bbgtextilebharat1@gmail.com</span>
                <span><strong>GSTIN:</strong> 27AABCS1234F1Z5</span>
              </div>
            </div>

            <div className="sm:text-right shrink-0 border-l-2 sm:border-l-0 pl-3 sm:pl-0 border-stone-200">
              <div className="inline-block px-3 py-1 bg-[#1A365D] text-white font-extrabold text-xs uppercase tracking-wider rounded mb-1">
                TAX INVOICE & CASH MEMO
              </div>
              <div className="text-xs font-mono font-bold text-stone-800">
                Invoice No: <span className="text-stone-950">INV-{orderNum}</span>
              </div>
              <div className="text-[11px] text-stone-600">
                Order Date: <strong>{orderDate}</strong>
              </div>
              <div className="text-[11px] text-stone-600">
                Place of Supply: <strong>Maharashtra (27)</strong>
              </div>
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  PAYMENT VERIFIED (PAID)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer & Mill Details (Billed To & Shipped From) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-5 mb-5 border-b border-stone-300 text-xs">
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center justify-between">
              <span>Billed To & Consignee (Customer)</span>
              <span className="font-mono text-stone-400">Buyer</span>
            </h4>
            <div className="font-extrabold text-stone-900 text-sm mb-0.5">
              {order.customerName || "Valued Customer"}
            </div>
            <div className="text-stone-700 font-medium">
              <strong>Phone:</strong> {order.customerPhone || "N/A"}
              {order.alternatePhone && ` • Alt: ${order.alternatePhone}`}
            </div>
            {order.customerEmail && (
              <div className="text-stone-600">
                <strong>Email:</strong> {order.customerEmail}
              </div>
            )}
            <div className="text-stone-700 mt-1 leading-snug">
              <strong>Delivery Address:</strong><br />
              {order.shippingAddress || "Mill Customer Dispatch"}, {order.city || "Sangli"}, {order.state || "Maharashtra"} - {order.postalCode || "416436"}
            </div>
          </div>

          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 flex flex-col justify-between">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center justify-between">
                <span>Dispatch & Transaction Details</span>
                <span className="font-mono text-stone-400">Mill Logistics</span>
              </h4>
              <div className="text-stone-700 leading-snug space-y-1">
                <div>
                  <strong>Payment Method:</strong>{" "}
                  {order.paymentMethod === "ONLINE_RAZORPAY"
                    ? "Paid Online (Razorpay / UPI / Cards)"
                    : order.paymentMethod === "BANK_TRANSFER"
                    ? "Direct Bank / RTGS Transfer"
                    : "Paid Online (Confirmed)"}
                </div>
                {order.paymentId && (
                  <div className="font-mono text-[11px]">
                    <strong>Transaction Ref:</strong>{" "}
                    <span className="bg-white px-1.5 py-0.5 rounded border border-stone-200 text-stone-900">
                      {order.paymentId}
                    </span>
                  </div>
                )}
                <div>
                  <strong>Dispatch Facility:</strong> Sangli Central Mill Works (Kupwad MIDC)
                </div>
                <div>
                  <strong>Courier / Cargo:</strong> Tirupati Courier / DTDC Express / Direct Mill Fleet
                </div>
              </div>
            </div>
            <div className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-200 mt-2">
              ✓ 7-Day Exchange & 100% Quality Assurance Guarantee Included
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="mb-5">
          <table className="w-full text-left border-collapse border border-stone-300">
            <thead>
              <tr className="bg-stone-100 text-stone-800 text-[11px] font-bold border-b border-stone-300">
                <th className="py-2.5 px-3 border-r border-stone-300 text-center w-10">#</th>
                <th className="py-2.5 px-3 border-r border-stone-300">Description of Fabric Goods</th>
                <th className="py-2.5 px-3 border-r border-stone-300 text-center w-20">HSN</th>
                <th className="py-2.5 px-3 border-r border-stone-300 text-center w-16">Qty</th>
                <th className="py-2.5 px-3 border-r border-stone-300 text-right w-24">Unit Rate</th>
                <th className="py-2.5 px-3 text-right w-28">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-stone-200 text-stone-800">
              {items.length > 0 ? (
                items.map((it, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/50">
                    <td className="py-2.5 px-3 border-r border-stone-300 text-center font-mono font-bold text-stone-500">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-3 border-r border-stone-300">
                      <div className="font-bold text-stone-900">
                        {it.name || "4-Way Stretch Cotton Lycra Leggings"}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {it.color && <span className="font-semibold text-stone-700">Shade: {it.color} • </span>}
                        {it.size && <span>Size: {it.size} • </span>}
                        <span>Super Combed 95% Cotton 5% Lycra (Bio-Washed)</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 border-r border-stone-300 text-center font-mono text-[11px] text-stone-600">
                      6104
                    </td>
                    <td className="py-2.5 px-3 border-r border-stone-300 text-center font-bold text-stone-900">
                      {it.quantity || 1}
                    </td>
                    <td className="py-2.5 px-3 border-r border-stone-300 text-right font-mono">
                      ₹{Number(it.price || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold font-mono text-stone-900">
                      ₹{((Number(it.price) || 0) * (Number(it.quantity) || 1)).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-2.5 px-3 border-r border-stone-300 text-center">1</td>
                  <td className="py-2.5 px-3 border-r border-stone-300">
                    <div className="font-bold text-stone-900">4-Way Stretch Cotton Lycra Leggings</div>
                    <div className="text-[11px] text-stone-500">Super Combed Cotton Bio-Washed Wholesale Order</div>
                  </td>
                  <td className="py-2.5 px-3 border-r border-stone-300 text-center font-mono text-[11px]">6104</td>
                  <td className="py-2.5 px-3 border-r border-stone-300 text-center font-bold">1</td>
                  <td className="py-2.5 px-3 border-r border-stone-300 text-right font-mono">₹{subtotal.toLocaleString("en-IN")}</td>
                  <td className="py-2.5 px-3 text-right font-bold font-mono">₹{subtotal.toLocaleString("en-IN")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Calculation Summary & Amount in Words */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pb-5 mb-5 border-b border-stone-300">
          <div className="sm:col-span-7 flex flex-col justify-between text-xs space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-0.5">
                Total Amount in Words:
              </span>
              <div className="font-serif italic font-bold text-stone-900 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                {numberToWordsINR(subtotal)}
              </div>
            </div>

            <div className="text-[11px] text-stone-600 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200">
              <strong className="text-amber-900">Terms & Conditions:</strong>
              <ul className="list-disc pl-4 mt-1 space-y-0.5 text-stone-700">
                <li>Goods once sold can be exchanged/refunded within 7 days of delivery under our return policy.</li>
                <li>All fabrics are certified 4-way stretch, bio-washed, and pre-shrunk at our Sangli Mill.</li>
                <li>Subject to Sangli Jurisdiction. E. & O.E.</li>
              </ul>
            </div>
          </div>

          <div className="sm:col-span-5 bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs space-y-2">
            <div className="flex justify-between text-stone-600">
              <span>Taxable Value:</span>
              <span className="font-mono font-medium">₹{taxableValue.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>CGST (2.5%):</span>
              <span className="font-mono font-medium">₹{cgst.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>SGST (2.5%):</span>
              <span className="font-mono font-medium">₹{sgst.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Mill Dispatch / Shipping:</span>
              <span className="font-bold text-emerald-700 uppercase text-[11px]">FREE</span>
            </div>
            <div className="pt-2 border-t-2 border-stone-800 flex justify-between items-center text-stone-950 font-bold">
              <span className="text-sm">Grand Total (Incl. Taxes):</span>
              <span className="text-lg font-mono text-[#1A365D]">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Authentication & Signature */}
        <div className="flex flex-col sm:flex-row justify-between items-end gap-6 text-xs pt-2">
          <div className="text-[11px] text-stone-500 max-w-sm">
            <p className="font-semibold text-stone-700 mb-0.5">Need assistance with this order?</p>
            <p>Call or WhatsApp Trade Desk: <strong>+91 87673 22501</strong></p>
            <p>Email: <strong>bbgtextilebharat1@gmail.com</strong></p>
            <p className="text-[10px] text-stone-400 mt-2">
              This is a digitally generated Tax Invoice / Cash Bill issued from SBBG Bharat Textile Mill Management System. No physical signature is required.
            </p>
          </div>

          <div className="text-center sm:text-right shrink-0">
            <div className="inline-block border-2 border-dashed border-stone-300 rounded-xl p-3 bg-stone-50/50 min-w-[200px]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-4">
                For SBBG BHARAT TEXTILE
              </div>
              <div className="font-serif italic font-extrabold text-stone-800 text-sm tracking-wide text-center">
                SBBG Textile Sangli
              </div>
              <div className="text-[10px] font-semibold text-stone-500 border-t border-stone-300 pt-1 mt-2 text-center">
                Authorized Signatory & Seal
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
