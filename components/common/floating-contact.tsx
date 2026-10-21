"use client";
import { COMPANY_INFO } from "@/data/company-info";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
export function FloatingContact() {
 const path = usePathname();
 const href = COMPANY_INFO.contact.zalo || COMPANY_INFO.contact.facebook;
 if (!href || path.startsWith("/admin")) return null;
 return <a href={href} target="_blank" rel="noopener noreferrer" aria-label={path.startsWith("/en") ? "Contact SB-MechKey" : "Liên hệ SB-MechKey"} className="fixed bottom-6 right-6 z-40 rounded-full bg-primary p-4 text-white shadow-lg"><MessageCircle/></a>;
}
