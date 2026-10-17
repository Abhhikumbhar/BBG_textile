import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductForm from "../../ProductForm";
import { getCategories } from "@/lib/data";
import { fallbackProducts } from "@/lib/catalogData";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  let timer: NodeJS.Timeout;
  const timeout = new Promise<any>((resolve) => {
    timer = setTimeout(() => resolve(null), 2500);
  });

  const [product, categories] = await Promise.all([
    Promise.race([
      prisma.product.findUnique({
        where: { id },
        include: {
          images: { orderBy: { displayOrder: "asc" } },
          variants: { orderBy: { createdAt: "asc" } },
        },
      }),
      timeout,
    ]).finally(() => clearTimeout(timer)),
    getCategories(),
  ]);

  const finalProduct =
    product || fallbackProducts.find((p) => p.id === id || p.slug === id) || null;

  if (!finalProduct) {
    notFound();
  }

  return (
    <ProductForm
      initialData={finalProduct}
      categories={categories}
      isEdit={true}
    />
  );
}
