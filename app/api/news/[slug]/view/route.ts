import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * PUT /api/news/[slug]/view
 * Public API to increment view count for a news article by slug
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Slug is required" },
        { status: 400 },
      );
    }

    // Find the news article
    const news = await prisma.news.findUnique({
      where: { slug, published: true },
    });

    if (!news) {
      return NextResponse.json(
        { success: false, error: "News article not found" },
        { status: 404 },
      );
    }

    // Atomically update the view count, handling null values
    const updatedNews = await prisma.$transaction(async (tx) => {
      // Ensure the count is not null
      await tx.news.updateMany({
        where: { id: news.id, viewCount: null },
        data: { viewCount: 0 },
      });

      // Increment the count
      return tx.news.update({
        where: { id: news.id },
        data: { viewCount: { increment: 1 } },
      });
    });

    return NextResponse.json({
      success: true,
      data: {
        viewCount: updatedNews.viewCount || 0,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Failed to increment view count" },
      { status: 500 },
    );
  }
}
