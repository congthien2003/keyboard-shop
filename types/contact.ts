/**
 * Contact Management Types
 *
 * Định nghĩa các types cho hệ thống quản lý liên hệ
 */

// ==================== ENUMS ====================

/**
 * Trạng thái liên hệ
 */
export enum ContactStatus {
  OPEN = 0, // Chưa xử lý
  IN_PROGRESS = 1, // Đang xử lý
  CLOSED = 2, // Đã xử lý
}

/**
 * Độ ưu tiên
 */
export enum Priority {
  LOW = 0, // Thấp
  NORMAL = 1, // Trung bình
  HIGH = 2, // Cao
}

/**
 * Contact Data từ API/Prisma
 */
export type Contact = {
  id: string;
  // Thông tin user
  name: string;
  email: string;
  phone: string;
  message: string | null;
  // Trạng thái quản lý
  status: ContactStatus;
  // Phản hồi khách hàng
  note?: string | null;
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  // Metadata
  priority: Priority;
};

/**
 * Create Contact Request (từ form liên hệ)
 */
export type CreateContactRequest = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

/**
 * Update Contact Request (admin)
 */
export type UpdateContactRequest = {
  // Trạng thái
  status?: ContactStatus;
  note?: string | null;
  priority?: Priority;
};

/**
 * Contact List Query Params
 */
export type ContactListParams = {
  page?: number;
  limit?: number;
  search?: string; // Tìm kiếm theo name, email, phone
  status?: ContactStatus;
  note?: string | null;
  priority?: Priority;
  sortBy?: "createdAt" | "updatedAt" | "priority";
  sortOrder?: "asc" | "desc";
};

/**
 * Contact status (thống kê)
 */
export type ContactStats = {
  total: number;
  new: number; // Chưa đọc
  read: number; // Đã đọc
  archived: number; // Đã lưu trữ
  byStatus: {
    none: number; // Chưa liên hệ
    called: number; // Đã gọi
    messaged: number; // Đã nhắn tin
    calledAndMessaged: number; // Đã gọi và nhắn tin
  };
  byResponse: {
    noResponse: number; // Chưa phản hồi
    interested: number; // Quan tâm
    notInterested: number; // Không quan tâm
    followUp: number; // Theo dõi
    converted: number; // Đã chuyển đổi
  };
  byPriority: {
    normal: number;
    high: number;
    urgent: number;
  };
};

/**
 * Get label cho Priority
 */
export function getPriorityLabel(
  priority: Priority,
  locale: "vi" | "en" = "vi",
): string {
  const labels: Record<Priority, { vi: string; en: string }> = {
    [Priority.LOW]: { vi: "Thấp", en: "Low" },
    [Priority.NORMAL]: { vi: "Bình thường", en: "Normal" },
    [Priority.HIGH]: { vi: "Cao", en: "High" },
  };
  return labels[priority][locale];
}

/**
 * Get color cho Priority (để hiển thị badge)
 */
export function getPriorityColor(priority: Priority): string {
  const colors: Record<Priority, string> = {
    [Priority.LOW]: "bg-gray-500",
    [Priority.NORMAL]: "bg-yellow-500",
    [Priority.HIGH]: "bg-red-500",
  };
  return colors[priority];
}
