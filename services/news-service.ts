import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/slug";
import type { News, NewsTranslate } from "@prisma/client";

// ====================
// TYPES
// ====================

export type NewsResponse = News & {
  translates: NewsTranslate[];
};

export type CreateNewsInput = {
  image?: string;
  published?: boolean;
  slug?: string;
  timeReading?: number;
  authorId?: string | null;
  categoryId?: string | null;
  // Vietnamese translation (required)
  titleVi: string;
  excerptVi?: string;
  contentVi: string;
  tagsVi?: string[];
  // English translation (optional)
  titleEn?: string;
  excerptEn?: string;
  contentEn?: string;
  tagsEn?: string[];
};

export type UpdateNewsInput = Partial<CreateNewsInput>;

class NewsService {
  // ====================
  // HELPER METHODS
  // ====================

  private generateSlugFromText(text: string): string {
    if (!text || text.trim() === "") return "";
    return generateSlug(text);
  }

  private stringifyTags(tags: string[] = []): string {
    return JSON.stringify(tags);
  }

  private parseTags(tags: string | null): string[] {
    try {
      return tags ? JSON.parse(tags) : [];
    } catch {
      return [];
    }
  }

  /**
   * Check if HTML content is empty (only tags, no text)
   */
  private isHtmlEmpty(html: string | null | undefined): boolean {
    if (!html || !html.trim()) return true;
    // Remove all HTML tags and check if there's any text content
    const textContent = html.replace(/<[^>]*>/g, "").trim();
    return textContent.length === 0;
  }

  // ====================
  // CRUD OPERATIONS
  // ====================

  async createNews(input: CreateNewsInput): Promise<NewsResponse> {
    const {
      titleVi,
      excerptVi,
      contentVi,
      tagsVi,
      titleEn,
      excerptEn,
      contentEn,
      tagsEn,
      slug: inputSlug,
      ...newsData
    } = input;

    // 1. Validate required fields
    if (!titleVi || !contentVi) {
      throw new Error("Title and content in Vietnamese are required");
    }

    // 2. Use provided slug or generate from titleVi
    const slug = inputSlug?.trim() || this.generateSlugFromText(titleVi);
    if (!slug) {
      throw new Error("Slug is required");
    }

    // 3. Check if slug already exists
    const existingNews = await prisma.news.findUnique({ where: { slug } });
    if (existingNews) {
      throw new Error("A news article with this slug already exists");
    }

    // 4. Prepare translations
    const translates = [
      {
        lang: "vi",
        title: titleVi,
        excerpt: excerptVi || "",
        content: contentVi,
        tags: this.stringifyTags(tagsVi),
      },
    ];
    if (titleEn && contentEn) {
      translates.push({
        lang: "en",
        title: titleEn,
        excerpt: excerptEn || "",
        content: contentEn,
        tags: this.stringifyTags(tagsEn),
      });
    }

    // 5. Create news record
    const created = await prisma.news.create({
      data: {
        ...newsData,
        slug,
        image: newsData.image || "/placeholder.webp",
        translates: {
          create: translates,
        },
      },
      include: {
        translates: true,
      },
    });

    return created;
  }

