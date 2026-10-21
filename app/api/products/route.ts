import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/products - return all products with translates
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { translates: true },
    });

    const mapped = products.map((p) => ({
      ...p,
      image: (() => {
        try {
          return JSON.parse(p.image || "[]");
        } catch {
          return [] as string[];
        }
      })(),
    }));

    return NextResponse.json(mapped, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/products - create product with translates
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Expecting CreateProductInput shape from hooks/useProduct
    const created = await prisma.product.create({
      data: {
        thumbnail: body.thumbnail,
        image: JSON.stringify(body.image || []),
        status: body.status,
        slug: body.slug || "",
        categoryId: body.categoryId,
        viewCount: body.viewCount || 0,
        rating: body.rating || 0,
        translates: {
          create: (Array.isArray(body.translates)
            ? body.translates
            : []) as any,
        },
      },
      include: { translates: true },
    });

    const mapped = {
      ...created,
      image: (() => {
        try {
          return JSON.parse(created.image || "[]");
        } catch {
          return [] as string[];
        }
      })(),
    };

    return NextResponse.json(mapped, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
