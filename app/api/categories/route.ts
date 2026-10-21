import { NextRequest, NextResponse } from "next/server";
import { categoryService } from "@/services/category-service";
import { CategoryTranslateModel } from "@/types/category";

export async function POST(request: NextRequest) {
  try {
    const body: CategoryTranslateModel = await request.json();

    // Validate required fields (description is optional, but keeping for backward compatibility)
    if (!body.nameVi || !body.nameEn) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          message: "nameVi and nameEn are required",
        },
        { status: 400 },
      );
    }

    // Ensure description fields exist (can be empty strings)
    const categoryData: CategoryTranslateModel = {
      nameVi: body.nameVi.trim(),
      nameEn: body.nameEn.trim(),
      descriptionVi: body.descriptionVi || "",
      descriptionEn: body.descriptionEn || "",
      // Slugs will be auto-generated in service if not provided
    };

    const category = await categoryService.createCategory(categoryData);

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

    // Validate pagination params
    if (page < 1 || pageSize < 1) {
      return NextResponse.json(
        {
          error: "Invalid pagination parameters",
          message: "page and pageSize must be positive integers",
        },
        { status: 400 },
      );
    }

    const categories = await categoryService.getCategories(page, pageSize);

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
