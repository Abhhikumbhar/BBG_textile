/**
 * Razorpay Integration Helper for BBG Textile
 * Key ID: rzp_live_Tu1eCir2cfBKqr
 */

export const RAZORPAY_KEY_ID =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_RAZORPAY_KEY_ID) ||
  (typeof process !== "undefined" && process.env && process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) ||
  "rzp_live_Tu1eCir2cfBKqr";

/**
 * Dynamically loads the Razorpay checkout script if not already present.
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
