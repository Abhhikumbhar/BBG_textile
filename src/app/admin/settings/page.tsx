import React from "react";
import SettingsAdminClient from "./SettingsAdminClient";
import { getSiteSettings, getHomeBanners } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [initialSettings, initialBanners] = await Promise.all([
    getSiteSettings(),
    getHomeBanners(),
  ]);

  return (
    <SettingsAdminClient
      initialSettings={initialSettings}
      initialBanners={initialBanners}
    />
  );
}

