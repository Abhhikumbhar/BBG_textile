import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetailClient from "./ProductDetailClient";
import { getSiteSettings, getProductBySlug } from "@/lib/data";
import {
  getAllCatalogProducts,
  getCatalogProductBySlug,
  getCatalogRelatedProducts,
} from "@/lib/catalog";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

// Prerender all 17 product pages at build time so Vercel serves them instantly without DB dependency
export async function generateStaticParams() {
  const staticSlugs = getAllCatalogProducts().map((p) => ({ slug: p.slug }));
  try {
    const dbProducts = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true },
    });
    const all = new Set([
      ...staticSlugs.map((s) => s.slug),
      ...dbProducts.map((p) => p.slug),
    ]);
    return Array.from(all).map((slug) => ({ slug }));
  } catch {
    return staticSlugs;
  }
}

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

  // 2. Fetch product with in-memory caching and resilient fallback
  try {
    product = await getProductBySlug(slug);
  } catch (err) {
    console.warn("getProductBySlug failed, using static catalog fallback:", err);
  }

  // 3. Fallback to static catalog if still not found
  if (!product) {
    product = getCatalogProductBySlug(slug);
  }

  if (!product) {
    notFound();
  }

  // 4. Fetch related products safely with 500ms fast guard
  try {
    if (product.categoryId) {
      const timeout = new Promise<any[]>((resolve) => setTimeout(() => resolve([]), 500));
      relatedProducts = await Promise.race([
        prisma.product.findMany({
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
        }),
        timeout,
      ]);
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
