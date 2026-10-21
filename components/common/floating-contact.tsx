"use client";

import { Button } from "@/components/ui/button";
import { Phone, Mail, Facebook, MessageCircle } from "lucide-react";
import { COMPANY_INFO } from "@/data/company-info";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function FloatingContact() {
  const pathname = usePathname();
  const contactOptions = [
    {
      icon: <Phone className="h-5 w-5" />,
      label: "Gọi điện",
      action: () => {
        window.open(`tel:${COMPANY_INFO.contact.phone}`, "_self");
      },
      color: "bg-primary hover:bg-primary/90",
    },
    {
      icon: (
        <Image
          src="/images/zalo.webp"
          alt="Zalo"
          width={48}
          height={48}
          className="h-full w-full object-cover rounded-full"
        />
      ),
      label: "Zalo",
      action: () => {
        window.open(COMPANY_INFO.contact.zalo, "_blank");
      },
      color: "bg-white hover:bg-white/80",
      border: "border border-primary/15",
    },
    {
      icon: <Facebook className="h-5 w-5" />,
      label: "Facebook",
      action: () => {
        window.open(COMPANY_INFO.contact.facebook, "_blank");
      },
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      label: "Messenger",
      action: () => {
        // Extract username from Facebook URL and create Messenger link
        const facebookUrl = COMPANY_INFO.contact.facebook;
        const username = facebookUrl.split("/").pop() || "khangmy.fruit";
        window.open(`https://m.me/${username}`, "_blank");
      },
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      icon: <Mail className="h-5 w-5" />,
      label: "Email",
      action: () => {
        window.open(`mailto:${COMPANY_INFO.contact.email}`, "_self");
      },
      color: "bg-accent hover:bg-accent/90",
    },
  ];

  if (pathname.includes("/admin/")) {
    return null;
  }
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Contact Options - Always Visible */}
      <div className="mb-4 space-y-3">
        {contactOptions.map((option, index) => (
          <div key={option.label} className="flex items-center gap-3">
            <Button
              onClick={option.action}
              aria-label={option.label}
              className={`${option.color} ${option.border || ""} h-12 w-12 overflow-hidden rounded-full p-0 text-white shadow-[0_12px_24px_-12px_rgba(20,60,40,0.65)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_28px_-12px_rgba(20,60,40,0.75)] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`}
              size="sm"
            >
              {option.icon}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
