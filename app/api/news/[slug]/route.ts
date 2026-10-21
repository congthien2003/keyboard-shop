import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/news/[slug]
 * Public API to get a single published news article by its slug.
 * Note: This API does NOT increment the view count. Use PUT /api/news/[slug]/view to increment views.
 * Query params:
 * - lang: "vi" | "en" (default: "vi")
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const searchParams = request.nextUrl.searchParams;
    const lang = searchParams.get("lang") || "vi";

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Slug is required" },
        { status: 400 },
      );
    }

    // Fetch the news article without incrementing the view count
    const news = await prisma.news.findUnique({
      where: { slug, published: true },
      include: {
        // Fetch both translations to have a fallback
        translates: true,
      },
    });

    if (!news) {
      return NextResponse.json(
        { success: false, error: "News article not found" },
        { status: 404 },
      );
    }

    // Find the correct translation, with 'vi' as a fallback
    const viTranslate = news.translates.find((t) => t.lang === "vi");
    const enTranslate = news.translates.find((t) => t.lang === "en");

    // Helper to parse tags
    const parseTags = (tags: string | null): string[] => {
      try {
        return tags ? JSON.parse(tags) : [];
      } catch {
        return [];
      }
    };

    // Format the response, providing both languages
    const formattedNews = {
      id: news.id,
      slug: news.slug,
      image: news.image,
      published: news.published,
      timeReading: news.timeReading,
      viewCount: news.viewCount || 0, // Return actual value from database
      likeCount: news.likeCount || 0,
      createdAt: news.createdAt.toISOString(),
      updatedAt: news.updatedAt?.toISOString() || null,
      // Vietnamese fields
      titleVi: viTranslate?.title || "",
      excerptVi: viTranslate?.excerpt || "",
      contentVi: viTranslate?.content || "",
      tagsVi: parseTags(viTranslate?.tags || null),
      // English fields
      titleEn: enTranslate?.title || "",
      excerptEn: enTranslate?.excerpt || "",
      contentEn: enTranslate?.content || "",
      tagsEn: parseTags(enTranslate?.tags || null),
    };

    return NextResponse.json({ success: true, data: formattedNews });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Failed to fetch news article" },
      { status: 500 },
    );
  }
}
