import React from "react";
import AdminLayoutClient from "./AdminLayoutClient";

export const metadata = {
  title: "BBG Textile Management Console",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
