import { redirect } from "next/navigation";
import { Metadata } from "next";
import { COMPANY_INFO } from "@/data/company-info";

const baseUrl = `https://${COMPANY_INFO.contact.website}`;

// Metadata for root page (before redirect)
export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "FreshFruit - Trái Cây Tươi Ngon | Sỉ/Lẻ",
  description:
    "FreshFruit - Nhà cung cấp sỉ/lẻ trái cây nội địa chất lượng cao đáng tin cậy. Chuyên cung cấp trái cây tươi ngon cho đại lý, cửa hàng và doanh nghiệp.",
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
