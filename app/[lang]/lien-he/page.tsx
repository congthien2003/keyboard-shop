import { ContactSection } from "@/components/home-page/contact-section";
import type { Locale } from "@/lib/i18n-server";
export const metadata = { title: "Contact SB-MechKey" };
export default async function ContactPage({params}:{params:Promise<{lang:Locale}>}) {
 const {lang}=await params;
 return <><div className="sb-container pt-16"><p className="sb-kicker">LET’S TALK KEYBOARDS</p><h1 className="mt-4 text-4xl font-extrabold md:text-6xl">{lang==="vi"?"Tìm bàn phím đúng gu.":"Let’s find your fit."}</h1></div><ContactSection lang={lang}/></>;
}
