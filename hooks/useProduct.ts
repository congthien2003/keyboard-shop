"use client";

import { useCallback, useState } from "react";
import type { Product, ProductStatus, ProductTranslate } from "@/types/product";
import { uploadFilesToAssets, uploadSingleToAssets } from "@/lib/upload";

export type ProductWithTranslates = Product & {
  translates: ProductTranslate[];
};

export type CreateProductInput = {
  brand?: string | null;
  layout?: string | null;
  switchType?: string | null;
  connectivity?: string[];
  hotSwappable?: boolean | null;

  thumbnail: string; // url
  image: string[]; // gallery urls
  status: ProductStatus;
  categoryId: string;
  viewCount: number;
  rating: number;
  translates: Array<
    Pick<
      ProductTranslate,
      | "lang"
      | "name"
      | "description"
      | "info"
      | "weight"
      | "unit"
      | "price"
      | "originalPrice"
      | "fromCountry"
    >
  >;
};

export type UpdateProductInput = Partial<CreateProductInput>;

interface UseProductReturn {
  products: ProductWithTranslates[];
  loading: boolean;
  error: string | null;
  createProduct: (
    data: CreateProductInput,
  ) => Promise<ProductWithTranslates | null>;
  updateProduct: (
    id: string,
    data: UpdateProductInput,
  ) => Promise<ProductWithTranslates | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  fetchProducts: (page?: number, pageSize?: number) => Promise<void>;
  fetchAllProducts: () => Promise<void>;
  getProductById: (id: string) => ProductWithTranslates | null;
  uploadThumbnail: (file: File, slug: string | null) => Promise<string>;
  uploadGallery: (files: File[], slug: string | null) => Promise<string[]>;
  deleteImages: (urls: string[]) => Promise<void>;
}

export function useProduct(): UseProductReturn {
  const [products, setProducts] = useState<ProductWithTranslates[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = useCallback(
    async (data: CreateProductInput): Promise<ProductWithTranslates | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create product");
        }

        const product = await response.json();
        setProducts((prev) => [product, ...prev]);
        return product;
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

  const updateProduct = useCallback(
    async (
      id: string,
      data: UpdateProductInput,
    ): Promise<ProductWithTranslates | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/products/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update product");
        }

        const product = await response.json();
        setProducts((prev) => prev.map((p) => (p.id === id ? product : p)));
        return product;
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

  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
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

  const fetchProducts = useCallback(
    async (page?: number, pageSize?: number) => {
      setLoading(true);
      setError(null);

      try {
        const url =
          page && pageSize
            ? `/api/products?page=${page}&pageSize=${pageSize}`
            : "/api/products";
        const response = await fetch(url);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch products");
        }

        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
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

  const fetchAllProducts = useCallback(async () => {
    setError(null);

    try {
      // Fetch all products by using the base endpoint
      const response = await fetch("/api/products");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch products");
      }

      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getProductById = useCallback(
    (id: string) => products.find((p) => p.id === id) || null,
    [products],
  );

  const uploadThumbnail = useCallback(
    async (file: File, slug: string | null) => {
      return await uploadSingleToAssets(file, "product", slug);
    },
    [],
  );

  const uploadGallery = useCallback(
    async (files: File[], slug: string | null) => {
      return await uploadFilesToAssets(files, "product", slug);
    },
    [],
  );

  const deleteImages = useCallback(async (urls: string[]) => {
    if (urls.length === 0) return;
    try {
      await fetch("/api/upload/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ urls }),
      });
    } catch (error) {
      console.error("Failed to delete images:", error);
      // Optionally, you could set an error state here
    }
  }, []);

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchProducts,
    fetchAllProducts,
    getProductById,
    uploadThumbnail,
    uploadGallery,
    deleteImages,
  };
}
