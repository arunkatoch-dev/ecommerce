import dbConnect from "@/lib/db/dbConnect";
import Rating from "@/Modals/Rating";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const productId = url.searchParams.get("productId");
    const userId = url.searchParams.get("userId");
    if (!productId || !userId) {
      return NextResponse.json(
        { message: "Product Id and user Id not found", success: false },
        { status: 404 }
      );
    }
    await dbConnect();
    const rating = await Rating.findOne({ productId, userId })
      .populate({
        path: "productId",
        select: "_id",
      })
      .populate({
        path: "userId",
        select: "email",
      });
    if (!rating) {
      return NextResponse.json(
        { message: "Rating not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({ rating, success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch rating",
        success: false,
        error,
      },
      { status: 500 }
    );
  }
}

// PATCH: Update a rating
export async function PATCH(req) {
  try {
    const url = new URL(req.url);
    const ratingId = url.searchParams.get("ratingId");
    const { rating, review } = await req.json();
    if (!ratingId || !rating) {
      return NextResponse.json(
        { message: "Rating Id and rating are required", success: false },
        { status: 400 }
      );
    }
    await dbConnect();
    const updatedRating = await Rating.findByIdAndUpdate(
      ratingId,
      { rating, review },
      { new: true }
    );
    if (!updatedRating) {
      return NextResponse.json(
        { message: "Rating not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({ updatedRating, success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to update rating",
        success: false,
        error,
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete a rating
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const ratingId = url.searchParams.get("ratingId");
    if (!ratingId) {
      return NextResponse.json(
        { message: "Rating Id is required", success: false },
        { status: 400 }
      );
    }
    await dbConnect();
    const deletedRating = await Rating.findByIdAndDelete(ratingId);
    if (!deletedRating) {
      return NextResponse.json(
        { message: "Rating not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Rating deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to delete rating",
        success: false,
        error,
      },
      { status: 500 }
    );
  }
}
