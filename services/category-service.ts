import { CategoryResponse, CategoryTranslateModel } from "@/types/category";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/slug";

class CategoryService {
  // Generate slug from text, with fallback to empty string
  private generateSlugFromText(text: string): string {
    if (!text || text.trim() === "") return "";
    return generateSlug(text);
  }

  async createCategory(
    categoryTranslate: CategoryTranslateModel,
  ): Promise<CategoryResponse> {
    // Auto-generate slugs from names if not provided
    const slugVi = this.generateSlugFromText(categoryTranslate.nameVi);
    const slugEn = this.generateSlugFromText(categoryTranslate.nameEn);

    return prisma.category.create({
      data: {
        translates: {
          create: [
            {
              lang: "vi",
              name: categoryTranslate.nameVi,
              description: categoryTranslate.descriptionVi,
              slug: slugVi,
            },
            {
              lang: "en",
              name: categoryTranslate.nameEn,
              description: categoryTranslate.descriptionEn,
              slug: slugEn,
            },
          ],
        },
      },
      include: {
        translates: true,
      },
    });
  }

  async getCategories(
    page: number,
    pageSize: number,
  ): Promise<CategoryResponse[]> {
    return prisma.category.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        translates: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async updateCategory(
    id: string,
    categoryTranslate: CategoryTranslateModel,
  ): Promise<CategoryResponse> {
    // Auto-generate slugs from names if not provided
    const slugVi =
      categoryTranslate.nameVi ||
      this.generateSlugFromText(categoryTranslate.nameVi);
    const slugEn =
      categoryTranslate.nameEn ||
      this.generateSlugFromText(categoryTranslate.nameEn);

    // Delete existing translates and create new ones
    await prisma.categoryTranslate.deleteMany({
      where: { categoryId: id },
    });

    return prisma.category.update({
      where: { id },
      data: {
        translates: {
          create: [
            {
              lang: "vi",
              name: categoryTranslate.nameVi,
              description: categoryTranslate.descriptionVi,
              slug: slugVi,
            },
            {
              lang: "en",
              name: categoryTranslate.nameEn,
              description: categoryTranslate.descriptionEn,
              slug: slugEn,
            },
          ],
        },
      },
      include: {
        translates: true,
      },
    });
  }

  async deleteCategory(id: string): Promise<void> {
    await prisma.category.delete({
      where: { id },
    });
  }

  async getAllCategories(): Promise<CategoryResponse[]> {
    return prisma.category.findMany({
      include: {
        translates: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

// Export singleton instance
export const categoryService = new CategoryService();
