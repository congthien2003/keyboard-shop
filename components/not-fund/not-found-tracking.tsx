"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { track } from "@vercel/analytics";

/**
 * Internal component to track 404 events
 * This component tracks 404 page views for analytics (Vercel Analytics, GA, GTM)
 */
function NotFoundTrackingInternal() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get full URL for tracking
    const queryString = searchParams.toString();
    const fullPath = `${pathname}${queryString ? `?${queryString}` : ""}`;

    try {
      // Track 404 event with Vercel Analytics
      track("404", {
        path: pathname,
        full_path: fullPath,
      });

      // Track with Google Analytics (if available)
      if (typeof window !== "undefined") {
        // Google Analytics 4 (gtag)
        if (typeof (window as any).gtag !== "undefined") {
          (window as any).gtag("event", "page_not_found", {
            page_path: pathname,
            page_location: window.location.href,
          });
        }

        // Google Tag Manager (dataLayer)
        if (typeof (window as any).dataLayer !== "undefined") {
          (window as any).dataLayer.push({
            event: "page_not_found",
            page_path: pathname,
            page_location: window.location.href,
          });
        }

        // Log to console in development
        if (process.env.NODE_ENV === "development") {
          console.log("404 page viewed:", {
            path: pathname,
            full_path: fullPath,
            url: window.location.href,
          });
        }
      }
    } catch (error) {
      console.error("Error tracking 404 event:", error);
    }
  }, [pathname, searchParams]);

  return null;
}

/**
 * Client component to track 404 events
 * Wrapped in Suspense to handle useSearchParams()
 */
export function NotFoundTracking() {
  return (
    <Suspense fallback={null}>
      <NotFoundTrackingInternal />
    </Suspense>
  );
}
