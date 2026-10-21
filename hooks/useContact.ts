"use client";

import { useCallback, useState } from "react";
import {
  Contact,
  ContactStatus,
  Priority,
  CreateContactRequest,
  UpdateContactRequest,
  ContactListParams,
} from "@/types/contact";

export interface ContactListResponse {
  contacts: Contact[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface UseContactReturn {
  // State
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  totalContacts: number;
  currentPage: number;
  totalPages: number;

  // User actions
  createContact: (data: CreateContactRequest) => Promise<Contact | null>;

  // Admin actions
  fetchContacts: (params?: ContactListParams) => Promise<void>;
  getContactById: (id: string) => Promise<Contact | null>;
  updateContact: (
    id: string,
    data: UpdateContactRequest,
  ) => Promise<Contact | null>;
  deleteContact: (id: string) => Promise<boolean>;
}

export function useContact(): UseContactReturn {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalContacts, setTotalContacts] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  /**
   * Tạo contact mới (User - Public endpoint)
   */
  const createContact = useCallback(
    async (data: CreateContactRequest): Promise<Contact | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/contacts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create contact");
        }

        const contact = await response.json();
        return contact;
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

  /**
   * Lấy danh sách contacts (Admin)
   */
  const fetchContacts = useCallback(async (params?: ContactListParams) => {
    setLoading(true);
    setError(null);

    try {
      // Build query string
      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.set("page", params.page.toString());
      if (params?.limit) queryParams.set("limit", params.limit.toString());
      if (params?.search) queryParams.set("search", params.search);
      if (params?.status !== undefined)
        queryParams.set("status", params.status.toString());
      if (params?.priority !== undefined)
        queryParams.set("priority", params.priority.toString());
      if (params?.sortBy) queryParams.set("sortBy", params.sortBy);
      if (params?.sortOrder) queryParams.set("sortOrder", params.sortOrder);

      const url = `/api/admin/contacts?${queryParams.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch contacts");
      }

      const data: ContactListResponse = await response.json();
      setContacts(data.contacts);
      setTotalContacts(data.total);
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Lấy contact theo ID (Admin)
   */
  const getContactById = useCallback(
    async (id: string): Promise<Contact | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/admin/contacts/${id}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch contact");
        }

        const contact = await response.json();
        return contact;
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

  /**
   * Cập nhật contact (Admin)
   */
  const updateContact = useCallback(
    async (id: string, data: UpdateContactRequest): Promise<Contact | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/admin/contacts/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update contact");
        }

        const contact = await response.json();

        // Update local state
        setContacts((prev) => prev.map((c) => (c.id === id ? contact : c)));

        return contact;
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

  /**
   * Xóa contact (Admin)
   */
  const deleteContact = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete contact");
      }

      // Update local state
      setContacts((prev) => prev.filter((c) => c.id !== id));
      setTotalContacts((prev) => prev - 1);

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

  return {
    // State
    contacts,
    loading,
    error,
    totalContacts,
    currentPage,
    totalPages,

    // User actions
    createContact,

    // Admin actions
    fetchContacts,
    getContactById,
    updateContact,
    deleteContact,
  };
}
