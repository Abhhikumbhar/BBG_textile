import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Cormorant_Garamond,
  Playfair_Display,
  Bodoni_Moda,
} from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import BottomNav from "@/components/BottomNav";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import SplashIntro from "@/components/SplashIntro";
import { getSiteSettings } from "@/lib/data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: {
      default: settings?.seoTitle || "BBG TEXTILE EXPORTER | Premium Fabrics & Garments in Sangli",
      template: "%s | BBG Textile Exporter",
    },
    description:
      settings?.seoDescription ||
      "Premier manufacturer & wholesale supplier of cotton shirting, suiting, linens, and uniform fabrics in Kupwad MIDC, Sangli, Maharashtra.",
    keywords: [
      "BBG TEXTILE EXPORTER",
      "BBG Textile",
      "Textiles Sangli",
      "Kupwad MIDC fabrics",
      "Cotton shirting Sangli",
      "Suiting fabric wholesale",
      "Wholesale textile Maharashtra",
    ],
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${playfair.variable} ${bodoni.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FDFDFD] text-[#1F2937] font-sans selection:bg-[#1A365D] selection:text-white">
        <SplashIntro />
        <CartProvider>
          {children}
          <CartDrawer />
          <BottomNav />
          <WhatsAppWidget whatsappNumber={settings?.whatsappNumber || "918767322501"} />
        </CartProvider>
      </body>
    </html>
  );
}
