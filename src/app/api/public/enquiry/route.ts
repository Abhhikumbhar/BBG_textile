import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { enquirySchema, formatZodError } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = enquirySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: formatZodError(result.error) },
        { status: 400 }
      );
    }

    const { name, phone, email, message, productId } = result.data;

    // Verify product exists if provided
    let validProductId: string | null = null;
    if (productId) {
      const prod = await prisma.product.findUnique({
        where: { id: productId },
        select: { id: true },
      });
      if (prod) {
        validProductId = prod.id;
      }
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        phone,
        email: email || null,
        message,
        productId: validProductId,
        status: "NEW",
      },
      include: {
        product: {
          select: { name: true, sku: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out! We have received your enquiry and our team will contact you shortly.",
      enquiryId: enquiry.id,
    });
  } catch (error) {
    console.error("Enquiry submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry. Please try again or WhatsApp us directly." },
      { status: 500 }
    );
  }
}
