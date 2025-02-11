import dbConnect from "@/lib/db/dbConnect";
import Cart from "@/Modals/Cart";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

export async function POST(request) {
  try {
    const { userId } = await request.json();
    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        {
          message: "Invalid request. Required fields are missing",
          success: false,
        },
        { status: 400 }
      );
    }

    await dbConnect();
    // Fetch cart items for the user
    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product items.variant"
    );
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        {
          message: "Cart is empty",
          success: false,
        },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount: cart.totalPrice * 100,
      currency: "INR",
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      {
        message: "Order creation error",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
