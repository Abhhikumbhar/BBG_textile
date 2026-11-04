/**
 * Utility to detect if the application is running inside a mobile app shell / WebView,
 * standalone PWA mode, or via an explicit query parameter.
 */
export function isAppMode() {
  if (typeof window === "undefined") return false;

  try {
    // 1. Explicit query parameter (e.g. ?app=true, ?mode=app, ?webview=true, ?platform=app)
    const params = new URLSearchParams(window.location.search);
    if (
      params.get("app") === "true" ||
      params.get("webview") === "true" ||
      params.get("mode") === "app" ||
      params.get("platform") === "app"
    ) {
      sessionStorage.setItem("sbbg_in_app_mode", "true");
      return true;
    }
  } catch (e) {}

  // 2. Persisted session flag
  try {
    if (sessionStorage.getItem("sbbg_in_app_mode") === "true") {
      return true;
    }
  } catch (e) {}

  // 3. iOS standalone PWA (Add to Home Screen)
  if (window.navigator && "standalone" in window.navigator && window.navigator.standalone) {
    return true;
  }

  // 4. CSS display-mode standalone
  if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) {
    return true;
  }

  // 5. Capacitor or React Native bridge or iOS WKWebView or Flutter inappwebview
  if (
    Boolean(window.Capacitor) ||
    Boolean(window.ReactNativeWebView) ||
    Boolean(window.flutter_inappwebview) ||
    Boolean(window.Flutter) ||
    Boolean(window.webkit && window.webkit.messageHandlers)
  ) {
    return true;
  }

  // 6. User Agent check: custom Flutter app UA, iOS WKWebView, Android WebView
  const ua = window.navigator?.userAgent || "";
  if (/BBG_Mobile_App|bbg_textile_app|Flutter/i.test(ua)) {
    return true;
  }

  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isWebkit = /AppleWebKit/i.test(ua);
  const isSafari = /Safari/i.test(ua);
  if (isIOS && isWebkit && !isSafari) {
    return true;
  }

  // Android WebView check (contains 'wv' or 'Version/X.X Chrome')
  if (/Android/i.test(ua) && (/wv/i.test(ua) || /Version\/[\d.]+/i.test(ua))) {
    return true;
  }

  return false;
}
