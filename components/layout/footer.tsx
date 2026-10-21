import Link from "next/link";
import { COMPANY_INFO } from "@/data/company-info";
import type { Locale } from "@/lib/i18n-server";
export function Footer({ lang }: { lang: Locale }) {
  const vi = lang === "vi";
  return <footer className="border-t border-border bg-card"><div className="sb-container grid gap-10 py-16 md:grid-cols-3">
    <div><Link href={`/${lang}`} className="sb-logo">SB-MechKey<span className="text-primary">.</span></Link><p className="mt-5 max-w-xs text-sm leading-7 text-muted-foreground">{vi ? "Góc bàn của bạn. Cá tính của bạn. Khám phá bàn phím và linh kiện cho từng cảm giác gõ." : "Your desk. Your character. Explore keyboards and components for your kind of typing."}</p></div>
    <div><h2 className="mb-5 font-semibold">{vi ? "Khám phá" : "Explore"}</h2><div className="grid gap-3 text-sm text-muted-foreground">{[["san-pham", vi ? "Keyboard & phụ kiện" : "Keyboards & accessories"], ["gioi-thieu", vi ? "Về SB-MechKey" : "About SB-MechKey"], ["tin-tuc", vi ? "Góc bàn phím" : "Keyboard journal"], ["lien-he", vi ? "Liên hệ" : "Contact"]].map(([url, label]) => <Link key={url} href={`/${lang}/${url}`}>{label}</Link>)}</div></div>
    <div><h2 className="mb-5 font-semibold">{vi ? "Hỗ trợ" : "Support"}</h2><div className="grid gap-3 text-sm text-muted-foreground">{[["huong-dan-dat-hang", vi ? "Hướng dẫn đặt hàng" : "How to order"], ["giao-hang", vi ? "Giao hàng" : "Shipping"], ["bao-mat", vi ? "Bảo mật" : "Privacy"]].map(([url, label]) => <Link key={url} href={`/${lang}/chinh-sach/${url}`}>{label}</Link>)}{COMPANY_INFO.contact.phone && <a href={`tel:${COMPANY_INFO.contact.phone}`}>{COMPANY_INFO.contact.phone}</a>}{COMPANY_INFO.contact.email && <a href={`mailto:${COMPANY_INFO.contact.email}`}>{COMPANY_INFO.contact.email}</a>}{COMPANY_INFO.office.address[lang] && <p>{COMPANY_INFO.office.address[lang]}</p>}</div></div>
  </div><div className="sb-container flex flex-wrap justify-between gap-3 border-t border-border py-6 text-xs text-muted-foreground"><span>© {new Date().getFullYear()} SB-MechKey</span><span className="font-mono">MAKE EVERY KEYSTROKE YOURS.</span></div></footer>;
}
