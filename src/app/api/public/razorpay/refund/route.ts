import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { paymentId, amount, orderNumber, reason } = body;

    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID (pay_...) is required to process refund" },
        { status: 400 }
      );
    }

    const key_id = process.env.RAZORPAY_KEY_ID || "rzp_live_Tu1eCir2cfBKqr";
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "rwpl9X0H2tno6zZ8xSVktUWW";

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const refundOptions: any = {
      notes: {
        orderNumber: orderNumber || "N/A",
        reason: reason || "Customer Order Cancellation",
      },
    };

    // If specific amount is specified (in rupees), convert to paise
    if (amount && Number(amount) > 0) {
      refundOptions.amount = Math.round(Number(amount) * 100);
    }

    // Call official Razorpay Refund API
    const refund = await razorpay.payments.refund(paymentId, refundOptions);

    // Update database record if Prisma order exists
    if (orderNumber) {
      try {
        await prisma.order.updateMany({
          where: { orderNumber },
          data: {
            status: "CANCELLED",
            paymentStatus: "REFUNDED",
          },
        });
      } catch (dbErr) {
        console.warn("Database order status update skipped:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      refundId: refund.id,
      paymentId: refund.payment_id,
      amount: refund.amount ? refund.amount / 100 : amount,
      status: refund.status,
      speed: refund.speed_processed || "normal",
      createdAt: refund.created_at,
    });
  } catch (error: any) {
    console.error("Razorpay refund processing error:", error);
    return NextResponse.json(
      {
        error:
          error?.error?.description ||
          error?.message ||
          "Failed to process refund with Razorpay. Please check Razorpay balance.",
      },
      { status: 500 }
    );
  }
}
