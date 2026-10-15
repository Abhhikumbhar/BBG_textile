import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import OrderDetailAdminClient from "./OrderDetailAdminClient";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      statusHistory: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return <OrderDetailAdminClient order={order} />;
}
