import dbConnect from "@/lib/db/dbConnect";
import Orders from "@/Modals/Orders";
import Product from "@/Modals/Product";
import Rating from "@/Modals/Rating";
import { NextResponse } from "next/server";

// POST: Create a new rating
export async function POST(req) {
  try {
    const { productId, userId, rating, review } = await req.json();
    if (!(productId && userId && rating)) {
      return NextResponse.json(
        { message: "necessary fields are missing.", success: false },
        { status: 404 }
      );
    }
    await dbConnect();
    const alreadyRated = await Rating.findOne({ productId, userId });
    if (alreadyRated) {
      return NextResponse.json(
        {
          message:
            "Already reviewed! You can only update or delete your review.",
          success: false,
        },
        { status: 400 }
      );
    }
    // Check if the product has been ordered by the user
    const isProductOrdered = await Orders.findOne({
      userId: userId,
      "items.product": productId,
      status: "delivered",
    });

    console.log(isProductOrdered);
    if (!isProductOrdered) {
      return NextResponse.json(
        {
          message:
            "Either you don't buy this product or your product is not delivered yet. Wait for your product delivery to review",
          success: false,
        },
        { status: 400 }
      );
    }

    const newRating = new Rating({
      productId,
      userId,
      rating,
      review,
    });
    await newRating.save();
    const findRating = await Rating.find({ productId });
    console.log("findRating", findRating);
    const averageRating =
      findRating && findRating.length > 0
        ? findRating.reduce(
            (acc, productReview) => acc + productReview.rating,
            0
          ) / findRating.length
        : 0;
    console.log("averageRating", averageRating);
    await Product.findByIdAndUpdate(productId, { rating: averageRating });
    return NextResponse.json(
      { newRating, success: true, message: "Review submitted" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to create rating",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const productId = url.searchParams.get("productId");
    if (!productId) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    await dbConnect();
    const rating = await Rating.find({ productId })
      .populate({
        path: "productId",
        select: "_id",
      })
      .populate({
        path: "userId",
        select: "email",
      });
    if (!rating) {
      return NextResponse.json({ error: "Rating not found" }, { status: 404 });
    }

    return NextResponse.json(rating, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch rating",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
