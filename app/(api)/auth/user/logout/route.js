import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const cookiesData = await cookies();
    cookiesData.delete("user_auth_token");
    return NextResponse.json(
      {
        message: "User logged out successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error logging out user:", error.message);
    return NextResponse.json(
      {
        message: "Error logging out user",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
