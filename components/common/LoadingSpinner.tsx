import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner = ({
  size = "md",
  className = "",
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-4",
    lg: "w-16 h-16 border-4",
  };

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      aria-label="Loading content"
    >
      <div
        className={`animate-spin rounded-full border-primary border-t-transparent ${sizeClasses[size]}`}
      />
    </div>
  );
};

interface FullPageLoaderProps {
  message?: string;
}

export const FullPageLoader = ({ message }: FullPageLoaderProps) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
      <LoadingSpinner size="lg" />
      {message && (
        <p className="mt-4 text-lg font-medium text-foreground">{message}</p>
      )}
    </div>
  );
};
