import dbConnect from "@/lib/db/dbConnect";
import Product from "@/Modals/Product";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await dbConnect();

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // Extract sorting parameters
    const sortField = url.searchParams.get("sortField") || "createdAt";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";

    // Extract filter parameters
    const minPrice = parseInt(url.searchParams.get("minPrice")) || 0;
    const maxPrice = parseInt(url.searchParams.get("maxPrice")) || Infinity;
    const color = url.searchParams.get("color");
    const size = url.searchParams.get("size");
    const category = url.searchParams.get("category");
    const subCategory = url.searchParams.get("subCategory");

    // Build the filter object
    const filter = {};
    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      filter.price = { $gte: minPrice, $lte: maxPrice };
    } else if (!isNaN(minPrice)) {
      filter.price = { $gte: minPrice };
    } else if (!isNaN(maxPrice)) {
      filter.price = { $lte: maxPrice };
    }
    if (color) filter["variants.color"] = color;
    if (size) filter["variants.sizes"] = { $in: [size] }; // Check if the size is included in the sizes array
    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;

    // Determine the sort object based on the sortField and sortOrder
    let sort = {};
    if (sortField === "price") {
      sort = { price: sortOrder === "asc" ? 1 : -1 };
    } else if (sortField === "title") {
      sort = { title: sortOrder === "asc" ? 1 : -1 };
    } else {
      sort = { [sortField]: sortOrder === "asc" ? 1 : -1 };
    }

    // Fetch products with pagination, sorting, and filtering
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate({
        path: "seller",
        select: "name _id",
      })
      .exec();

    // Count total documents for pagination metadata
    const totalProducts = await Product.countDocuments(filter);

    return NextResponse.json({
      message: "Fetched successfully",
      success: true,
      products,
      pagination: {
        totalProducts,
        page,
        totalPages: Math.ceil(totalProducts / limit),
      },
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
