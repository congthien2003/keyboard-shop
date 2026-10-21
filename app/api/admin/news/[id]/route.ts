import { NextRequest, NextResponse } from "next/server";
import { newsService } from "@/services/news-service";

// GET - Lấy chi tiết một bài viết
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const news = await newsService.getNewsById(id);
    if (!news) {
      return NextResponse.json(
        { success: false, error: "News not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}

// PUT - Cập nhật bài viết
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updatedNews = await newsService.updateNews(id, body);
    return NextResponse.json({ success: true, data: updatedNews });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}

// DELETE - Xóa bài viết
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await newsService.deleteNews(id);
    return NextResponse.json({
      success: true,
      message: "News deleted successfully",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
