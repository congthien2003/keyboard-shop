import { categoryService } from "@/services/category-service";
import { HeaderClient } from "./header-client";
export async function Header({ lang }: { lang: "vi" | "en" }) {
  const categories = await categoryService.getAllCategories();
  return <HeaderClient lang={lang} categories={categories.map(c => { const t = c.translates.find(t => t.lang === lang) || c.translates[0]; return { id: c.id, name: t?.name || "", slug: t?.slug || c.id }; })} />;
}
