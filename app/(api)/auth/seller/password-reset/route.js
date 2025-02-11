import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/dbConnect";
import crypto from "crypto";
import nodemailer from "nodemailer";
import Seller from "@/Modals/Seller";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required", success: false },
        { status: 400 }
      );
    }

    await dbConnect();

    const seller = await Seller.findOne({ email });

    if (!seller) {
      return NextResponse.json(
        { message: "Seller not found", success: false },
        { status: 404 }
      );
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    seller.resetPasswordToken = resetToken;
    seller.resetPasswordExpiry = resetTokenExpiry;
    await seller.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/seller/reset-password?token=${resetToken}`;

    // Send reset token to user's email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: seller.email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Please use the following link to reset your password: ${resetUrl}`,
      html: `<p>You requested a password reset. Please use the following link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Password reset token sent to email", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return NextResponse.json(
      {
        message: "Failed to request password reset",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
