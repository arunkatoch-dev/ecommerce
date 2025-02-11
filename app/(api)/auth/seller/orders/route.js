import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/dbConnect";
import Orders from "@/Modals/Orders";
import Product from "@/Modals/Product";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const sellerId = url.searchParams.get("sellerId");

    if (!sellerId) {
      return NextResponse.json(
        {
          message: "Seller ID is required",
          success: false,
        },
        { status: 400 }
      );
    }

    await dbConnect();

    // Fetch orders and populate product details
    const orders = await Orders.find()
      .populate({
        path: "items.product",
        select: "title price category subCategory variants seller",
        match: { seller: sellerId }, // Filter products by seller ID
      })
      .populate("shippingAddress");

    // Filter out orders with no matching products
    const filteredOrders = orders.filter((order) =>
      order.items.some((item) => item.product !== null)
    );

    // Filter the variants to include only the ordered variant
    const ordersWithFilteredVariants = filteredOrders.map((order) => {
      const items = order.items.map((item) => {
        if (item.product) {
          const variant = item.product.variants.id(item.variant);
          return {
            ...item.toObject(),
            product: {
              ...item.product.toObject(),
              variants: [variant],
            },
          };
        }
        return item;
      });
      return {
        ...order.toObject(),
        items,
      };
    });

    return NextResponse.json({
      message: "Orders fetched successfully.",
      success: true,
      orders: ordersWithFilteredVariants,
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

export async function PATCH(request) {
  try {
    const { orderId, itemId, status } = await request.json();
    console.log("orderId", orderId);
    console.log("itemId", itemId);
    console.log("status", status);

    if (!orderId || !itemId || !status) {
      return NextResponse.json(
        {
          message: "Order ID, item ID, and status are required",
          success: false,
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const order = await Orders.findById(orderId);

    if (!order) {
      return NextResponse.json(
        {
          message: "Order not found",
          success: false,
        },
        { status: 404 }
      );
    }

    const item = await order.items.id(itemId);
    console.log("item", item);

    if (!item) {
      return NextResponse.json(
        {
          message: "Item not found in order",
          success: false,
        },
        { status: 404 }
      );
    }

    // Check if status is already present
    if (item.status === status) {
      return NextResponse.json(
        {
          message: `Item already in ${status} stage.`,
          success: false,
        },
        { status: 400 }
      );
    }

    const product = await Product.findById(item.product._id);
    console.log("product", product);

    if (!product) {
      return NextResponse.json(
        {
          message: `Product not found for item ${item._id}`,
          success: false,
        },
        { status: 404 }
      );
    }

    const productVariant = await product.variants.id(item.variant);
    console.log("product Variant", productVariant);

    if (!productVariant) {
      return NextResponse.json(
        {
          message: `Variant not found for item ${item._id}`,
          success: false,
        },
        { status: 404 }
      );
    }

    if (productVariant.stock < item.quantity) {
      return NextResponse.json(
        {
          message: `Insufficient stock for item ${item._id}`,
          success: false,
        },
        { status: 400 }
      );
    }

    // Decrease the stock value of the variant by the quantity value
    if (status === "shipped") {
      productVariant.stock -= item.quantity;
      await product.save();
    }

    item.status = status;
    console.log("item status", item.status);
    await order.save();

    return NextResponse.json({
      message: "Item status updated successfully.",
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error updating item status:", error);
    return NextResponse.json(
      {
        message: "Error updating item status",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
