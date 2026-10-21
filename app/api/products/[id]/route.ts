import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function parseImage(json: string) {
  try {
    return JSON.parse(json || "[]");
  } catch {
    return [] as string[];
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { translates: true },
    });
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(
      { ...product, image: parseImage(product.image) },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Update base fields
    const updated = await prisma.product.update({
      where: { id },
      data: {
        thumbnail: body.thumbnail,
        image: JSON.stringify(body.image || []),
        status: body.status,
        slug: body.slug || "",
        viewCount: body.viewCount || 0,
        rating: body.rating || 0,
        categoryId: body.categoryId,
      },
      include: { translates: true },
    });

    // Upsert translates if provided
    if (Array.isArray(body.translates)) {
      for (const tr of body.translates as any[]) {
        await prisma.productTranslate.upsert({
          where: { productId_lang: { productId: id, lang: tr.lang } },
          create: { ...tr, productId: id },
          update: { ...tr },
        });
      }
    }

    const withTranslates = await prisma.product.findUnique({
      where: { id },
      include: { translates: true },
    });

    return NextResponse.json(
      { ...withTranslates!, image: parseImage(withTranslates!.image) },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
