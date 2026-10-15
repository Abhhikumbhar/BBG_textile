import { z } from "zod";

export function formatZodError(error: any): string {
  if (error?.issues?.[0]?.message) return error.issues[0].message;
  if (error?.errors?.[0]?.message) return error.errors[0].message;
  return error?.message || "Validation failed";
}

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const productVariantSchema = z.object({
  id: z.string().optional(),
  color: z.string().nullable().optional(),
  size: z.string().nullable().optional(),
  sku: z.string().nullable().optional(),
  additionalPrice: z.coerce.number().min(0).default(0),
  stockQuantity: z.coerce.number().int().min(0).default(0),
});

export const productImageSchema = z.object({
  id: z.string().optional(),
  url: z.string().url("Valid image URL required"),
  publicId: z.string().nullable().optional(),
  altText: z.string().nullable().optional(),
  displayOrder: z.coerce.number().int().default(0),
  isPrimary: z.boolean().default(false),
});

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().min(5, "Product description is required"),
  sku: z.string().min(2, "SKU is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  wholesalePrice: z.coerce.number().min(0).nullable().optional(),
  isEnquiryOnly: z.boolean().default(false),
  isPurchasableOnline: z.boolean().default(true),
  stockQuantity: z.coerce.number().int().min(0).default(0),
  stockStatus: z.enum(["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"]).default("IN_STOCK"),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isActive: z.boolean().default(true),
  categoryId: z.string().min(1, "Please select a category"),
  images: z.array(productImageSchema).default([]),
  variants: z.array(productVariantSchema).default([]),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  slug: z.string().min(2, "Category slug is required"),
  description: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  displayOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const enquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(8, "Valid phone number is required"),
  email: z.string().email("Valid email is required").optional().or(z.literal("")),
  message: z.string().min(5, "Please enter your message"),
  productId: z.string().nullable().optional(),
});

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Full name is required"),
  customerPhone: z.string().min(10, "10-digit phone number is required"),
  customerEmail: z.string().email().optional().or(z.literal("")),
  shippingAddress: z.string().min(5, "Delivery address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(5, "Postal code is required"),
  paymentMethod: z.enum(["WHATSAPP_COD", "COD", "BANK_TRANSFER"]).default("WHATSAPP_COD"),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string().optional(),
        color: z.string().optional(),
        size: z.string().optional(),
        quantity: z.number().int().min(1),
      })
    )
    .min(1, "Cart cannot be empty"),
});

export const siteSettingsSchema = z.object({
  businessName: z.string().min(1),
  tagline: z.string().optional(),
  phone: z.string().min(5),
  whatsappNumber: z.string().min(5),
  email: z.string().email(),
  address: z.string().min(5),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(1),
  googleMapsUrl: z.string().nullable().optional(),
  onlineShoppingEnabled: z.boolean().default(true),
  currencySymbol: z.string().default("₹"),
  announcementText: z.string().nullable().optional(),
  heroTitle: z.string().min(1),
  heroSubtitle: z.string().optional(),
  aboutTitle: z.string().min(1),
  aboutStory: z.string().min(10),
  aboutMission: z.string().nullable().optional(),
  aboutSpecialties: z.string().nullable().optional(),
  seoTitle: z.string().min(1),
  seoDescription: z.string().min(1),
  instagramUrl: z.string().nullable().optional(),
  facebookUrl: z.string().nullable().optional(),
});
