"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export function ImagePicker({
  value,
  onChange,
  label = "Hình ảnh",
  className = "",
}: ImagePickerProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!validTypes.includes(file.type)) {
      setError("Chỉ chấp nhận file ảnh (JPG, PNG, WEBP, GIF)");
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("Kích thước file không được vượt quá 5MB");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.set("folder", "news");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Upload failed");
      }

      const data = await response.json();
      // API /api/upload trả về { urls: string[] }
      if (data.urls && data.urls.length > 0) {
        onChange(data.urls[0]);
      } else {
        throw new Error("No URL returned from upload");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi khi upload ảnh");
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium">{label}</label>

      <div className="flex flex-col gap-2">
        {/* URL Input */}
        <div className="flex gap-2">
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/example.webp hoặc https://..."
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Error message */}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* Image preview */}
        {value && (
          <div className="relative w-full max-w-md">
            <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-muted">
              <Image
                src={value}
                alt="Preview"
                fill
                className="object-cover"
                onError={() => {
                  // Fallback for broken images
                  setError("Không thể tải ảnh");
                }}
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
