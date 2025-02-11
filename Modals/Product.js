import mongoose from "mongoose";
import "@/Modals/Category";
import "@/Modals/Seller";

// Variant Schema
const VariantSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
  },
  sizes: {
    type: [String],
    required: true,
  },
  images: [
    {
      url: String,
      public_id: String,
    },
  ],
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  sku: {
    type: String,
    unique: true, // Ensure uniqueness
  },
});

// Product Schema
const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    productDetails: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    variants: {
      type: [VariantSchema], // Array of variants
      validate: {
        validator: function (variants) {
          const skuSet = new Set();
          return variants.every((variant) => {
            if (variant.sku && skuSet.has(variant.sku)) {
              return false; // Duplicate SKU found
            }
            if (variant.sku) skuSet.add(variant.sku);
            return true;
          });
        },
        message: "Variants contain duplicate SKU values.",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
