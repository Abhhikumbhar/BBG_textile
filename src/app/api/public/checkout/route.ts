import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkoutSchema, formatZodError } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = checkoutSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: formatZodError(result.error) },
        { status: 400 }
      );
    }

    const {
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      city,
      state,
      postalCode,
      paymentMethod,
      notes,
      items,
    } = result.data;

    // Check Site Settings if shopping is enabled
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });

    if (settings && !settings.onlineShoppingEnabled) {
      return NextResponse.json(
        {
          error:
            "Online purchasing is currently in enquiry mode. Please click 'Enquire on WhatsApp' to place your wholesale order.",
        },
        { status: 400 }
      );
    }

    // Fetch products from database to verify prices and stock
    const productIds = items.map((i) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
      include: {
        variants: true,
        images: { take: 1, orderBy: { displayOrder: "asc" } },
      },
    });

    if (dbProducts.length !== productIds.length) {
      return NextResponse.json(
        { error: "One or more products in your cart are no longer available" },
        { status: 400 }
      );
    }

    // Verify stock and prepare order items with DB verified prices
    const validatedOrderItems: {
      productId: string;
      productName: string;
      productSku: string;
      productImage?: string;
      color?: string;
      size?: string;
      price: number;
      quantity: number;
      total: number;
      variantId?: string;
    }[] = [];

    let calculatedSubtotal = 0;

    for (const item of items) {
      const prod = dbProducts.find((p) => p.id === item.productId);
      if (!prod) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }

      if (!prod.isPurchasableOnline) {
        return NextResponse.json(
          {
            error: `"${prod.name}" is an enquiry-only product. Please contact us via WhatsApp for bulk quoting.`,
          },
          { status: 400 }
        );
      }

      let unitPrice = prod.price;
      let availableStock = prod.stockQuantity;

      // If variant specified
      let matchedVariant = null;
      if (item.variantId) {
        matchedVariant = prod.variants.find((v) => v.id === item.variantId);
      } else if (item.color || item.size) {
        matchedVariant = prod.variants.find(
          (v) =>
            (!item.color || v.color === item.color) &&
            (!item.size || v.size === item.size)
        );
      }

      if (matchedVariant) {
        unitPrice += matchedVariant.additionalPrice;
        if (matchedVariant.stockQuantity > 0) {
          availableStock = matchedVariant.stockQuantity;
        }
      }

      if (availableStock < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for "${prod.name}" (${item.color || ""} ${item.size || ""}). Only ${availableStock} available.`,
          },
          { status: 400 }
        );
      }

      const itemTotal = unitPrice * item.quantity;
      calculatedSubtotal += itemTotal;

      validatedOrderItems.push({
        productId: prod.id,
        productName: prod.name,
        productSku: prod.sku,
        productImage: prod.images[0]?.url,
        color: item.color || matchedVariant?.color || undefined,
        size: item.size || matchedVariant?.size || undefined,
        price: unitPrice,
        quantity: item.quantity,
        total: itemTotal,
        variantId: matchedVariant?.id,
      });
    }

    const shippingFee = 0; // Free delivery / shipping
    const total = calculatedSubtotal + shippingFee;
    const year = new Date().getFullYear();
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `BBG-${year}-${randomNum}`;

    // Execute in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Upsert Customer by phone
      const customer = await tx.customer.upsert({
        where: { phone: customerPhone },
        update: {
          name: customerName,
          email: customerEmail || null,
          address: shippingAddress,
          city,
          state,
          postalCode,
        },
        create: {
          phone: customerPhone,
          name: customerName,
          email: customerEmail || null,
          address: shippingAddress,
          city,
          state,
          postalCode,
        },
      });

      // 2. Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          customerName,
          customerPhone,
          customerEmail: customerEmail || null,
          shippingAddress,
          city,
          state,
          postalCode,
          status: "PENDING",
          paymentStatus: paymentMethod === "COD" ? "PENDING" : "PENDING",
          paymentMethod,
          subtotal: calculatedSubtotal,
          shippingFee,
          total,
          notes,
          items: {
            create: validatedOrderItems.map((i) => ({
              productId: i.productId,
              productName: i.productName,
              productSku: i.productSku,
              productImage: i.productImage,
              color: i.color,
              size: i.size,
              price: i.price,
              quantity: i.quantity,
              total: i.total,
            })),
          },
          statusHistory: {
            create: {
              status: "PENDING",
              comment: "Order placed by customer",
              changedBy: "Customer Online Checkout",
            },
          },
        },
        include: {
          items: true,
        },
      });

      // 3. Decrement Inventory safely
      for (const item of validatedOrderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: { decrement: item.quantity },
          },
        });

        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stockQuantity: { decrement: item.quantity },
            },
          });
        }
      }

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      message: "Order placed successfully!",
      orderNumber: order.orderNumber,
      orderId: order.id,
      total: order.total,
    });
  } catch (error) {
    console.error("Checkout API error:", error);
    return NextResponse.json(
      { error: "Failed to process order. Please try again." },
      { status: 500 }
    );
  }
}
