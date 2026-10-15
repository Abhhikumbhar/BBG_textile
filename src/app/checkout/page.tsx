import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutClient from "./CheckoutClient";
import { getSiteSettings } from "@/lib/data";

export const metadata = {
  title: "Checkout | BBG Textile Sangli",
  description: "Complete your fabric order with BBG Textile.",
};

export default async function CheckoutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header settings={settings || undefined} />
      <main className="flex-1">
        <CheckoutClient whatsappNumber={settings?.whatsappNumber} />
      </main>
      <Footer settings={settings || undefined} />
    </div>
  );
}
