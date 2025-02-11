import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/dbConnect";
import bcrypt from "bcrypt";
import Seller from "@/Modals/Seller";

export async function POST(request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { message: "Token and new password are required", success: false },
        { status: 400 }
      );
    }

    await dbConnect();

    const seller = await Seller.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!seller) {
      return NextResponse.json(
        { message: "Invalid or expired token", success: false },
        { status: 400 }
      );
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    seller.password = hashedPassword;
    seller.resetPasswordToken = undefined;
    seller.resetPasswordExpiry = undefined;
    await seller.save();

    return NextResponse.json(
      { message: "Password reset successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { message: "Failed to reset password", success: false, error: error.message },
      { status: 500 }
    );
  }
}