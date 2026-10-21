import { NextRequest, NextResponse } from "next/server";
import { categoryService } from "@/services/category-service";
import { CategoryTranslateModel } from "@/types/category";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body: CategoryTranslateModel = await request.json();

    // Validate required fields
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

    const category = await categoryService.updateCategory(id, categoryData);

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await categoryService.deleteCategory(id);

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
