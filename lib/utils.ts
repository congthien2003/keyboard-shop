import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleSendMail = (email: string) => {
  if (email) return;
  window.location.href = `mailto:${email}`;
};
