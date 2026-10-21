import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { categoryService } from "@/services/category-service";
import { ProductCard } from "@/components/common/product-card";
import { CatalogFilters } from "./components/catalog-filters";
import type { Locale } from "@/lib/i18n-server";
import type { Prisma } from "@prisma/client";
export const metadata = { title: "Keyboard & accessories" };
type Query = { q?: string; category?: string; brand?: string; layout?: string; connectivity?: string; sort?: string; page?: string };
export default async function ProductsPage({ params, searchParams }: { params: Promise<{ lang: Locale }>; searchParams: Promise<Query> }) {
 const [{ lang }, raw] = await Promise.all([params, searchParams]); const vi = lang === "vi";
 const query: Query = Object.fromEntries(Object.entries(raw).filter(([,v]) => typeof v === "string"));
 const categories = await categoryService.getAllCategories();
 const selected = categories.find(c => c.id === query.category || c.translates.some(t => t.slug === query.category));
 const where: Prisma.ProductWhereInput = {
  ...(query.category ? { categoryId: selected?.id || "00000000-0000-0000-0000-000000000000" } : {}),
  ...(query.q?.trim() ? { translates: { some: { name: { contains: query.q.trim(), mode: "insensitive" } } } } : {}),
  ...(query.brand ? { brand: query.brand } : {}), ...(query.layout ? { layout: query.layout } : {}),
  ...(query.connectivity ? { connectivity: { has: query.connectivity } } : {}),
 };
 const [rows, facets] = await Promise.all([prisma.product.findMany({ where, include: { translates: true }, orderBy: [{ createdAt: "desc" }, { id: "asc" }] }), prisma.product.findMany({ select: { brand: true, layout: true, connectivity: true } })]);
 if (query.sort === "price-asc" || query.sort === "price-desc") rows.sort((a,b) => { const price = (p: typeof a) => (p.translates.find(t => t.lang === lang) || p.translates[0])?.price || 0; return (price(a)-price(b)) * (query.sort === "price-desc" ? -1 : 1); });
 const totalPages = Math.max(1, Math.ceil(rows.length/12));
 const requested = Number(query.page); const page = Math.min(totalPages, Number.isSafeInteger(requested) && requested > 0 ? requested : 1);
 const products = rows.slice((page-1)*12,page*12).map(p => { let images: string[] = []; try { const parsed = JSON.parse(p.image); if (Array.isArray(parsed)) images = parsed.filter((v): v is string => typeof v === "string"); } catch {} return { ...p, image: images }; });
 const href = (n: number) => { const qs = new URLSearchParams(Object.entries(query).filter(([k,v]) => k !== "page" && !!v) as [string,string][]); qs.set("page",String(n)); return `/${lang}/san-pham?${qs}`; };
 return <div className="sb-container py-12 md:py-16"><p className="sb-kicker mb-4">THE COLLECTION / SB-MECHKEY</p><h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-6xl">{vi ? "Chọn phím. Chọn chất." : "Find your next keystroke."}</h1><p className="mb-10 max-w-2xl text-muted-foreground">{vi ? "Bàn phím, linh kiện và những mảnh ghép cho góc bàn của bạn." : "Keyboards, components and the finishing touches for your desk."}</p>
 <CatalogFilters lang={lang} categories={categories.map(c => ({ value: c.translates.find(t => t.lang === lang)?.slug || c.id, label: (c.translates.find(t => t.lang === lang) || c.translates[0])?.name || c.id }))} brands={[...new Set(facets.map(p => p.brand).filter((x): x is string => !!x))].sort()} layouts={[...new Set(facets.map(p => p.layout).filter((x): x is string => !!x))].sort()} connections={[...new Set(facets.flatMap(p => p.connectivity))].sort()}/>
 <div className="my-6 flex justify-between text-sm text-muted-foreground"><span>{rows.length} {vi ? "sản phẩm" : "products"}</span><span>{vi ? "Trang" : "Page"} {page} / {totalPages}</span></div>
 <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{products.map(p => <ProductCard key={p.id} product={p} lang={lang}/>)}</div>
 {!products.length && <div className="storefront-card py-20 text-center"><h2 className="text-xl font-semibold">{vi ? "Chưa tìm thấy sản phẩm" : "No products found"}</h2><p className="my-4 text-muted-foreground">{vi ? "Thử từ khóa hoặc bộ lọc khác." : "Try a different search or filter."}</p><Link className="sb-button-outline" href={`/${lang}/san-pham`}>{vi ? "Xóa bộ lọc" : "Clear filters"}</Link></div>}
 {totalPages > 1 && <nav aria-label={vi ? "Phân trang" : "Pagination"} className="mt-10 flex items-center justify-center gap-5">{page > 1 && <Link className="sb-button-outline" href={href(page-1)}>{vi ? "Trước" : "Previous"}</Link>}<span>{page} / {totalPages}</span>{page < totalPages && <Link className="sb-button-outline" href={href(page+1)}>{vi ? "Tiếp" : "Next"}</Link>}</nav>}
 </div>;
}
