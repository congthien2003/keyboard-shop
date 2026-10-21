import { useState, useCallback } from "react";
import {
  OrderWithDetails,
  CreateOrderInput,
  UpdateOrderInput,
  OrderStatus,
  PaymentStatus,
} from "@/types/order";

export function useOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = useCallback(
    async (input: CreateOrderInput): Promise<OrderWithDetails | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create order");
        }

        const order = await response.json();
        return order;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create order";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getOrders = useCallback(
    async (params?: {
      page?: number;
      pageSize?: number;
      status?: OrderStatus | "all";
      paymentStatus?: PaymentStatus | "all";
      search?: string;
    }): Promise<{ orders: OrderWithDetails[]; total: number } | null> => {
      setLoading(true);
      setError(null);
      try {
        const searchParams = new URLSearchParams();

        if (params?.page) searchParams.set("page", params.page.toString());
        if (params?.pageSize)
          searchParams.set("pageSize", params.pageSize.toString());
        if (params?.status && params.status !== "all")
          searchParams.set("status", params.status.toString());
        if (params?.paymentStatus && params.paymentStatus !== "all")
          searchParams.set("paymentStatus", params.paymentStatus.toString());
        if (params?.search) searchParams.set("search", params.search);

        const response = await fetch(`/api/orders?${searchParams.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        return data;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch orders";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getOrderById = useCallback(
    async (id: string): Promise<OrderWithDetails | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/orders/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch order");
        }

        const order = await response.json();
        return order;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch order";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updateOrder = useCallback(
    async (
      id: string,
      input: UpdateOrderInput,
    ): Promise<OrderWithDetails | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/orders/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          throw new Error("Failed to update order");
        }

        const order = await response.json();
        return order;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update order";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const deleteOrder = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete order");
      }

      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete order";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrderStats = useCallback(async (): Promise<{
    total: number;
    pending: number;
    processing: number;
    shipping: number;
    delivered: number;
    cancelled: number;
    totalRevenue: number;
  } | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/orders/stats");

      if (!response.ok) {
        throw new Error("Failed to fetch order stats");
      }

      const stats = await response.json();
      return stats;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch order stats";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    getOrderStats,
  };
}
