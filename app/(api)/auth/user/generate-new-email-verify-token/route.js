import dbConnect from "@/lib/db/dbConnect";
import User from "@/Modals/User";
import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    await dbConnect();
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { message: "email is required to generate new token", success: false },
        { status: 400 }
      );
    }

    const findUser = await User.findOne({ email });
    if (!findUser) {
      return NextResponse.json(
        { message: "User not exists or invalid email address", success: false },
        { status: 400 }
      );
    }

    // Generate email verification token
    const array = new Uint32Array(8);
    crypto.getRandomValues(array);
    const emailVerifyToken = Array.from(array, (dec) => dec.toString(16)).join(
      ""
    );
    const emailVerifyTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes in milliseconds

    findUser.emailVerifyToken = emailVerifyToken;
    findUser.emailVerifyTokenExpiry = emailVerifyTokenExpiry;
    await findUser.save();

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${emailVerifyToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email",
      html: `<p>Please verify your email by clicking the following link: <a href="${verifyUrl}">Verify Email</a></p>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        message: "New token generated successfully...",
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("some error occured:", error.message);
    return NextResponse.json(
      {
        message: "Internal server error",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
