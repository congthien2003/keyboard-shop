"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Plus, Check } from "lucide-react";
import { ProductImage } from "./product-image";
import type { ProductResponse } from "@/services/product-service";
import { formatUsd, formatVnd } from "@/lib/formatAmount";
import { addToCart } from "@/lib/cart";
import type { Locale } from "@/lib/types";
export function ProductCard({ product, lang, onAddToCart }: { product: ProductResponse; lang: Locale; showNewBadge?: boolean; onAddToCart?: (product: ProductResponse) => void }) {
 const [added,setAdded] = useState(false); const vi=lang==="vi";
 const tr=product.translates.find(t=>t.lang===lang)||product.translates[0];
 const en=product.translates.find(t=>t.lang==="en"); const vn=product.translates.find(t=>t.lang==="vi");
 const add=()=>{if(product.status!==3)return;addToCart({id:product.id,name:en?.name||tr?.name||"",nameVi:vn?.name||tr?.name||"",price:en?.price||0,priceVND:vn?.price||0,image:product.thumbnail,unit:en?.unit,unitVi:vn?.unit,quantity:1});setAdded(true);onAddToCart?.(product);};
 return <article className="storefront-card storefront-card-interactive flex flex-col overflow-hidden"><Link href={`/${lang}/san-pham/${product.slug}`} className="sb-product-image relative block overflow-hidden"><ProductImage src={product.thumbnail} alt={tr?.name||""} width={600} height={450} className="aspect-[4/3] w-full transition-transform duration-300 hover:scale-105"/>{product.status===2 && <span className="absolute left-3 top-3 rounded bg-background/90 px-3 py-1 text-xs">{vi?"Hết hàng":"Sold out"}</span>}</Link><div className="flex flex-1 flex-col p-5"><p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{product.brand||"SB-MECHKEY"}</p><Link href={`/${lang}/san-pham/${product.slug}`} className="mb-3 text-lg font-bold hover:text-primary">{tr?.name}</Link><p className="mb-6 min-h-5 font-mono text-xs text-muted-foreground">{[product.layout,product.switchType,...(product.connectivity||[])].filter(Boolean).join(" / ")}</p><div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-4"><span className="text-lg font-bold">{product.status===1 ? (vi?"Liên hệ":"Contact") : vi?formatVnd(tr?.price||0):formatUsd(tr?.price||0)}</span>{product.status===3 ? <button className="flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-white" onClick={add} aria-label={`${vi?"Thêm vào giỏ":"Add to cart"}: ${tr?.name}`}>{added?<Check size={16}/>:<Plus size={16}/>}<span>{vi?"Thêm":"Add"}</span></button> : product.status===1 ? <Link href={`/${lang}/lien-he`} aria-label={vi?"Liên hệ":"Contact"} className="rounded-md border p-2"><ArrowUpRight size={18}/></Link> : <span className="text-xs text-muted-foreground">{vi?"Tạm hết":"Unavailable"}</span>}</div><span className="sr-only" role="status">{added?(vi?"Đã thêm vào giỏ hàng":"Added to cart"):""}</span></div></article>;
}
