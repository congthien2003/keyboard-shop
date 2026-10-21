"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar, Globe, Hash } from "lucide-react";
import { useI18n } from "@/lib/i18n";

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

interface CategoryItemProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export function CategoryItem({
  category,
  onEdit,
  onDelete,
}: CategoryItemProps) {
  const { t } = useI18n();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <tr className="border-b hover:bg-muted/50 transition-colors">
      {/* Name (Vietnamese) */}
      <td className="px-4 py-4">
        <div>
          <h3 className="font-semibold text-base">{category.nameVi}</h3>
          {category.descriptionVi && (
            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
              {category.descriptionVi}
            </p>
          )}
        </div>
      </td>

      {/* Name (English) */}
      <td className="px-4 py-4">
        <div>
          <p className="font-medium">{category.name}</p>
          {category.description && (
            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
              {category.description}
            </p>
          )}
        </div>
      </td>

      {/* Slug */}
      <td className="px-4 py-4 hidden md:table-cell">
        <div className="flex items-center gap-2">
          <code className="text-xs bg-muted px-2 py-1 rounded">
            {category.slug}
          </code>
        </div>
      </td>

      {/* Created At */}
      <td className="px-4 py-4 hidden lg:table-cell">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(category.createdAt)}</span>
        </div>
      </td>

      {/* Updated At */}
      <td className="px-4 py-4 hidden lg:table-cell">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(category.updatedAt)}</span>
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(category)}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">{t("admin.edit") || "Sửa"}</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(category.id)}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t("admin.delete") || "Xóa"}
            </span>
          </Button>
        </div>
      </td>
    </tr>
  );
}
