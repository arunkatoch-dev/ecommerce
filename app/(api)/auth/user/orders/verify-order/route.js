import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/db/dbConnect";
import Orders from "@/Modals/Orders";
import Cart from "@/Modals/Cart";
import User from "@/Modals/User";
import nodemailer from "nodemailer";
const generatedSignature = (razorpayOrderId, razorpayPaymentId) => {
  const keySecret = process.env.RAZORPAY_SECRET_KEY;

  const sig = crypto
    .createHmac("sha256", keySecret)
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest("hex");
  return sig;
};

export async function POST(request) {
  try {
    const {
      userId,
      shippingAddressId,
      orderId,
      razorpayPaymentId,
      razorpaySignature,
    } = await request.json();

    const signature = generatedSignature(orderId, razorpayPaymentId);
    if (signature !== razorpaySignature) {
      return NextResponse.json(
        { message: "payment verification failed", success: false },
        { status: 400 }
      );
    }

    // Probably some database calls here to update order or add premium status to user
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

    const newOrder = new Orders({
      userId,
      items: cart.items,
      totalPrice: cart.totalPrice,
      shippingAddress: shippingAddressId,
      paymentMethod: "online",
      orderId,
      razorpayPaymentId,
    });

    await newOrder.save();

    // Clear the cart after creating the order
    await Cart.findOneAndUpdate({ user: userId }, { items: [], totalPrice: 0 });
    // Send order confirmation email
    const user = await User.findById(userId);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Order Confirmation",
      text: `Your order with ID ${newOrder._id} has been successfully placed.`,
      html: `
  <p>Your order with ID <strong>${
    newOrder._id
  }</strong> has been successfully placed.</p>
  <div>
      <h2>Order Details</h2>
      <p><strong>Order ID:</strong> ${newOrder._id}</p>
      <p><strong>Status:</strong> ${newOrder.status}</p>
      <p><strong>Payment Method:</strong> ${newOrder.paymentMethod}</p>
      <p><strong>Razor pay Payment Id:</strong> ${
        newOrder.razorpayPaymentId
      }</p>
      <p><strong>Order Date:</strong> ${new Date(
        newOrder.createdAt
      ).toLocaleString()}</p>
      <h3>Items</h3>
      ${newOrder.items
        .map(
          (item) => `
        <div>
          <p><strong>${item.product.title}</strong></p>
          <p>Size: ${item.size}</p>
          <p>Quantity: ${item.quantity}</p>
          <p>Price: <strong>₹${
            item.price - (item.price * item.discount) / 100
          }</strong> 
            <del>₹${item.price}</del> (-${item.discount}%)</p>
        </div>
      `
        )
        .join("")}
      <h3>Total Price: ₹${newOrder.totalPrice}</h3>
      
  </div>
`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        message: "payment verified successfully",
        success: true,
        order: newOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying order:", error);
    return NextResponse.json(
      {
        message: "Order verifying error",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
