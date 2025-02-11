import dbConnect from "@/lib/db/dbConnect";
import Address from "@/Modals/Address";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const {
      userId,
      name,
      phone,
      email,
      city,
      state,
      postalCode,
      country,
      street,
    } = await request.json();

    // Validate required fields
    if (
      !userId ||
      !name ||
      !phone ||
      !email ||
      !city ||
      !state ||
      !postalCode ||
      !country ||
      !street
    ) {
      return NextResponse.json(
        {
          message: "Invalid request. Required fields are missing",
          success: false,
        },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if the same address already exists
    const existingAddress = await Address.findOne({
      userId,
      name,
      phone,
      email,
      city,
      state,
      postalCode,
      country,
      street,
    });

    if (existingAddress) {
      return NextResponse.json(
        {
          message: "Same address already exists.",
          success: false,
        },
        { status: 400 }
      );
    }

    const newAddress = new Address({
      userId,
      name,
      phone,
      email,
      city,
      state,
      postalCode,
      country,
      street,
    });

    await newAddress.save();

    return NextResponse.json({
      message: "Address Added.",
      success: true,
      address: newAddress,
    });
  } catch (error) {
    console.error("Error in user profile:", error);
    return NextResponse.json(
      {
        message: "User Profile error",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required", success: false },
        { status: 400 }
      );
    }

    await dbConnect();
    const addresses = await Address.find({ userId });
    return NextResponse.json({
      message: "User Profile fetched successfully...",
      success: true,
      addresses,
    });
  } catch (error) {
    console.error("Error in user profile:", error);
    return NextResponse.json(
      {
        message: "User Profile error",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const addressId = url.searchParams.get("addressId");

    if (!addressId) {
      return NextResponse.json(
        { message: "Address ID is required", success: false },
        { status: 400 }
      );
    }

    await dbConnect();
    const deletedAddress = await Address.findByIdAndDelete(addressId);

    if (!deletedAddress) {
      return NextResponse.json(
        { message: "Address not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Address deleted successfully.",
      success: true,
      address: deletedAddress,
    });
  } catch (error) {
    console.error("Error in user profile:", error);
    return NextResponse.json(
      {
        message: "User Profile error",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
