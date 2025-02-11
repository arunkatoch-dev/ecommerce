import dbConnect from "@/lib/db/dbConnect";
import Category from "@/Modals/Category";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      name,
      slug,
      description,
      image,
      parentCategory,
      subCategories,
      isActive,
    } = data;
    if (!name) {
      return NextResponse.json({
        message: "failed",
        success: false,
        error: "Required fields are missing",
      });
    }
    const createSlug = name.toLowerCase();
    await dbConnect();
    const category = new Category({
      name,
      slug: createSlug,
      description,
      image,
      parentCategory,
      subCategories,
      isActive,
    });
    await category.save();
    return NextResponse.json({
      message: "success",
      success: true,
      category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({
      message: "failed",
      success: false,
      error: error.message,
    });
  }
}

export async function GET() {
  try {
    await dbConnect();

    const categories = await Category.find().populate("parentCategory");

    return NextResponse.json({
      message: "success",
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({
      message: "failed",
      success: false,
      error: error.message,
    });
  }
}

// PATCH: Update a category
export async function PATCH(request) {
  try {
    const url = new URL(request.url);
    const categoryId = url.searchParams.get("currentCategoryId");
    const data = await request.json();
    const {
      name,
      slug,
      description,
      image,
      parentCategory,
      subCategories,
      isActive,
    } = data;

    if (!categoryId) {
      return NextResponse.json({
        message: "failed",
        success: false,
        error: "Category ID is required",
      });
    }

    await dbConnect();

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      {
        name,
        slug: slug || name.toLowerCase(),
        description,
        image,
        parentCategory,
        subCategories,
        isActive,
      },
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json({
        message: "failed",
        success: false,
        error: "Category not found",
      });
    }

    return NextResponse.json({
      message: "success",
      success: true,
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({
      message: "failed",
      success: false,
      error: error.message,
    });
  }
}
