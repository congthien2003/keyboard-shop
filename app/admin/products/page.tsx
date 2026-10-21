"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/contexts/admin-context";
import { useI18n } from "@/lib/i18n";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { ProductPopup } from "@/components/admin/popups/product-popup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2, Search, Package, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCategory } from "@/hooks/useCategory";
import { useProduct } from "@/hooks/useProduct";
import { CategoryResponse } from "@/types/category";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/helpers/formatDate";
import { ProductResponse } from "@/services/product-service";

const ITEMS_PER_PAGE = 12;

export default function ProductsPage() {
  const { isAuthenticated } = useAdmin();
  const router = useRouter();
  const { t, locale } = useI18n();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(
    null,
  );

  // Optional: Use useProduct hook for real API data
  const {
    products: apiProducts,
    loading: productsLoading,
    fetchAllProducts,
    deleteProduct: deleteProductApi,
  } = useProduct();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }
    loadData();
  }, [isAuthenticated, router]);

  const {
    loading: categoriesLoading,
    categories: loadedCategories,
    fetchCategories,
  } = useCategory();

  useEffect(() => {
    fetchCategories();
    fetchAllProducts();
  }, [fetchCategories, fetchAllProducts]);

  // Sync categories from hook to local state
  useEffect(() => {
    if (loadedCategories) {
      setCategories(loadedCategories);
    }
  }, [loadedCategories]);

  // Sync products from hook to local state
  useEffect(() => {
    if (apiProducts !== undefined) {
      setProducts(apiProducts);
    }
  }, [apiProducts]);

  const loadData = useCallback(() => {
    fetchAllProducts();
    fetchCategories();
  }, [fetchAllProducts, fetchCategories]);

  const handleOpenDialog = (product?: ProductResponse) => {
    setEditingProduct(product || null);
    setIsDialogOpen(true);
  };

  const handleDelete = useCallback(
    async (id: string) => {
      if (
        confirm(
          t("admin.products.confirmDelete") ||
            "Bạn có chắc muốn xóa sản phẩm này?",
        )
      ) {
        const success = await deleteProductApi(id);
        if (success) {
          await fetchAllProducts();
        } else {
          alert(t("admin.products.deleteError") || "Không thể xóa sản phẩm");
        }
      }
    },
    [deleteProductApi, fetchAllProducts, t],
  );

  // Filter products by search and category
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    // Search filter
    const matchesSearch =
      !normalizedQuery ||
      product.translates.some((t) =>
        t.name.toLowerCase().includes(normalizedQuery),
      ) ||
      product.translates.some((t) =>
        t.description?.toLowerCase().includes(normalizedQuery),
      ) ||
      product.translates.some((t) =>
        ((t as any)?.weight || "").toLowerCase().includes(normalizedQuery),
      ) ||
      product.translates.some((t) =>
        (t.unit || "").toLowerCase().includes(normalizedQuery),
      );

    // Category filter
    const matchesCategory =
      selectedCategoryId === "all" || product.categoryId === selectedCategoryId;

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const getStatusBadge = (status: number | string) => {
    const statusNum = typeof status === "string" ? parseInt(status) : status;
    switch (statusNum) {
      case 1: // CONTACT
        return "bg-secondary text-foreground";
      case 3: // ACTIVE
        return "bg-secondary text-foreground";
      case 2: // SOLD
        return "bg-red-100 text-red-700";
      default:
        return "bg-secondary text-muted-foreground";
    }
  };

  const getStatusText = (status: number | string) => {
    const statusNum = typeof status === "string" ? parseInt(status) : status;
    switch (statusNum) {
      case 1: // CONTACT
        return t("admin.products.statusContact") || "Liên hệ";
      case 3: // ACTIVE
        return t("admin.products.statusActive") || "Còn hàng";
      case 2: // SOLD
        return t("admin.products.statusOutOfStock") || "Hết hàng";
      default:
        return status.toString();
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (!category) return "-";
    const translate = category.translates.find((t) => t.lang === locale);
    return translate?.name || category.translates[0]?.name || "-";
  };

  const formatPrice = useCallback(
    (price: number | undefined | null): string => {
      if (!price && price !== 0) return "-";
      return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
        style: "currency",
        currency: locale === "vi" ? "VND" : "USD",
      }).format(price);
    },
    [locale],
  );

  const getWeight = (product: ProductResponse): string => {
    const translate = product.translates.find((t) => t.lang === locale);
    return translate?.weight || "-";
  };

  const getUnit = (product: ProductResponse): string => {
    const translate = product.translates.find((t) => t.lang === locale);
    return translate?.unit || "-";
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      <div className="lg:pl-64">
        <AdminHeader
          title={t("admin.products.title") || "Quản lý sản phẩm"}
          subtitle={
            t("admin.products.subtitle") ||
            `Tổng ${filteredProducts.length} sản phẩm`
          }
        />

        <main className="pt-[100px] min-h-screen overflow-y-auto">
          <div className="p-6 lg:p-8">
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder={
                      t("admin.products.search") || "Tìm kiếm sản phẩm..."
                    }
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
                <div className="min-w-[200px]">
                  <Select
                    value={selectedCategoryId}
                    onValueChange={(value) => {
                      setSelectedCategoryId(value);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("admin.categories.all") || "Tất cả"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t("admin.categories.all") || "Tất cả"}
                      </SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {locale === "vi"
                            ? category.translates.find((t) => t.lang === "vi")
                                ?.name || ""
                            : category.translates.find((t) => t.lang === "en")
                                ?.name || ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="h-4 w-4" />
                {t("admin.products.addNew") || "Thêm sản phẩm"}
              </Button>
            </div>

            {/* Loading State */}
            {productsLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}

            {/* Products Table */}
            {!productsLoading && paginatedProducts.length > 0 && (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">
                            {t("admin.products.image") || "Hình ảnh"}
                          </TableHead>
                          <TableHead>
                            {t("admin.products.name") || "Tên sản phẩm"}
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            {t("admin.products.price") || "Giá"}
                          </TableHead>
                          <TableHead className="hidden lg:table-cell">
                            {t("admin.products.category") || "Danh mục"}
                          </TableHead>
                          <TableHead className="hidden lg:table-cell">
                            {t("admin.products.status") || "Trạng thái"}
                          </TableHead>
                          <TableHead className="hidden lg:table-cell">
                            {t("admin.products.unit") || "Đơn vị"}
                          </TableHead>
                          <TableHead className="hidden lg:table-cell">
                            {t("admin.products.weight") || "Khối lượng"}
                          </TableHead>
                          <TableHead className="hidden lg:table-cell">
                            {t("admin.products.viewCount") || "Lượt xem"}
                          </TableHead>
                          <TableHead className="hidden lg:table-cell">
                            {t("admin.products.createdAt") || "Ngày tạo"}
                          </TableHead>
                          <TableHead className="w-[200px]">
                            {t("admin.actions") || "Thao tác"}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedProducts.map((product) => (
                          <TableRow
                            key={product.id}
                            className="hover:bg-muted/50 transition-colors"
                          >
                            {/* Image */}
                            <td className="px-4 py-4">
                              <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                                {product.thumbnail ||
                                (product.image && product.image.length > 0) ? (
                                  <img
                                    src={product.thumbnail || product.image[0]}
                                    alt={
                                      product.translates.find(
                                        (t) => t.lang === locale,
                                      )?.name || ""
                                    }
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Package className="h-6 w-6 text-muted-foreground" />
                                )}
                              </div>
                            </td>

                            {/* Name */}
                            <td className="px-4 py-4">
                              <div>
                                <h3 className="font-semibold text-base">
                                  {locale === "vi"
                                    ? product.translates.find(
                                        (t) => t.lang === "vi",
                                      )?.name || ""
                                    : product.translates.find(
                                        (t) => t.lang === "en",
                                      )?.name || ""}
                                </h3>
                                {product.translates.find(
                                  (t) => t.lang === locale,
                                )?.description && (
                                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1 text-ellipsis overflow-hidden max-w-[200px]">
                                    {locale === "vi"
                                      ? product.translates.find(
                                          (t) => t.lang === "vi",
                                        )?.description || ""
                                      : product.translates.find(
                                          (t) => t.lang === "en",
                                        )?.description || ""}
                                  </p>
                                )}
                                {product.rating && (
                                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-secondary text-foreground">
                                    ⭐ {product.rating.toFixed(1)}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Price */}
                            <td className="px-4 py-4 hidden md:table-cell">
                              <div className="font-medium">
                                {formatPrice(
                                  product.translates.find(
                                    (t) => t.lang === locale,
                                  )?.price,
                                )}
                              </div>
                            </td>

                            {/* Category */}
                            <td className="px-4 py-4 hidden lg:table-cell">
                              <div className="text-sm">
                                {getCategoryName(product.categoryId)}
                              </div>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-4 hidden lg:table-cell">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                                  product.status,
                                )}`}
                              >
                                {getStatusText(product.status)}
                              </span>
                            </td>

                            {/* Unit */}
                            <td className="px-4 py-4 hidden lg:table-cell">
                              <div className="text-sm">{getUnit(product)}</div>
                            </td>

                            {/* Weight */}
                            <td className="px-4 py-4 hidden lg:table-cell">
                              <div className="text-sm">
                                {getWeight(product)}
                              </div>
                            </td>

                            {/* View Count */}
                            <td className="px-4 py-4 hidden lg:table-cell">
                              <div className="text-sm">
                                {product.viewCount || "0"}
                              </div>
                            </td>

                            {/* Created At */}
                            <td className="px-4 py-4 hidden lg:table-cell">
                              <div className="text-sm text-muted-foreground">
                                {formatDate(
                                  product.createdAt instanceof Date
                                    ? product.createdAt.toISOString()
                                    : typeof product.createdAt === "string"
                                      ? product.createdAt
                                      : new Date(
                                          product.createdAt,
                                        ).toISOString(),
                                )}
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenDialog(product)}
                                  className="gap-2"
                                >
                                  <Edit className="h-4 w-4" />
                                  <span className="hidden sm:inline">
                                    {t("admin.edit") || "Sửa"}
                                  </span>
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDelete(product.id)}
                                  className="gap-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="hidden sm:inline">
                                    {t("admin.delete") || "Xóa"}
                                  </span>
                                </Button>
                              </div>
                            </td>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {!productsLoading && paginatedProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {t("admin.products.noData") || "Chưa có sản phẩm nào"}
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  {t("admin.previous") || "Trước"}
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ),
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  {t("admin.next") || "Sau"}
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Product Popup */}
      {isDialogOpen && (
        <ProductPopup
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          product={editingProduct}
          categories={categories}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}
