import { NextRequest, NextResponse } from "next/server";
import { newsService } from "@/services/news-service";

// GET - Lấy danh sách news với pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const lang = searchParams.get("lang") || "vi";

    const { data, total } = await newsService.getNewsList(page, limit, lang);

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("GET /api/admin/news error:", errorMessage);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}

// POST - Tạo bài viết mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const createdNews = await newsService.createNews(body);

    return NextResponse.json({
      success: true,
      data: createdNews,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("POST /api/admin/news error:", errorMessage);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
