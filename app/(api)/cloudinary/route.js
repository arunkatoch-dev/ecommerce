import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const publicId = url.searchParams.get("public_id");

    if (!publicId) {
      return NextResponse.json(
        { message: "Public ID is required", success: false },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      return NextResponse.json(
        { message: "Failed to delete image", success: false },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Image deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { message: "Error deleting image", success: false, error: error.message },
      { status: 500 }
    );
  }
}
