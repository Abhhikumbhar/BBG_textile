import React from "react";
import OrdersAdminClient from "./OrdersAdminClient";
import { getAdminOrders } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const initialOrders = await getAdminOrders(50);
  return <OrdersAdminClient initialOrders={initialOrders} />;
}

