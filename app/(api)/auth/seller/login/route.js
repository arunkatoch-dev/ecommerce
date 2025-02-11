import Seller from "@/Modals/Seller";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/dbConnect";

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

    // Find seller by email
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return NextResponse.json(
        {
          message: "Seller not found",
          success: false,
        },
        { status: 404 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, seller.password);
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
      { id: seller._id, email: seller.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Token will be valid for 7 days
    );
    const response = NextResponse.json({
      message: "Logged In Success",
      success: true,
      id: seller._id,
      email: seller.email,
    });

    response.cookies.set("seller_auth_token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error logging in seller:", error);
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
