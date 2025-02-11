import Product from "@/Modals/Product";
import dbConnect from "@/lib/db/dbConnect";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request) {
  try {
    await dbConnect();

    const url = new URL(request.url);
    const _id = url.searchParams.get("productId");

    if (!_id) {
      return NextResponse.json(
        { message: "Product ID is required", success: false },
        { status: 400 }
      );
    }

    const product = await Product.findOne({ _id }).populate("category");

    if (!product) {
      return NextResponse.json(
        { message: "No product found.", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "success",
      product,
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    return NextResponse.json(
      {
        message: "Error fetching product details",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    await dbConnect();

    const url = new URL(request.url);
    const productId = url.searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required", success: false },
        { status: 400 }
      );
    }

    const formData = await request.json();
    console.log("Received formData:", formData);

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      formData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { message: "Product not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Product updated successfully",
        success: true,
        product: updatedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      {
        message: "Error updating product",
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
    const productId = url.searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        {
          message: "Product ID is required",
          success: false,
        },
        { status: 400 }
      );
    }

    await dbConnect();
    const product = await Product.findById({ _id: productId });

    if (!product) {
      return NextResponse.json(
        {
          message: "Product not found",
          success: false,
        },
        { status: 404 }
      );
    }

    // Delete images from Cloudinary
    const imageDeletionPromises = product.variants.flatMap((variant) =>
      variant.images.map((image) =>
        cloudinary.uploader.destroy(image.public_id)
      )
    );
    await Promise.all(imageDeletionPromises);

    // Delete the product from the database
    await Product.findOneAndDelete({ _id: productId });

    return NextResponse.json(
      {
        message: "Product deleted successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      {
        message: "Error deleting product",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
