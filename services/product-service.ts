import { Product, ProductStatus, ProductTranslate } from "@/types/product";
import { generateSlug } from "@/lib/slug";
import { prisma } from "@/lib/prisma";

export type ProductResponse = Product & {
  translates: ProductTranslate[];
};

export type CreateProductInput = {
  thumbnail: string;
  image: string[]; // gallery urls
  status: ProductStatus;
  slug?: string;
  categoryId: string;
  viewCount: number;
  rating: number;
  translates: Array<
    Pick<
      ProductTranslate,
      | "lang"
      | "name"
      | "description"
      | "info"
      | "weight"
      | "unit"
      | "price"
      | "originalPrice"
      | "fromCountry"
    >
  >;
};

export type UpdateProductInput = Partial<CreateProductInput>;

class ProductService {
  // Generate slug from text, with fallback to empty string
  private generateSlugFromText(text: string): string {
    if (!text || text.trim() === "") return "";
    return generateSlug(text);
  }

  // Parse image JSON string to array
  private parseImage(image: string): string[] {
    try {
      return JSON.parse(image || "[]");
    } catch {
      return [];
    }
  }

  // Convert image array to JSON string
  private stringifyImage(image: string[]): string {
    return JSON.stringify(image || []);
  }

  async createProduct(input: CreateProductInput): Promise<ProductResponse> {
    // Determine product-level slug
    const nameForProductSlug =
      input.translates.find((t) => t.lang === "vi")?.name ||
      input.translates[0]?.name ||
      "";
    const productSlug =
      input.slug && input.slug.trim()
        ? input.slug
        : this.generateSlugFromText(nameForProductSlug);

    console.log({ input });

    const created = await prisma.product.create({
      data: {
        thumbnail: input.thumbnail,
        image: this.stringifyImage(input.image),
        status: input.status,
        slug: productSlug,
        categoryId: input.categoryId,
        viewCount: input.viewCount,
        rating: input.rating,
        translates: {
          create: input.translates,
        },
      },
      include: {
        translates: true,
      },
    });

    return {
      ...created,
      image: this.parseImage(created.image),
    };
  }

  async getProducts(
    page?: number,
    pageSize?: number,
  ): Promise<ProductResponse[]> {
    const products =
      page && pageSize
        ? await prisma.product.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            include: {
              translates: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          })
        : await prisma.product.findMany({
            include: {
              translates: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          });

    return products.map((p: any) => ({
      ...p,
      image: this.parseImage(p.image),
    }));
  }

  async getProductById(id: string): Promise<ProductResponse | null> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        translates: true,
      },
    });

    if (!product) return null;

    return {
      ...product,
      image: this.parseImage(product.image),
    };
  }

  async getProductBySlug(slug: string): Promise<ProductResponse | null> {
    const product = await prisma.product.findFirst({
      where: { slug },
      include: {
        translates: true,
      },
    });

    if (!product) return null;

    product.viewCount++;
    await prisma.product.update({
      where: { id: product.id },
      data: { viewCount: product.viewCount },
    });

    return {
      ...product,
      image: this.parseImage(product.image),
    };
  }

  async updateProduct(
    id: string,
    input: UpdateProductInput,
  ): Promise<ProductResponse> {
    // Prepare base data
    const baseData: any = {};
    if (input.thumbnail !== undefined) baseData.thumbnail = input.thumbnail;
    if (input.image !== undefined)
      baseData.image = this.stringifyImage(input.image);
    if (input.status !== undefined) baseData.status = input.status;
    if (input.categoryId !== undefined) baseData.categoryId = input.categoryId;
    if (input.slug !== undefined) baseData.slug = input.slug;
    if (input.viewCount !== undefined) baseData.viewCount = input.viewCount;
    if (input.rating !== undefined) baseData.rating = input.rating;
    // Update base fields
    const updated = await prisma.product.update({
      where: { id },
      data: baseData,
      include: {
        translates: true,
      },
    });

    // Update translates if provided
    if (input.translates && Array.isArray(input.translates)) {
      for (const tr of input.translates) {
        await prisma.productTranslate.upsert({
          where: { productId_lang: { productId: id, lang: tr.lang } },
          create: { ...tr, productId: id },
          update: { ...tr },
        });
      }
    }

    // Fetch updated product with translates
    const withTranslates = await prisma.product.findUnique({
      where: { id },
      include: {
        translates: true,
      },
    });

    if (!withTranslates) {
      throw new Error("Product not found after update");
    }

    return {
      ...withTranslates,
      image: this.parseImage(withTranslates.image),
    };
  }

  async deleteProduct(id: string): Promise<void> {
    await prisma.product.delete({
      where: { id },
    });
  }

  async getAllProducts(): Promise<ProductResponse[]> {
    const products = await prisma.product.findMany({
      include: {
        translates: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return products.map((p: any) => ({
      ...p,
      image: this.parseImage(p.image),
    }));
  }
}

// Export singleton instance
export const productService = new ProductService();
