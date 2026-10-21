import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/news
 * Public API to get list of published news articles
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 10)
 * - lang: "vi" | "en" (default: "vi")
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const lang = searchParams.get("lang") || "vi";

    // Validate pagination params
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { success: false, error: "Invalid pagination parameters" },
        { status: 400 },
      );
    }

    // Calculate skip
    const skip = (page - 1) * limit;

    // Get total count of published news
    const total = await prisma.news.count({
      where: { published: true },
    });

    // Get news list with translations
    const newsList = await prisma.news.findMany({
      where: { published: true },
      include: {
        translates: {
          where: { lang },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    // Format response
    const formattedNews = newsList.map((news) => {
      const translate = news.translates[0];

      // Parse tags from JSON string
      let tags: string[] = [];
      try {
        tags = translate?.tags ? JSON.parse(translate.tags) : [];
      } catch {
        tags = [];
      }

      return {
        id: news.id,
        slug: news.slug,
        image: news.image,
        published: news.published,
        timeReading: news.timeReading,
        viewCount: news.viewCount || 0,
        likeCount: news.likeCount || 0,
        createdAt: news.createdAt.toISOString(),
        updatedAt: news.updatedAt?.toISOString() || null,
        // Translation fields
        title: translate?.title || "",
        excerpt: translate?.excerpt || "",
        content: translate?.content || "",
        tags,
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedNews,
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
    return NextResponse.json(
      { success: false, error: "Failed to fetch news list" },
      { status: 500 },
    );
  }
}
