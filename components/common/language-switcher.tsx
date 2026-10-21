"use client";
import { Globe } from "lucide-react";
import type { Locale } from "@/lib/types";
export function LanguageSwitcher({lang}:{lang:Locale}) {
 const target=lang==="vi"?"en":"vi";
 return <button type="button" aria-label={lang==="vi"?"Switch to English":"Chuyển sang tiếng Việt"} onClick={()=>{document.cookie=`locale=${target};path=/;max-age=31536000;SameSite=Lax`;window.location.href=`/${target}/${window.location.pathname.split("/").slice(2).join("/")}${window.location.search}`;}} className="flex items-center gap-2 rounded-md border px-3 py-2 text-xs"><Globe size={15}/>{lang.toUpperCase()}</button>;
}
