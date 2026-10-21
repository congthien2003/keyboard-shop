import { redirect } from "next/navigation";
import { Metadata } from "next";
import { COMPANY_INFO, SITE_URL } from "@/data/company-info";

const baseUrl = SITE_URL;

// Metadata for root page (before redirect)
export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "SB-MechKey - Bàn Phím & Phụ Kiện | Sỉ/Lẻ",
  description:
    "SB-MechKey - Nhà cung cấp sỉ/lẻ bàn phím cơ chất lượng cao đáng tin cậy. Chuyên cung cấp bàn phím cơ ngon cho đại lý, cửa hàng và doanh nghiệp.",
  alternates: {
    languages: {
      vi: `${baseUrl}/vi`,
      en: `${baseUrl}/en`,
      "x-default": `${baseUrl}/vi`,
    },
  },
};

// Redirect root path to default locale (vi)
// This is a fallback in case middleware doesn't catch it
export default function RootPage() {
  redirect("/vi");
}
