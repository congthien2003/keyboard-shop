import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * PUT /api/news/[slug]/like
 * Public API to increment like count for a news article by slug
 * This increments the like count by 1 each time it's called
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

    // Atomically update the like count, handling null values
    const updatedNews = await prisma.$transaction(async (tx) => {
      // Ensure the count is not null
      await tx.news.updateMany({
        where: { id: news.id, likeCount: null },
        data: { likeCount: 0 },
      });

      // Increment the count
      return tx.news.update({
        where: { id: news.id },
        data: { likeCount: { increment: 1 } },
      });
    });

    return NextResponse.json({
      success: true,
      data: {
        likeCount: updatedNews.likeCount || 0,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Failed to increment like count" },
      { status: 500 },
    );
  }
}
