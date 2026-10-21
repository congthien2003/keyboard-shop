"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCategory } from "@/hooks/useCategory";
import { Loader2 } from "lucide-react";

// Local Category type for popup
interface Category {
  id: string;
  name: string;
  nameVi: string;
  slug: string;
  description?: string;
  descriptionVi?: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  onSuccess: () => void;
}

export function CategoryPopup({
  open,
  onOpenChange,
  category,
  onSuccess,
}: CategoryPopupProps) {
  const { t } = useI18n();
  const { createCategory, updateCategory, loading } = useCategory();
  const [formData, setFormData] = useState({
    name: "",
    nameVi: "",
    description: "",
    descriptionVi: "",
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        nameVi: category.nameVi,
        description: category.description || "",
        descriptionVi: category.descriptionVi || "",
      });
    } else {
      setFormData({
        name: "",
        nameVi: "",
        description: "",
        descriptionVi: "",
      });
    }
  }, [category, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const categoryData = {
      nameVi: formData.nameVi,
      nameEn: formData.name,
      descriptionVi: formData.descriptionVi,
      descriptionEn: formData.description,
    };

    if (category) {
      const result = await updateCategory(category.id, categoryData);
      if (result) {
        onOpenChange(false);
        onSuccess();
      }
    } else {
      const result = await createCategory(categoryData);
      if (result) {
        onOpenChange(false);
        onSuccess();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {category
              ? t("admin.categories.edit") || "Sửa danh mục"
              : t("admin.categories.addNew") || "Thêm danh mục mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("admin.categories.nameEn") || "Tên (English)"}
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                placeholder="Category Name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("admin.categories.nameVi") || "Tên (Tiếng Việt)"}
              </label>
              <Input
                value={formData.nameVi}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nameVi: e.target.value,
                  })
                }
                placeholder="Tên danh mục"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("admin.categories.descEn") || "Mô tả (English)"}
              </label>
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                placeholder="Description"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("admin.categories.descVi") || "Mô tả (Tiếng Việt)"}
              </label>
              <Input
                value={formData.descriptionVi}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    descriptionVi: e.target.value,
                  })
                }
                placeholder="Mô tả"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t("admin.cancel") || "Hủy"}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("admin.loading") || "Đang xử lý..."}
                </>
              ) : category ? (
                t("admin.update") || "Cập nhật"
              ) : (
                t("admin.create") || "Tạo mới"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
