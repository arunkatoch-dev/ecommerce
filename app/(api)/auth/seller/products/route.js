import dbConnect from "@/lib/db/dbConnect";
import Product from "@/Modals/Product";
import Seller from "@/Modals/Seller";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();
    const formData = await request.json();
    const { seller } = formData;
    if (!seller) {
      return NextResponse.json(
        {
          message: "Seller Id not found",
          success: false,
        },
        { status: 401 }
      );
    }

    const findSeller = await Seller.findOne({ _id: seller });
    if (!findSeller) {
      return NextResponse.json(
        {
          message: "Seller not found",
          success: false,
        },
        { status: 401 }
      );
    }

    const product = await new Product({
      ...formData,
    });

    await product.save();

    return NextResponse.json(
      { message: "Product added successfully", success: true, product },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { message: "Error adding product", success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await dbConnect();

    const url = new URL(request.url);
    const sellerId = url.searchParams.get("sellerId");

    if (!sellerId) {
      return NextResponse.json(
        { message: "Seller ID is required", success: false },
        { status: 400 }
      );
    }

    const products = await Product.find({ seller: sellerId }).populate(
      "category"
    );

    if (!products) {
      console.log("products not found for ID:", sellerId);
      return NextResponse.json(
        { message: "No products found.", success: false },
        { status: 404 }
      );
    }

    // Return seller details with products
    return NextResponse.json({
      message: "success",
      products,
    });
  } catch (error) {
    console.error("Error fetching seller details:", error);
    return NextResponse.json(
      {
        message: "Error fetching seller details",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

