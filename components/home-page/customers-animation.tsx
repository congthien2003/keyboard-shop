"use client";

export function CustomersAnimation() {
  return (
    <style jsx global>{`
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(16px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }

      .customer-card {
        animation: fadeInUp 0.45s ease-out forwards;
        opacity: 0;
      }

      .partner-card {
        animation: fadeInUp 0.45s ease-out forwards;
        opacity: 0;
      }

      .pulse-dot {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
    `}</style>
  );
}
