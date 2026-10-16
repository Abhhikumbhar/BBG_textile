import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetailClient from "./ProductDetailClient";
import { getSiteSettings } from "@/lib/data";
import {
  getAllCatalogProducts,
  getCatalogProductBySlug,
  getCatalogRelatedProducts,
} from "@/lib/catalog";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    let product: any = null;
    try {
      product = await prisma.product.findFirst({
        where: {
          OR: [{ slug }, { id: slug }],
          isActive: true,
        },
        select: { name: true, description: true },
      });
    } catch {
      // DB connection failed, fallback to static catalog
    }

    if (!product) {
      product = getCatalogProductBySlug(slug);
    }

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

  let settings: any = null;
  let product: any = null;
  let relatedProducts: any[] = [];

  // 1. Fetch site settings safely
  try {
    settings = await getSiteSettings();
  } catch (err) {
    console.warn("Failed to fetch settings:", err);
  }

  // 2. Try fetching product from Database
  try {
    product = await prisma.product.findFirst({
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
    });
  } catch (err) {
    console.warn("Prisma fetch failed, using static catalog fallback:", err);
  }

  // 3. Resilient fallback to static catalog (essential for Vercel deployment)
  if (!product) {
    product = getCatalogProductBySlug(slug);
  }

  if (!product) {
    notFound();
  }

  // 4. Fetch related products safely
  try {
    if (product.categoryId) {
      relatedProducts = await prisma.product.findMany({
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
    }
  } catch {
    // DB offline, fallback to catalog
  }

  if (!relatedProducts || relatedProducts.length === 0) {
    relatedProducts = getCatalogRelatedProducts(product.id, 4);
  }

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
