import { MetadataRoute } from "next";
import { COMPANY_INFO } from "@/data/company-info";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = `https://${COMPANY_INFO.contact.website}`;

  return {
    rules: [
      // Cho phép Googlebot index toàn bộ
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      // Cho phép Facebook crawler đọc trang để tạo preview
      {
        userAgent: "facebookexternalhit",
        allow: "/",
      },
      {
        userAgent: "Facebot",
        allow: "/",
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