  async getNewsList(
    page: number = 1,
    limit: number = 10,
    lang: string = "vi",
  ): Promise<{ data: any[]; total: number }> {
    const skip = (page - 1) * limit;
    const total = await prisma.news.count();

    const news = await prisma.news.findMany({
      include: {
        translates: { where: { lang } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    const formattedNews = news.map((item) => {
      const translate = item.translates[0];
      return {
        ...item,
        title: translate?.title || "",
        excerpt: translate?.excerpt || "",
        content: translate?.content || "",
        tags: this.parseTags(translate?.tags || null),
        translates: undefined, // Remove raw translates
      };
    });

    return { data: formattedNews, total };
  }

  async getNewsBySlug(slug: string): Promise<any | null> {
    const news = await prisma.news.findUnique({
      where: { slug },
      include: { translates: true },
    });

    if (!news) return null;

    const viTranslate = news.translates.find((t) => t.lang === "vi");
    const enTranslate = news.translates.find((t) => t.lang === "en");

    return {
      ...news,
      titleVi: viTranslate?.title || "",
      excerptVi: viTranslate?.excerpt || "",
      contentVi: viTranslate?.content || "",
      tagsVi: this.parseTags(viTranslate?.tags || null),
      titleEn: enTranslate?.title || "",
      excerptEn: enTranslate?.excerpt || "",
      contentEn: enTranslate?.content || "",
      tagsEn: this.parseTags(enTranslate?.tags || null),
      translates: undefined,
    };
  }

  async getNewsById(id: string): Promise<any | null> {
    const news = await prisma.news.findUnique({
      where: { id },
      include: { translates: true },
    });

    if (!news) return null;

    const viTranslate = news.translates.find((t) => t.lang === "vi");
    const enTranslate = news.translates.find((t) => t.lang === "en");

    return {
      ...news,
      titleVi: viTranslate?.title || "",
      excerptVi: viTranslate?.excerpt || "",
      contentVi: viTranslate?.content || "",
      tagsVi: this.parseTags(viTranslate?.tags || null),
      titleEn: enTranslate?.title || "",
      excerptEn: enTranslate?.excerpt || "",
      contentEn: enTranslate?.content || "",
      tagsEn: this.parseTags(enTranslate?.tags || null),
      translates: undefined,
    };
  }

  async updateNews(id: string, input: UpdateNewsInput): Promise<NewsResponse> {
    const {
      titleVi,
      excerptVi,
      contentVi,
      tagsVi,
      titleEn,
      excerptEn,
      contentEn,
      tagsEn,
      slug: inputSlug,
      ...newsData
    } = input;

    // 1. Check if news exists
    const existingNews = await prisma.news.findUnique({ where: { id } });
    if (!existingNews) {
      throw new Error("News not found");
    }

    // 2. Handle slug update
    let newSlug = existingNews.slug;

    // If slug is explicitly provided, use it
    if (inputSlug !== undefined) {
      const trimmedSlug = inputSlug.trim();
      if (trimmedSlug && trimmedSlug !== existingNews.slug) {
        // Check if new slug already exists
        const slugExists = await prisma.news.findUnique({
          where: { slug: trimmedSlug },
        });
        if (slugExists && slugExists.id !== id) {
          throw new Error("A news article with this slug already exists");
        }
        newSlug = trimmedSlug;
      } else if (!trimmedSlug) {
        throw new Error("Slug cannot be empty");
      }
    }
    // Otherwise, if titleVi changed, auto-generate new slug
    else if (titleVi && titleVi.trim() !== "") {
      const generatedSlug = this.generateSlugFromText(titleVi);
      if (generatedSlug && generatedSlug !== existingNews.slug) {
        const slugExists = await prisma.news.findUnique({
          where: { slug: generatedSlug },
        });
        if (slugExists && slugExists.id !== id) {
          throw new Error("A news article with this title already exists");
        }
        newSlug = generatedSlug;
      }
    }

    // 3. Update news data
    await prisma.news.update({
      where: { id },
      data: { ...newsData, slug: newSlug },
    });

    // 4. Update Vietnamese translation (update whatever is provided, even if empty)
    if (
      titleVi !== undefined ||
      contentVi !== undefined ||
      excerptVi !== undefined ||
      tagsVi !== undefined
    ) {
      await prisma.newsTranslate.upsert({
        where: { newsId_lang: { newsId: id, lang: "vi" } },
        update: {
          title: titleVi?.trim() || "",
          excerpt: excerptVi?.trim() || "",
          content: contentVi?.trim() || "",
          tags: this.stringifyTags(tagsVi || []),
        },
        create: {
          newsId: id,
          lang: "vi",
          title: titleVi?.trim() || "",
          excerpt: excerptVi?.trim() || "",
          content: contentVi?.trim() || "",
          tags: this.stringifyTags(tagsVi || []),
        },
      });
    }

    // 5. Update English translation (update whatever is provided, even if empty)
    if (
      titleEn !== undefined ||
      contentEn !== undefined ||
      excerptEn !== undefined ||
      tagsEn !== undefined
    ) {
      await prisma.newsTranslate.upsert({
        where: { newsId_lang: { newsId: id, lang: "en" } },
        update: {
          title: titleEn?.trim() || "",
          excerpt: excerptEn?.trim() || "",
          content: contentEn?.trim() || "",
          tags: this.stringifyTags(tagsEn || []),
        },
        create: {
          newsId: id,
          lang: "en",
          title: titleEn?.trim() || "",
          excerpt: excerptEn?.trim() || "",
          content: contentEn?.trim() || "",
          tags: this.stringifyTags(tagsEn || []),
        },
      });
    }

    return (await prisma.news.findUnique({
      where: { id },
      include: { translates: true },
    }))!;
  }

  async deleteNews(id: string): Promise<void> {
    const existingNews = await prisma.news.findUnique({ where: { id } });
    if (!existingNews) {
      throw new Error("News not found");
    }
    await prisma.news.delete({ where: { id } });
  }

  /**
   * Increment view count for a news article by slug
   */
  async incrementViewBySlug(slug: string): Promise<number> {
    const news = await prisma.news.findUnique({
      where: { slug, published: true },
    });

    if (!news) {
      throw new Error("News not found");
    }

    const updatedNews = await prisma.news.update({
      where: { id: news.id },
      data: { viewCount: { increment: 1 } },
    });

    return updatedNews.viewCount || 0;
  }

  /**
   * Increment like count for a news article by slug
   */
  async incrementLikeBySlug(slug: string): Promise<number> {
    const news = await prisma.news.findUnique({
      where: { slug, published: true },
    });

    if (!news) {
      throw new Error("News not found");
    }

    const updatedNews = await prisma.news.update({
      where: { id: news.id },
      data: { likeCount: { increment: 1 } },
    });

    return updatedNews.likeCount || 0;
  }

  /**
   * Get related news articles (excluding current article)
   */
  async getRelatedNews(currentSlug: string, limit: number = 3): Promise<any[]> {
    const news = await prisma.news.findMany({
      where: {
        published: true,
        slug: { not: currentSlug },
      },
      include: { translates: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return news.map((item: any) => {
      const viTranslate = item.translates.find((t: any) => t.lang === "vi");
      const enTranslate = item.translates.find((t: any) => t.lang === "en");

      return {
        ...item,
        titleVi: viTranslate?.title || "",
        excerptVi: viTranslate?.excerpt || "",
        contentVi: viTranslate?.content || "",
        tagsVi: this.parseTags(viTranslate?.tags || null),
        titleEn: enTranslate?.title || "",
        excerptEn: enTranslate?.excerpt || "",
        contentEn: enTranslate?.content || "",
        tagsEn: this.parseTags(enTranslate?.tags || null),
        // For display purposes, set title based on primary language (vi)
        title: viTranslate?.title || "",
        excerpt: viTranslate?.excerpt || "",
        content: viTranslate?.content || "",
        tags: this.parseTags(viTranslate?.tags || null),
        translates: undefined,
      };
    });
  }
}

// Export singleton instance
export const newsService = new NewsService();
