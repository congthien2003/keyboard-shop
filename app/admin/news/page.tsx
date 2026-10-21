"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/contexts/admin-context";
import { useI18n } from "@/lib/i18n";
import { useNews } from "@/hooks/useNews";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { NewsPopup } from "@/components/admin/popups/news-popup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Eye,
  EyeOff,
  Loader2,
  Clock,
} from "lucide-react";
import { NewsData } from "@/types/news";

const ITEMS_PER_PAGE = 10;

export default function NewsPage() {
  const { isAuthenticated } = useAdmin();
  const router = useRouter();
  const { t, locale } = useI18n();
  const newsApi = useNews();

  // State management
  const [newsList, setNewsList] = useState<NewsData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }
    loadNews();
  }, [isAuthenticated, router, currentPage, locale]);

  const loadNews = async () => {
    setLoading(true);
    try {
      const result = await newsApi.getNewsList({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        lang: locale,
      });

      if (result.success) {
        setNewsList(result.data);
        setTotalItems(result.pagination.total);
      }
    } catch (error) {
      console.error("Failed to load news:", error);
      alert(error instanceof Error ? error.message : "Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = async (news?: NewsData) => {
    if (news) {
      // Fetch full news data with both languages
      try {
        const result = await newsApi.getNewsById(news.id);

        if (result.success) {
          setEditingNews(result.data);
          setIsDialogOpen(true);
        } else {
          alert(result.error || "Failed to load news details");
        }
      } catch (error) {
        console.error("Failed to load news details:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Failed to load news details",
        );
      }
    } else {
      setEditingNews(null);
      setIsDialogOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        t("admin.news.confirmDelete") || "Bạn có chắc muốn xóa bài viết này?",
      )
    ) {
      return;
    }

    try {
      await newsApi.deleteNews(id);
      loadNews();
    } catch (error) {
      console.error("Failed to delete news:", error);
      alert(error instanceof Error ? error.message : "Failed to delete news");
    }
  };

  const filteredNews = newsList.filter(
    (news) =>
      news.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false,
  );

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      <div className="lg:pl-64">
        <AdminHeader
          title={t("admin.news.title") || "Quản lý bài viết"}
          subtitle={t("admin.news.subtitle") || `Tổng ${totalItems} bài viết`}
        />

        <main className="pt-[100px] min-h-screen overflow-y-auto">
          <div className="p-6 lg:p-8">
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t("admin.news.search") || "Tìm kiếm bài viết..."}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="h-4 w-4" />
                {t("admin.news.addNew") || "Thêm bài viết"}
              </Button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {/* News Table */}
            {!loading && (
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          {t("admin.news.table.image") || "Hình ảnh"}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          {t("admin.news.table.title") || "Tiêu đề"}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          {t("admin.news.table.status") || "Trạng thái"}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          {t("admin.news.table.timeReading") || "Thời gian đọc"}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          {t("admin.news.table.createdAt") || "Ngày tạo"}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          {t("admin.news.table.viewCount") || "Lượt xem"}
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-semibold">
                          {t("admin.news.table.actions") || "Thao tác"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredNews.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-4 py-12 text-center text-muted-foreground"
                          >
                            {searchQuery
                              ? t("admin.news.noResults") ||
                                "Không tìm thấy bài viết nào"
                              : t("admin.news.noData") ||
                                "Chưa có bài viết nào"}
                          </td>
                        </tr>
                      ) : (
                        filteredNews.map((news) => (
                          <tr
                            key={news.id}
                            className="border-b hover:bg-muted/30 transition-colors"
                          >
                            <td className="px-4 py-3">
                              {news.image ? (
                                <img
                                  src={news.image}
                                  alt={news.title}
                                  className="w-16 h-16 object-cover rounded"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                                  <span className="text-xs text-muted-foreground">
                                    {t("admin.news.table.noImage") ||
                                      "No Image"}
                                  </span>
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="max-w-xs">
                                <p className="font-medium line-clamp-1">
                                  {news.title}
                                </p>
                                <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                  {news.excerpt}
                                </p>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {news.published ? (
                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex items-center gap-1 w-fit">
                                  <Eye className="h-3 w-3" />
                                  {t("admin.news.published") || "Đã xuất bản"}
                                </span>
                              ) : (
                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 flex items-center gap-1 w-fit">
                                  <EyeOff className="h-3 w-3" />
                                  {t("admin.news.draft") || "Nháp"}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {news.timeReading ? (
                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 flex items-center gap-1 w-fit">
                                  <Clock className="h-3 w-3" />
                                  {news.timeReading}{" "}
                                  {t("admin.news.table.minutes") || "phút"}
                                </span>
                              ) : (
                                <span className="text-sm text-muted-foreground">
                                  -
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">
                              {new Date(news.createdAt).toLocaleDateString(
                                "vi-VN",
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {news.viewCount ?? 0}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-2"
                                  onClick={() => handleOpenDialog(news)}
                                >
                                  <Edit className="h-4 w-4" />
                                  {t("admin.edit") || "Sửa"}
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="gap-2"
                                  onClick={() => handleDelete(news.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  {t("admin.delete") || "Xóa"}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  {t("admin.previous") || "Trước"}
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground px-2">
                    {t("admin.news.table.page") || "Trang"} {currentPage} /{" "}
                    {totalPages}
                  </span>
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

      {/* News Popup */}
      <NewsPopup
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        news={editingNews}
        onSuccess={() => {
          loadNews();
          setEditingNews(null);
        }}
      />
    </div>
  );
}
