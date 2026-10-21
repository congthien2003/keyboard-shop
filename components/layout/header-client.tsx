"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, Search, ArrowUpRight } from "lucide-react";
import { getCart } from "@/lib/cart";
import { LanguageSwitcher } from "@/components/common/language-switcher";
export function HeaderClient({ lang, categories }: { lang: "vi" | "en"; categories: { id: string; name: string; slug: string }[] }) {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const pathname = usePathname();
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const update = () => setCount(getCart().reduce((sum, item) => sum + item.quantity, 0));
    update(); window.addEventListener("cartUpdated", update); window.addEventListener("storage", update);
    return () => { window.removeEventListener("cartUpdated", update); window.removeEventListener("storage", update); };
  }, []);
  const vi = lang === "vi";
  return <header className="sb-header">
    <a className="sr-only focus:not-sr-only" href="#main-content">{vi ? "Đến nội dung" : "Skip to content"}</a>
    <div className="sb-topline"><span>BUILT FOR YOUR NEXT KEYSTROKE.</span><Link href={`/${lang}/gioi-thieu`}>{vi ? "Khám phá SB-MechKey" : "Meet SB-MechKey"} <ArrowUpRight size={12} /></Link></div>
    <div className="sb-container sb-header-main">
      <Link className="sb-logo" href={`/${lang}`} aria-label="SB-MechKey home"><span className="sb-logo-key">SB</span><span>MechKey<span className="text-primary">.</span></span></Link>
      <form action={`/${lang}/san-pham`} className="sb-search hidden md:flex"><Search size={18}/><input name="q" aria-label={vi ? "Tìm sản phẩm" : "Search products"} placeholder={vi ? "Tìm bàn phím, switch, keycap..." : "Search keyboards, switches, keycaps..."}/><button type="submit" aria-label={vi ? "Tìm kiếm" : "Search"}>↵</button></form>
      <div className="flex items-center gap-4"><LanguageSwitcher lang={lang} /><Link className="relative p-2" href={`/${lang}/gio-hang`} aria-label={`${vi ? "Giỏ hàng" : "Cart"}: ${count}`}><ShoppingBag size={23}/>{count > 0 && <span className="sb-cart-count">{count}</span>}</Link><button className="md:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="shop-navigation" aria-label={vi ? "Menu điều hướng" : "Navigation menu"}>{open ? <X/> : <Menu/>}</button></div>
    </div>
    <nav id="shop-navigation" className={`${open ? "block" : "hidden"} border-t border-border md:block`}>
      <div className="sb-container flex flex-col gap-4 py-4 md:flex-row md:items-center md:gap-6 md:overflow-x-auto">
        <Link className="whitespace-nowrap text-sm font-semibold text-primary" href={`/${lang}/san-pham`}>{vi ? "Tất cả sản phẩm" : "All products"}</Link>
        {categories.map(c => <Link onClick={() => setOpen(false)} className="whitespace-nowrap text-sm text-muted-foreground hover:text-white" key={c.id} href={`/${lang}/san-pham?category=${encodeURIComponent(c.slug)}`}>{c.name}</Link>)}
        <form action={`/${lang}/san-pham`} className="sb-search md:hidden"><input name="q" aria-label={vi ? "Tìm sản phẩm" : "Search products"} placeholder={vi ? "Tìm sản phẩm..." : "Search products..."}/><button type="submit"><Search size={18}/></button></form>
      </div>
    </nav>
  </header>;
}
