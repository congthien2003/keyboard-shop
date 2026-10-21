"use client";

import type { NewsData, NewsListParams } from "@/types/news";

const API_BASE_URL = "/api/admin/news";

/**
 * Hook cung cấp các API calls cho màn hình News
 */
export function useNews() {
  /**
   * Lấy danh sách news với phân trang
   */
  const getNewsList = async (params: NewsListParams = {}) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.lang) searchParams.append("lang", params.lang);

    const response = await fetch(`${API_BASE_URL}?${searchParams.toString()}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch news list");
    }

    return response.json();
  };

  /**
   * Lấy chi tiết một news theo ID
   */
  const getNewsById = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/${id}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch news detail");
    }

    return response.json();
  };

  /**
   * Tạo news mới
   */
  const createNews = async (data: Partial<NewsData>) => {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to create news");
    }

    return result;
  };

  /**
   * Cập nhật news
   */
  const updateNews = async (id: string, data: Partial<NewsData>) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to update news");
    }

    return result;
  };

  /**
   * Xóa news
   */
  const deleteNews = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to delete news");
    }

    return result;
  };

  /**
   * Increment view count for a news article by slug
   */
  const incrementView = async (slug: string) => {
    const response = await fetch(`/api/news/${slug}/view`, {
      method: "PUT",
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to increment view count");
    }

    return result;
  };

  /**
   * Increment like count for a news article by slug
   */
  const incrementLike = async (slug: string) => {
    const response = await fetch(`/api/news/${slug}/like`, {
      method: "PUT",
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to increment like count");
    }

    return result;
  };

  return {
    getNewsList,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,
    incrementView,
    incrementLike,
  };
}
