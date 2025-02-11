import dbConnect from "@/lib/db/dbConnect";
import Product from "@/Modals/Product";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({
        message: "failed",
        error: "id is missing",
      });
    }
    await dbConnect();

    const product = await Product.findOne({ _id: id })
      .populate({
        path: "category",
        select: "name slug parentCategory",
        populate: {
          path: "parentCategory",
          select: "name slug",
          populate: {
            path: "parentCategory",
            select: "name slug",
          },
        },
      })
      .populate("seller", "name email")
      .exec();

    return NextResponse.json({
      message: "success",
      product,
    });
  } catch (error) {
    console.error("Error getting Product:", error);
    return NextResponse.json({
      message: "failed",
      error: error.message,
    });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({
        message: "failed",
        error: "_id is missing",
      });
    }
    await dbConnect();
    const deleteProduct = await Product.findByIdAndDelete({ _id: id });
    return NextResponse.json({
      message: "success",
      deleteProduct,
    });
  } catch (error) {
    console.error("Error getting Product:", error);
    return NextResponse.json({
      message: "failed",
      error: error.message,
    });
  }
}
