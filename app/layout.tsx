import type { Metadata } from "next";
import { Be_Vietnam_Pro, Roboto_Mono } from "next/font/google";
import { I18nProvider } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { SITE_URL } from "@/data/company-info";
import "./globals.css";

const sans = Be_Vietnam_Pro({ subsets: ["latin", "vietnamese"], weight: ["400", "500", "600", "700", "800"], variable: "--font-sb-sans", display: "swap" });
const mono = Roboto_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-sb-mono", display: "swap" });
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL), title: { default: "SB-MechKey | Mechanical keyboards & accessories", template: "%s | SB-MechKey" },
  description: "Mechanical keyboards, custom kits, switches and keycaps. Find your next daily driver at SB-MechKey.",
  icons: { icon: "/images/mechkey/logo.svg" },
  openGraph: { siteName: "SB-MechKey", images: ["/images/mechkey/keyboard.svg"] },
};
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return <html lang={locale} className="dark"><body className={`${sans.variable} ${mono.variable} font-sans`}><I18nProvider>{children}</I18nProvider></body></html>;
}
