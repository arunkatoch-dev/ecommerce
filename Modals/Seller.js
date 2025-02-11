import mongoose from "mongoose";
import "@/Modals/Product";
// Seller Schema
const SellerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"], // Email validation
    },
    phone: {
      type: String,
      unique: true,
      default: "",
      match: [/^\+?\d{10,15}$/, "Please provide a valid phone number"], // Validates phone number
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      zipCode: { type: String, default: "" },
      country: { type: String, default: "" },
    },
    profileImage: {
      type: String, // URL to the profile image
      default: "",
    },
    businessName: {
      type: String,
      unique: true,
      default: "",
    },
    businessLicenseNumber: {
      type: String,
      unique: true,
      default: "",
    },
    ratings: {
      averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      totalReviews: {
        type: Number,
        default: 0,
      },
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Reference to Product model
      },
    ],
    bankDetails: {
      accountHolderName: { type: String, default: "" },
      accountNumber: { type: String, default: "" },
      bankName: { type: String, default: "" },
      ifscCode: { type: String, default: "" },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
    emailVerifyToken: String,
    emailVerifyTokenExpiry: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

// Export the Seller model
export default mongoose.models.Seller || mongoose.model("Seller", SellerSchema);
