import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetailClient from "./ProductDetailClient";
import { getSiteSettings } from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true },
    });
    return products.map((p) => ({ slug: p.slug }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
        isActive: true,
      },
      select: { name: true, description: true },
    });

    if (!product) return { title: "Product Not Found | BBG Textile" };

    return {
      title: `${product.name} | BBG Textile Sangli`,
      description: product.description.substring(0, 160),
    };
  } catch {
    return { title: "Product Detail | BBG Textile" };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  // Concurrent fetch for maximum speed
  const [settings, product] = await Promise.all([
    getSiteSettings(),
    prisma.product.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
        isActive: true,
      },
      include: {
        category: true,
        images: {
          orderBy: { displayOrder: "asc" },
        },
        variants: {
          orderBy: { createdAt: "asc" },
        },
      },
    }),
  ]);

  if (!product) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true, slug: true } },
      images: { take: 1, orderBy: { displayOrder: "asc" } },
      variants: true,
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header settings={settings || undefined} />
      <main className="flex-1">
        <ProductDetailClient
          product={product}
          relatedProducts={relatedProducts}
          whatsappNumber={settings?.whatsappNumber}
        />
      </main>
      <Footer settings={settings || undefined} />
    </div>
  );
}
