import dbConnect from "@/lib/db/dbConnect";
import Cart from "@/Modals/Cart";
import Product from "@/Modals/Product";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId, productId, variantId, quantity, size } =
      await request.json();

    if (!userId || !productId || !size || !variantId || !quantity) {
      return NextResponse.json(
        {
          message:
            "Invalid request. Please provide userId, productId, variantId, and quantity.",
          success: false,
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found", success: false },
        { status: 404 }
      );
    }

    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product items.variant"
    );

    const item = {
      product: productId,
      variant: variantId,
      size,
      quantity,
      price: product.price,
      discount: product.discount,
    };

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (cartItem) =>
          cartItem.product.equals(productId) &&
          cartItem.variant.equals(variantId) &&
          cartItem.size === size
      );
      if (itemIndex > -1) {
        // If product variant exists in the cart, update the quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // If product variant does not exist in the cart, add it
        cart.items.push(item);
      }

      cart.totalPrice = await cart.items.reduce((total, item) => {
        const discountedPrice = item.price - (item.price * item.discount) / 100;
        return total + discountedPrice * item.quantity;
      }, 0);

      await cart.save();
    } else {
      // If cart does not exist, create a new cart
      const discountedPrice = item.price - (item.price * item.discount) / 100;
      const newCart = new Cart({
        user: userId,
        items: [item],
        totalPrice: discountedPrice * item.quantity,
      });

      await newCart.save();
    }

    return NextResponse.json({
      message: "Cart updated successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Error updating cart:", error.stack);
    return NextResponse.json(
      {
        message: "Error updating cart",
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

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required", success: false },
        { status: 400 }
      );
    }

    await dbConnect();
    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product items.variant"
    );

    if (!cart) {
      return NextResponse.json(
        { message: "Your Cart is empty", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Cart fetched successfully.",
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Error fetching cart details:", error.stack);
    return NextResponse.json(
      {
        message: "Error fetching cart details",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const { userId, itemId, quantity } = await request.json();
    if (!userId || !itemId || !quantity) {
      return NextResponse.json(
        {
          message: "Invalid request. Please provide userId and itemId.",
          success: false,
        },
        { status: 400 }
      );
    }

    await dbConnect();
    const cart = await Cart.findOne({ user: userId });
    const cartItem = cart?.items?.find((item) => item._id.equals(itemId));
    cartItem.quantity = quantity;
    cart.totalPrice = await cart.items.reduce((total, item) => {
      const discountedPrice = item.price - (item.price * item.discount) / 100;
      return total + discountedPrice * item.quantity;
    }, 0);
    cart.save();
    return NextResponse.json({
      message: "Cart updated successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Error fetching cart details:", error.stack);
    return NextResponse.json(
      {
        message: "Error updating cart details",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const itemId = url.searchParams.get("itemId");
    if (!userId || !itemId) {
      return NextResponse.json(
        {
          message: "Invalid request. Please provide userId and itemId.",
          success: false,
        },
        { status: 400 }
      );
    }

    await dbConnect();
    const cart = await Cart.findOne({ user: userId });
    cart.items = cart.items.filter((item) => !item._id.equals(itemId));
    cart.totalPrice = await cart.items.reduce((total, item) => {
      const discountedPrice = item.price - (item.price * item.discount) / 100;
      return total + discountedPrice * item.quantity;
    }, 0);
    cart.save();
    return NextResponse.json({
      message: "Cart item deleted successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Error fetching cart details:", error.stack);
    return NextResponse.json(
      {
        message: "Error Deleting cart item",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
