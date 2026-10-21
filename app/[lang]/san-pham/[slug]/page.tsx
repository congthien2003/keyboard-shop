import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { productService } from "@/services/product-service";
import { ProductDetail } from "./components/ProductDetail";
import { SITE_URL } from "@/data/company-info";
import type { Locale } from "@/lib/types";
const getProduct = cache((slug:string) => productService.getProductBySlug(slug));
type Props = {params:Promise<{lang:Locale;slug:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata> {
 const {lang,slug}=await params; const product=await getProduct(slug);
 if(!product) return {title:lang==="vi"?"Không tìm thấy sản phẩm":"Product not found"};
 const tr=product.translates.find(t=>t.lang===lang)||product.translates[0];
 return {title:tr?.name,description:tr?.description,alternates:{canonical:`${SITE_URL}/${lang}/san-pham/${slug}`},openGraph:{title:tr?.name,description:tr?.description,images:[product.thumbnail||"/images/mechkey/keyboard.svg"]}};
}
export default async function ProductDetailPage({params}:Props) {
 const {lang,slug}=await params; const product=await getProduct(slug); if(!product)notFound();
 const all=await productService.getAllProducts();
 const related=all.filter(p=>p.categoryId===product.categoryId && p.id!==product.id).slice(0,4);
 const tr=product.translates.find(t=>t.lang===lang)||product.translates[0];
 const data={"@context":"https://schema.org","@type":"Product",name:tr?.name,description:tr?.description,image:product.thumbnail||`${SITE_URL}/images/mechkey/keyboard.svg`,sku:product.slug,...(product.brand?{brand:{"@type":"Brand",name:product.brand}}:{}),...(product.status!==1?{offers:{"@type":"Offer",url:`${SITE_URL}/${lang}/san-pham/${slug}`,priceCurrency:lang==="vi"?"VND":"USD",price:tr?.price||0,availability:product.status===3?"https://schema.org/InStock":"https://schema.org/OutOfStock"}}:{})};
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,"\\u003c")}}/><div className="min-h-screen bg-background py-12"><ProductDetail product={product} lang={lang} relatedProducts={related}/></div></>;
}
