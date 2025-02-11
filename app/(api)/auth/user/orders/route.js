import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/dbConnect";
import Order from "@/Modals/Orders";
import Cart from "@/Modals/Cart";
import User from "@/Modals/User";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { userId, shippingAddressId, paymentMethod } = await request.json();

    // Validate required fields
    if (!userId || !shippingAddressId || !paymentMethod) {
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

    // Create order from cart items
    const newOrder = new Order({
      userId,
      items: cart.items,
      totalPrice: cart.totalPrice,
      shippingAddress: shippingAddressId,
      paymentMethod,
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

    return NextResponse.json({
      message: "Order created successfully.",
      success: true,
      order: newOrder,
    });
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

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    await dbConnect();

    if (!userId) {
      return NextResponse.json(
        {
          message: "user Id not found",
          success: false,
        },
        { status: 404 }
      );
    }

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "items.product",
        select: "title price category subCategory variants",
      })
      .populate("shippingAddress");

    return NextResponse.json({
      message: "Orders fetched successfully.",
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      {
        message: "Error fetching orders",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
