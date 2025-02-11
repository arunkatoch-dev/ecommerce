import dbConnect from "@/lib/db/dbConnect";
import User from "@/Modals/User";
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

    const user = await User.findOne({ emailVerifyToken: token });

    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid or expired token",
          success: false,
        },
        { status: 400 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json({
        message: "Email already verified",
        success: true,
      });
    }

    // Check if the token has expired
    if (user.emailVerifyTokenExpiry < Date.now()) {
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
    user.isVerified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyTokenExpiry = undefined;

    await user.save();

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
