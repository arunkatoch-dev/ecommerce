import Seller from "@/Modals/Seller";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
// import crypto from "crypto";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/dbConnect";

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, password } = data;

    if (!(name && email && password)) {
      return NextResponse.json(
        {
          message: "Required Fields are missing",
          success: false,
        },
        { status: 401 }
      );
    }

    await dbConnect();

    const findSeller = await Seller.findOne({ email });
    if (findSeller) {
      return NextResponse.json(
        {
          message: "Seller with same Id already exists.",
          success: false,
        },
        { status: 400 }
      );
    }
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Generate email verification token

    const array = new Uint32Array(8);
    crypto.getRandomValues(array);
    const emailVerifyToken = Array.from(array, (dec) => dec.toString(16)).join(
      ""
    );
    const emailVerifyTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes in milliseconds

    // const emailVerifyToken = crypto.randomBytes(32).toString("hex");
    // const emailVerifyTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes in milliseconds
    const seller = new Seller({
      name,
      email,
      password: hashedPassword,
      emailVerifyToken,
      emailVerifyTokenExpiry,
      isVerified: false,
    });

    await seller.save();

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verifyUrl = `${process.env.FRONTEND_URL}/seller/verify-email?token=${emailVerifyToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email Address",
      html: `
        <p>Hello ${name},</p>
        <p>Thank you for signing up as a seller. Please verify your email address by clicking the link below:</p>
        <a href="${verifyUrl}" target="_blank">${verifyUrl}</a>
        <p>This link will expire in 10 minutes. If you did not sign up, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        message: "Seller Sign Up successfully. Please verify your email.",
        success: true,
        seller: { name, email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating seller:", error);
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
