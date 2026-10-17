import React from "react";
import EnquiriesAdminClient from "./EnquiriesAdminClient";
import { getAdminEnquiries } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  const initialEnquiries = await getAdminEnquiries(50);
  return <EnquiriesAdminClient initialEnquiries={initialEnquiries} />;
}

