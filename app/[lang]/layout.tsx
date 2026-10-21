import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingContact } from "@/components/common/floating-contact";
import type { Locale } from "@/lib/i18n-server";
export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return <div className="storefront"><Header lang={lang} /><main id="main-content">{children}</main><Footer lang={lang} /><FloatingContact /></div>;
}
