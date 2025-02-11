import dbConnect from "@/lib/db/dbConnect";
import Seller from "@/Modals/Seller";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        {
          message: "Invalid token",
          success: false,
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const seller = await Seller.findOne({ emailVerifyToken: token });

    if (!seller) {
      return NextResponse.json(
        {
          message: "Invalid or expired token",
          success: false,
        },
        { status: 400 }
      );
    }

    // Check if the token has expired
    if (seller.emailVerifyTokenExpiry < Date.now()) {
      return NextResponse.json(
        {
          message:
            "Token has expired. Please request a new verification email.",
          success: false,
        },
        { status: 400 }
      );
    }

    // Verify the seller
    seller.isVerified = true;
    seller.emailVerifyToken = undefined;
    seller.emailVerifyTokenExpiry = undefined;

    await seller.save();

    return NextResponse.json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json(
      {
        message: "Some error occurred",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
