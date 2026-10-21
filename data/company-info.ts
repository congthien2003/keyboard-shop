export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
export const COMPANY_INFO = {
  name: { vi: "SB-MechKey", en: "SB-MechKey" }, shortName: "SB-MechKey",
  taxCode: "", agencyTaxCode: "", operationDate: "",
  office: { address: { vi: process.env.NEXT_PUBLIC_SHOP_ADDRESS || "", en: process.env.NEXT_PUBLIC_SHOP_ADDRESS || "" } },
  branch: { name: { vi: "SB-MechKey", en: "SB-MechKey" }, address: { vi: "", en: "" } },
  contact: {
    phone: process.env.NEXT_PUBLIC_SHOP_PHONE || "", phoneFormatted: process.env.NEXT_PUBLIC_SHOP_PHONE || "",
    email: process.env.NEXT_PUBLIC_SHOP_EMAIL || "", zalo: process.env.NEXT_PUBLIC_SHOP_ZALO || "",
    facebook: process.env.NEXT_PUBLIC_SHOP_FACEBOOK || "", website: new URL(SITE_URL).host,
  },
} as const;
