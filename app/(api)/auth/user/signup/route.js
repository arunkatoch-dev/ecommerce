import dbConnect from "@/lib/db/dbConnect";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import crypto from "crypto";
import User from "@/Modals/User";

export async function POST(request) {
  try {
    await dbConnect();

    const { email, password, confirmPassword } = await request.json();

    // Validate input
    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { message: "All fields are required", success: false },
        { status: 400 }
      );
    }
    // Password validation (must match frontend)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          message:
            "Password must be 8-12 chars, include 1 special char, 1 lowercase, 1 uppercase, and numbers.",
          success: false,
        },
        { status: 400 }
      );
    }
    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          message: "Password and confirm Password didn't match",
          success: false,
        },
        { status: 400 }
      );
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists", success: false },
        { status: 400 }
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate email verification token
    const array = new Uint32Array(8);
    crypto.getRandomValues(array);
    const emailVerifyToken = Array.from(array, (dec) => dec.toString(16)).join(
      ""
    );
    const emailVerifyTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes in milliseconds
    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
      emailVerifyToken,
      emailVerifyTokenExpiry,
      isVerified: false,
    });

    await newUser.save();

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
        message:
          "User registered successfully. Please check your email to verify your account.",
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      {
        message: "Error registering user",
        success: false,
      },
      { status: 500 }
    );
  }
}
