import dbConnect from "@/lib/db/dbConnect";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/Modals/User";

export async function GET(request) {
  try {
    const cookiesData = await cookies();
    const requestedToken = cookiesData.get("user_auth_token")?.value;
    // Verify the token
    let verifiedToken;
    try {
      verifiedToken = jwt.verify(requestedToken, process.env.JWT_SECRET);
    } catch (error) {
      console.error("Invalid token:", error.message);
      return NextResponse.json(
        {
          message:
            "Invalid login token found! Try logging In again after some time.",
          success: false,
        },
        { status: 401 }
      );
    }

    const { id, email } = verifiedToken;

    // Connect to the database
    await dbConnect();

    // Find the seller and populate products and their categories
    const user = await User.findOne({ _id: id, email }).select("-password");
    //   .populate({
    //     path: "products",
    //     populate: {
    //       path: "category",
    //       model: "Category",
    //     },
    //   });

    if (!user) {
      console.log("User not found for ID:", id, "and email:", email);
      return NextResponse.json(
        { message: "No user found.", success: false },
        { status: 401 }
      );
    }

    // Return user details
    return NextResponse.json({
      message: "success",
      user,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching user details:", error.stack);

    const errorMessage =
      error.name === "JsonWebTokenError"
        ? "Invalid token. Please log in again."
        : "Internal server error";

    return NextResponse.json(
      {
        message: errorMessage,
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
