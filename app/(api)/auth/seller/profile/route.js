import dbConnect from "@/lib/db/dbConnect";
import Seller from "@/Modals/Seller";
import { NextResponse } from "next/server";

export async function PATCH(request) {
  try {
    const data = await request.json();
    const {
      _id,
      email,
      street,
      city,
      state,
      zipCode,
      country,
      accountHolderName,
      accountNumber,
      bankName,
      ifscCode,
      ...updateData
    } = data;

    // Validate input data
    if (!_id || !email) {
      return NextResponse.json(
        {
          message: "Invalid input data",
          success: false,
        },
        { status: 400 }
      );
    }

    // Connect to the database
    await dbConnect();

    // Find and update the seller
    const sellerUpdates = {
      ...updateData,
      address: {
        street,
        city,
        state,
        zipCode,
        country,
      },
      bankDetails: { accountHolderName, accountNumber, bankName, ifscCode },
    };

    const seller = await Seller.findOneAndUpdate(
      { _id, email },
      { $set: sellerUpdates },
      { new: true }
    ).select("-password");

    if (!seller) {
      return NextResponse.json(
        {
          message: "No Seller found with this id",
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Profile Updated",
        success: true,
        seller,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error.message);
    return NextResponse.json(
      {
        message: "Error updating profile",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
