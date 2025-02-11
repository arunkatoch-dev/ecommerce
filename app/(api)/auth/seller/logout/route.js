import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const cookiesData = await cookies();
    cookiesData.delete("seller_auth_token");
    return NextResponse.json(
      {
        message: "Seller logged out successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error logging out seller:", error.message);
    return NextResponse.json(
      {
        message: "Error logging out seller",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
