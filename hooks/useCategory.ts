import { useState, useCallback } from "react";
import { CategoryResponse, CategoryTranslateModel } from "@/types/category";

interface UseCategoryReturn {
  categories: CategoryResponse[];
  loading: boolean;
  error: string | null;
  createCategory: (
    data: CategoryTranslateModel,
  ) => Promise<CategoryResponse | null>;
  updateCategory: (
    id: string,
    data: CategoryTranslateModel,
  ) => Promise<CategoryResponse | null>;
  deleteCategory: (id: string) => Promise<boolean>;
  fetchCategories: (page?: number, pageSize?: number) => Promise<void>;
  fetchAllCategories: () => Promise<void>;
}

export function useCategory(): UseCategoryReturn {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createCategory = useCallback(
    async (data: CategoryTranslateModel): Promise<CategoryResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create category");
        }

        const category = await response.json();
        setCategories((prev) => [category, ...prev]);
        return category;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updateCategory = useCallback(
    async (
      id: string,
      data: CategoryTranslateModel,
    ): Promise<CategoryResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/categories/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update category");
        }

        const category = await response.json();
        setCategories((prev) =>
          prev.map((cat) => (cat.id === id ? category : cat)),
        );
        return category;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const deleteCategory = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete category");
      }

      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(
    async (page: number = 1, pageSize: number = 10) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/categories?page=${page}&pageSize=${pageSize}`,
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchAllCategories = useCallback(async () => {
    setError(null);

    try {
      // Fetch all categories by using a large pageSize
      const response = await fetch(`/api/categories?page=1&pageSize=1000`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchCategories,
    fetchAllCategories,
  };
}
