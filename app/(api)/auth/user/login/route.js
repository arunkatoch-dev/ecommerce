import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/dbConnect";
import User from "@/Modals/User";

export async function POST(request) {
  try {
    const data = await request.json();
    const { email, password } = data;
    if (!(email && password)) {
      return NextResponse.json(
        {
          message: "Email and password are required",
          success: false,
        },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          message: "user not found",
          success: false,
        },
        { status: 404 }
      );
    }
    if (!user.isVerified) {
      return NextResponse.json(
        {
          message: "Please verify your email first",
          success: false,
        },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          message: "Invalid Email or Password",
          success: false,
        },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    const response = NextResponse.json({
      message: "Logged In Success",
      success: true,
      id: user._id,
      email: user.email,
    });

    response.cookies.set("user_auth_token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error logging in user:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
