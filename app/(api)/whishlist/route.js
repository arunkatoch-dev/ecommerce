import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/dbConnect";
import Wishlist from "@/Modals/Wishlist";
import Product from "@/Modals/Product";

export async function POST(request) {
  try {
    const { userId, productId } = await request.json();

    if (!userId || !productId) {
      return NextResponse.json(
        {
          message: "User ID and Product ID are required",
          success: false,
        },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        {
          message: "Product not found",
          success: false,
        },
        { status: 404 }
      );
    }

    // Check if the wishlist exists for the user
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      // Create a new wishlist if it doesn't exist
      wishlist = new Wishlist({
        user: userId,
        products: [{ product: productId }],
      });
    } else {
      // Add the product to the existing wishlist
      const productExists = wishlist.products.some(
        (item) => item.product.toString() === productId
      );

      if (productExists) {
        return NextResponse.json(
          {
            message: "Product already in wishlist",
            success: false,
          },
          { status: 400 }
        );
      }

      wishlist.products.push({ product: productId });
    }

    await wishlist.save();

    return NextResponse.json({
      message: "Product added to wishlist successfully",
      success: true,
      wishlist,
    });
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    return NextResponse.json(
      {
        message: "Error adding product to wishlist",
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
        {
          message: "User ID is required",
          success: false,
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const wishlist = await Wishlist.findOne({ user: userId }).populate(
      "products.product"
    );

    if (!wishlist) {
      return NextResponse.json(
        {
          message: "Wishlist not found",
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Wishlist fetched successfully",
      success: true,
      wishlist,
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      {
        message: "Error fetching wishlist",
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
    const productId = url.searchParams.get("productId");
    // const { userId, productId } = await request.json();

    if (!userId || !productId) {
      return NextResponse.json(
        {
          message: "User ID and Product ID are required",
          success: false,
        },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if the wishlist exists for the user
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return NextResponse.json(
        {
          message: "Wishlist not found",
          success: false,
        },
        { status: 404 }
      );
    }

    // Remove the product from the wishlist
    wishlist.products = wishlist.products.filter(
      (item) => item.product.toString() !== productId
    );

    await wishlist.save();

    return NextResponse.json({
      message: "Product removed from wishlist successfully",
      success: true,
      wishlist,
    });
  } catch (error) {
    console.error("Error removing product from wishlist:", error);
    return NextResponse.json(
      {
        message: "Error removing product from wishlist",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
