import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/dbConnect";
import Product from "@/Modals/Product";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("query");

    if (!query) {
      return NextResponse.json(
        {
          message: "Query is required",
          success: false,
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const products = await Product.find({
      title: { $regex: query, $options: "i" },
    }).select("title");

    return NextResponse.json({
      message: "Products fetched successfully.",
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        message: "Error fetching products",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
