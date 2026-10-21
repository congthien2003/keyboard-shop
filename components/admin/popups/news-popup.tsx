"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useNews } from "@/hooks/useNews";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TipTapEditor } from "@/components/admin/tiptap-editor";
import { ImagePicker } from "@/components/admin/image-picker";
import { Loader2 } from "lucide-react";
import { NewsData } from "@/types/news";
import { generateSlug } from "@/lib/slug";

interface NewsPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  news?: NewsData | null;
  onSuccess: () => void;
}

interface NewsFormData {
  id?: string;
  image?: string;
  published?: boolean;
  slug?: string;
  timeReading?: number | null;
  authorId?: string | null;
  titleVi?: string;
  excerptVi?: string;
  contentVi?: string;
  tagsVi?: string | string[];
  titleEn?: string;
  excerptEn?: string;
  contentEn?: string;
  tagsEn?: string | string[];
}

export function NewsPopup({
  open,
  onOpenChange,
  news,
  onSuccess,
}: NewsPopupProps) {
  const { t } = useI18n();
  const newsApi = useNews();

  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  // Form data state
  const [formData, setFormData] = useState<NewsFormData>({
    image: "",
    published: false,
    slug: "",
    timeReading: 5,
    authorId: null,
    titleVi: "",
    excerptVi: "",
    contentVi: "",
    tagsVi: [],
    titleEn: "",
    excerptEn: "",
    contentEn: "",
    tagsEn: [],
  });

  // Load data when editing
  useEffect(() => {
    if (open && news) {
      setFormData({
        id: news.id,
        image: news.image || "",
        published: news.published ?? false,
        slug: news.slug || "",
        timeReading: news.timeReading || 5,
        authorId: news.authorId || null,
        titleVi: news.titleVi || "",
        excerptVi: news.excerptVi || "",
        contentVi: news.contentVi || "",
        tagsVi: news.tagsVi || [],
        titleEn: news.titleEn || "",
        excerptEn: news.excerptEn || "",
        contentEn: news.contentEn || "",
        tagsEn: news.tagsEn || [],
      });
      setIsSlugManuallyEdited(!!news?.slug);
    } else if (open && !news) {
      // Reset form when creating new
      resetForm();
      setIsSlugManuallyEdited(false);
    }
  }, [open, news]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  // Auto-generate slug from titleVi in real-time
  useEffect(() => {
    if (!isSlugManuallyEdited) {
      const generatedSlug = generateSlug(formData.titleVi || "");
      updateField("slug", generatedSlug);
    }
  }, [formData.titleVi, isSlugManuallyEdited]);

  // Scroll to first error when validation fails
  useEffect(() => {
    if (Object.keys(fieldErrors).length > 0) {
      setTimeout(() => {
        const firstErrorField = Object.keys(fieldErrors)[0];
        const errorElement = document.querySelector(
          `[data-field="${firstErrorField}"]`,
        );
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [fieldErrors]);

  const resetForm = () => {
    setFormData({
      image: "",
      published: false,
      slug: "",
      timeReading: 5,
      authorId: null,
      titleVi: "",
      excerptVi: "",
      contentVi: "",
      tagsVi: [],
      titleEn: "",
      excerptEn: "",
      contentEn: "",
      tagsEn: [],
    });
    setFieldErrors({});
    setError(null);
  };

  const updateField = <K extends keyof NewsFormData>(
    field: K,
    value: NewsFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    setFieldErrors((prev) => {
      if (prev[field as string]) {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      }
      return prev;
    });
  };

  // Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Image
    if (!formData.image?.trim()) {
      errors.image = t("news.popup.validation.imageRequired");
    }

    // Slug
    if (!formData.slug?.trim()) {
      errors.slug =
        t("news.popup.validation.slugRequired") || "Slug là bắt buộc";
    }

    // Time Reading
    if (!formData.timeReading || formData.timeReading <= 0) {
      errors.timeReading = t("news.popup.validation.timeReadingMin");
    }

    // Helper to check if HTML content is empty
    const isHtmlEmpty = (html: string | undefined): boolean => {
      if (!html || !html.trim()) return true;
      const textContent = html.replace(/<[^>]*>/g, "").trim();
      return textContent.length === 0;
    };

    // Helper to get tags array length
    const getTagsLength = (tags: string | string[] | undefined): number => {
      if (Array.isArray(tags)) return tags.length;
      if (typeof tags === "string" && tags.trim()) {
        return tags
          .trim()
          .split(",")
          .filter((t) => t).length;
      }
      return 0;
    };

    // Vietnamese is REQUIRED - always validate
    if (!formData.titleVi?.trim()) {
      errors.titleVi =
        t("news.popup.validation.titleRequired") ||
        "Tiêu đề tiếng Việt là bắt buộc";
    }
    if (!formData.excerptVi?.trim()) {
      errors.excerptVi =
        t("news.popup.validation.excerptViRequired") ||
        "Mô tả ngắn tiếng Việt là bắt buộc";
    }
    if (isHtmlEmpty(formData.contentVi)) {
      errors.contentVi =
        t("news.popup.validation.contentRequired") ||
        "Nội dung tiếng Việt là bắt buộc";
    }
    if (getTagsLength(formData.tagsVi) === 0) {
      errors.tagsVi =
        t("news.popup.validation.tagsViRequired") ||
        "Tags tiếng Việt là bắt buộc";
    }

    // English is OPTIONAL - but if one field is filled, all must be filled
    const hasAnyEnglish =
      formData.titleEn?.trim() ||
      formData.excerptEn?.trim() ||
      !isHtmlEmpty(formData.contentEn) ||
      getTagsLength(formData.tagsEn) > 0;

    if (hasAnyEnglish) {
      // If user started filling English, require all English fields
      if (!formData.titleEn?.trim()) {
        errors.titleEn =
          t("news.popup.validation.titleEnRequired") ||
          "Nếu có tiếng Anh, tiêu đề là bắt buộc";
      }
      if (!formData.excerptEn?.trim()) {
        errors.excerptEn =
          t("news.popup.validation.excerptEnRequired") ||
          "Nếu có tiếng Anh, mô tả ngắn là bắt buộc";
      }
      if (isHtmlEmpty(formData.contentEn)) {
        errors.contentEn =
          t("news.popup.validation.contentEnRequired") ||
          "Nếu có tiếng Anh, nội dung là bắt buộc";
      }
      if (getTagsLength(formData.tagsEn) === 0) {
        errors.tagsEn =
          t("news.popup.validation.tagsEnRequired") ||
          "Nếu có tiếng Anh, tags là bắt buộc";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Prepare data - ensure tags are arrays
    let tagsViArray: string[] = [];
    if (Array.isArray(formData.tagsVi)) {
      tagsViArray = formData.tagsVi;
    } else if (typeof formData.tagsVi === "string") {
      const tagsViStr = formData.tagsVi;
      if (tagsViStr.trim()) {
        tagsViArray = tagsViStr
          .split(",")
          .map((t: string) => t.trim())
          .filter((t: string) => t);
      }
    }

    let tagsEnArray: string[] = [];
    if (Array.isArray(formData.tagsEn)) {
      tagsEnArray = formData.tagsEn;
    } else if (typeof formData.tagsEn === "string") {
      const tagsEnStr = formData.tagsEn;
      if (tagsEnStr.trim()) {
        tagsEnArray = tagsEnStr
          .split(",")
          .map((t: string) => t.trim())
          .filter((t: string) => t);
      }
    }

    const submitData = {
      ...formData,
      slug: formData.slug?.trim() || generateSlug(formData.titleVi || ""),
      tagsVi: tagsViArray,
      tagsEn: tagsEnArray,
    };

    setLoading(true);
    try {
      if (news?.id) {
        await newsApi.updateNews(news.id, submitData);
      } else {
        await newsApi.createNews(submitData);
      }

      onOpenChange(false);
      onSuccess();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t("news.api.errors.unknown");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle time reading input
  const handleTimeReadingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      updateField("timeReading", null);
    } else {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue > 0) {
        updateField("timeReading", numValue);
      }
    }
  };

  // Handle tags input
  const handleTagsViChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField("tagsVi", e.target.value as any);
  };

  const handleTagsViBlur = () => {
    const tagsViValue = formData.tagsVi;
    if (typeof tagsViValue === "string") {
      const tags = tagsViValue
        .split(",")
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag);
      updateField("tagsVi", tags as any);
    }
  };

  const handleTagsEnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField("tagsEn", e.target.value as any);
  };

  const handleTagsEnBlur = () => {
    const tagsEnValue = formData.tagsEn;
    if (typeof tagsEnValue === "string") {
      const tags = tagsEnValue
        .split(",")
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag);
      updateField("tagsEn", tags as any);
    }
  };

  // Get tags display value
  const getTagsViDisplay = () => {
    const tagsViValue = formData.tagsVi;
    if (Array.isArray(tagsViValue)) {
      return tagsViValue.join(", ");
    }
    if (typeof tagsViValue === "string") {
      return tagsViValue;
    }
    return "";
  };

  const getTagsEnDisplay = () => {
    const tagsEnValue = formData.tagsEn;
    if (Array.isArray(tagsEnValue)) {
      return tagsEnValue.join(", ");
    }
    if (typeof tagsEnValue === "string") {
      return tagsEnValue;
    }
    return "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {news ? t("news.popup.editTitle") : t("news.popup.addTitle")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Image Picker */}
          <div className="space-y-2" data-field="image">
            <ImagePicker
              value={formData.image || ""}
              onChange={(url) => updateField("image", url)}
              label={t("news.popup.fields.image")}
            />
            {fieldErrors.image && (
              <p className="text-sm text-red-600">{fieldErrors.image}</p>
            )}
          </div>

          {/* Author & Time Reading */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("news.popup.fields.author")}
              </label>
              <Select
                value={formData.authorId || "none"}
                onValueChange={(value) =>
                  updateField("authorId", value === "none" ? null : value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    {t("news.popup.fields.authorNone")}
                  </SelectItem>
                  {/* TODO: Load from API users */}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2" data-field="timeReading">
              <label className="text-sm font-medium">
                {t("news.popup.fields.timeReading")} *
              </label>
              <Input
                type="number"
                min="1"
                value={formData.timeReading ?? ""}
                onChange={handleTimeReadingChange}
                placeholder={t("news.popup.fields.timeReadingPlaceholder")}
                className={fieldErrors.timeReading ? "border-red-500" : ""}
              />
              {fieldErrors.timeReading && (
                <p className="text-sm text-red-600">
                  {fieldErrors.timeReading}
                </p>
              )}
            </div>
          </div>

          {/* Language Tabs */}
          <Tabs defaultValue="vi" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="vi">
                {t("news.popup.tabs.vietnamese")}
              </TabsTrigger>
              <TabsTrigger value="en">
                {t("news.popup.tabs.english")}
              </TabsTrigger>
            </TabsList>

            {/* Vietnamese Tab */}
            <TabsContent value="vi" className="space-y-4">
              <div className="space-y-2" data-field="titleVi">
                <label className="text-sm font-medium">
                  {t("news.popup.fields.titleViRequired")}
                </label>
                <Input
                  value={formData.titleVi || ""}
                  onChange={(e) => updateField("titleVi", e.target.value)}
                  placeholder={t("news.popup.fields.titleViPlaceholder")}
                  className={fieldErrors.titleVi ? "border-red-500" : ""}
                />
                {fieldErrors.titleVi && (
                  <p className="text-sm text-red-600">{fieldErrors.titleVi}</p>
                )}
              </div>

              <div className="space-y-2" data-field="excerptVi">
                <label className="text-sm font-medium">
                  {t("news.popup.fields.excerptVi")} *
                </label>
                <Textarea
                  value={formData.excerptVi || ""}
                  onChange={(e) => updateField("excerptVi", e.target.value)}
                  placeholder={t("news.popup.fields.excerptViPlaceholder")}
                  rows={3}
                  className={fieldErrors.excerptVi ? "border-red-500" : ""}
                />
                {fieldErrors.excerptVi && (
                  <p className="text-sm text-red-600">
                    {fieldErrors.excerptVi}
                  </p>
                )}
              </div>

              <div className="space-y-2" data-field="contentVi">
                <label className="text-sm font-medium">
                  {t("news.popup.fields.contentViRequired")}
                </label>
                <TipTapEditor
                  content={formData.contentVi || ""}
                  onChange={(content) => updateField("contentVi", content)}
                  placeholder={t("news.popup.fields.contentViPlaceholder")}
                />
                {fieldErrors.contentVi && (
                  <p className="text-sm text-red-600">
                    {fieldErrors.contentVi}
                  </p>
                )}
              </div>

              <div className="space-y-2" data-field="tagsVi">
                <label className="text-sm font-medium">
                  {t("news.popup.fields.tagsVi")} *
                </label>
                <Input
                  value={getTagsViDisplay()}
                  onChange={handleTagsViChange}
                  onBlur={handleTagsViBlur}
                  placeholder={t("news.popup.fields.tagsViPlaceholder")}
                  className={fieldErrors.tagsVi ? "border-red-500" : ""}
                />
                {fieldErrors.tagsVi && (
                  <p className="text-sm text-red-600">{fieldErrors.tagsVi}</p>
                )}
              </div>
            </TabsContent>

            {/* English Tab */}
            <TabsContent value="en" className="space-y-4">
              <div className="space-y-2" data-field="titleEn">
                <label className="text-sm font-medium">
                  {t("news.popup.fields.titleEn")} *
                </label>
                <Input
                  value={formData.titleEn || ""}
                  onChange={(e) => updateField("titleEn", e.target.value)}
                  placeholder={t("news.popup.fields.titleEnPlaceholder")}
                  className={fieldErrors.titleEn ? "border-red-500" : ""}
                />
                {fieldErrors.titleEn && (
                  <p className="text-sm text-red-600">{fieldErrors.titleEn}</p>
                )}
              </div>

              <div className="space-y-2" data-field="excerptEn">
                <label className="text-sm font-medium">
                  {t("news.popup.fields.excerptEn")} *
                </label>
                <Textarea
                  value={formData.excerptEn || ""}
                  onChange={(e) => updateField("excerptEn", e.target.value)}
                  placeholder={t("news.popup.fields.excerptEnPlaceholder")}
                  rows={3}
                  className={fieldErrors.excerptEn ? "border-red-500" : ""}
                />
                {fieldErrors.excerptEn && (
                  <p className="text-sm text-red-600">
                    {fieldErrors.excerptEn}
                  </p>
                )}
              </div>

              <div className="space-y-2" data-field="contentEn">
                <label className="text-sm font-medium">
                  {t("news.popup.fields.contentEn")} *
                </label>
                <TipTapEditor
                  content={formData.contentEn || ""}
                  onChange={(content) => updateField("contentEn", content)}
                  placeholder={t("news.popup.fields.contentEnPlaceholder")}
                />
                {fieldErrors.contentEn && (
                  <p className="text-sm text-red-600">
                    {fieldErrors.contentEn}
                  </p>
                )}
              </div>

              <div className="space-y-2" data-field="tagsEn">
                <label className="text-sm font-medium">
                  {t("news.popup.fields.tagsEn")} *
                </label>
                <Input
                  value={getTagsEnDisplay()}
                  onChange={handleTagsEnChange}
                  onBlur={handleTagsEnBlur}
                  placeholder={t("news.popup.fields.tagsEnPlaceholder")}
                  className={fieldErrors.tagsEn ? "border-red-500" : ""}
                />
                {fieldErrors.tagsEn && (
                  <p className="text-sm text-red-600">{fieldErrors.tagsEn}</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
          {/* Slug */}
          <div className="space-y-2" data-field="slug">
            <label className="text-sm font-medium">
              {t("news.popup.fields.slug") || "Slug (URL)"} *
            </label>
            <Input
              value={formData.slug || ""}
              onChange={(e) => {
                setIsSlugManuallyEdited(true);
                updateField("slug", e.target.value);
              }}
              placeholder="bai-viet-mau"
              className={fieldErrors.slug ? "border-red-500" : ""}
            />
            <p className="text-xs text-muted-foreground">
              {t("news.popup.fields.slugHint") ||
                "Tự động tạo từ tiêu đề tiếng Việt. Có thể chỉnh sửa."}
            </p>
            {fieldErrors.slug && (
              <p className="text-sm text-red-600">{fieldErrors.slug}</p>
            )}
          </div>
          {/* Published Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={formData.published ?? false}
              onChange={(e) => updateField("published", e.target.checked)}
              className="rounded"
            />
            <label htmlFor="published" className="text-sm">
              {t("news.popup.fields.published")}
            </label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t("news.popup.buttons.cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {news
                    ? t("news.popup.buttons.updating")
                    : t("news.popup.buttons.creating")}
                </>
              ) : news ? (
                t("news.popup.buttons.update")
              ) : (
                t("news.popup.buttons.create")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
