"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/contexts/admin-context";
import { useI18n } from "@/lib/i18n";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { CategoryPopup } from "@/components/admin/popups/category-popup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Loader2 } from "lucide-react";
import { useCategory } from "@/hooks/useCategory";
import { CategoryResponse } from "@/types/category";
import { generateSlug } from "@/lib/slug";
import { CategoryItem } from "@/components/admin/category/category-item";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Transform CategoryResponse to Category format for display
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

function transformCategoryResponse(response: CategoryResponse): Category {
  const translateEn = response.translates.find((t) => t.lang === "en");
  const translateVi = response.translates.find((t) => t.lang === "vi");

  // Handle Date or string
  const createdAt =
    response.createdAt instanceof Date
      ? response.createdAt.toISOString()
      : typeof response.createdAt === "string"
        ? response.createdAt
        : new Date(response.createdAt).toISOString();

  const updatedAt =
    response.updatedAt instanceof Date
      ? response.updatedAt.toISOString()
      : typeof response.updatedAt === "string"
        ? response.updatedAt
        : response.updatedAt
          ? new Date(response.updatedAt).toISOString()
          : new Date().toISOString();

  // Use slug from translate if available, otherwise generate from name
  const slug =
    translateVi?.slug ||
    translateEn?.slug ||
    generateSlug(translateVi?.name || translateEn?.name || "");

  return {
    id: response.id,
    name: translateEn?.name || "",
    nameVi: translateVi?.name || "",
    slug,
    description: translateEn?.description || "",
    descriptionVi: translateVi?.description || "",
    createdAt,
    updatedAt,
  };
}

export default function CategoriesPage() {
  const { isAuthenticated } = useAdmin();
  const router = useRouter();
  const { t } = useI18n();
  const {
    categories: apiCategories,
    loading,
    error,
    deleteCategory: deleteCategoryApi,
    fetchAllCategories,
  } = useCategory();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }
    loadCategories();
  }, [isAuthenticated, router]);

  useEffect(() => {
    const transformed = apiCategories.map(transformCategoryResponse);
    setCategories(transformed);
  }, [apiCategories]);

  const loadCategories = useCallback(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  const handleOpenDialog = (category?: Category) => {
    setEditingCategory(category || null);
    setIsDialogOpen(true);
  };

  const handleDelete = useCallback(async (id: string) => {
    if (
      confirm(
        t("admin.categories.confirmDelete") ||
          "Bạn có chắc muốn xóa danh mục này?",
      )
    ) {
      const success = await deleteCategoryApi(id);
      if (success) {
        loadCategories();
      } else {
        alert(
          error ||
            t("admin.categories.deleteError") ||
            "Không thể xóa danh mục",
        );
      }
    }
  }, []);

  const filteredCategories = useMemo(
    () =>
      categories.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.nameVi.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [categories, searchQuery],
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      <div className="lg:pl-64">
        <AdminHeader
          title={t("admin.categories.title") || "Quản lý danh mục"}
          subtitle={
            t("admin.categories.subtitle") || "Quản lý danh mục sản phẩm"
          }
        />

        <main className="pt-[100px] min-h-screen overflow-y-auto">
          <div className="p-6 lg:p-8">
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={
                    t("admin.categories.search") || "Tìm kiếm danh mục..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={() => handleOpenDialog()}
                className="gap-2"
                disabled={loading}
              >
                <Plus className="h-4 w-4" />
                {t("admin.categories.addNew") || "Thêm danh mục"}
              </Button>
            </div>

            {/* Loading State */}
            {/* {loading && (
							<div className="flex items-center justify-center py-12">
								<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
							</div>
						)} */}

            {/* Error State */}
            {/* {error && (
							<div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
								{error}
							</div>
						)} */}

            {/* Categories Table */}
            {!loading && filteredCategories.length > 0 && (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            {t("admin.categories.nameVi") || "Tên (Tiếng Việt)"}
                          </TableHead>
                          <TableHead>
                            {t("admin.categories.nameEn") || "Tên (English)"}
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            {t("admin.categories.slug") || "Slug"}
                          </TableHead>
                          <TableHead className="hidden lg:table-cell">
                            {t("admin.categories.createdAt") || "Ngày tạo"}
                          </TableHead>
                          <TableHead className="hidden lg:table-cell">
                            {t("admin.categories.updatedAt") || "Ngày cập nhật"}
                          </TableHead>
                          <TableHead className="w-[200px]">
                            {t("admin.actions") || "Thao tác"}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCategories.map((category) => (
                          <CategoryItem
                            key={category.id}
                            category={category}
                            onEdit={handleOpenDialog}
                            onDelete={handleDelete}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {!loading && filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {t("admin.categories.noData") || "Chưa có danh mục nào"}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Category Popup */}
      <CategoryPopup
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={editingCategory}
        onSuccess={loadCategories}
      />
    </div>
  );
}
