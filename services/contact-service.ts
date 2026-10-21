import { prisma } from "@/lib/prisma";
import {
  Contact,
  ContactStatus,
  Priority,
  CreateContactRequest,
  UpdateContactRequest,
  ContactListParams,
} from "@/types/contact";

export type ContactResponse = Contact;

class ContactService {
  /**
   * Tạo contact mới từ user (POST /api/contacts)
   */
  async createContact(input: CreateContactRequest): Promise<ContactResponse> {
    const contact = await prisma.contact.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        message: input.message,
        status: ContactStatus.OPEN, // Mặc định là chưa xử lý
        priority: Priority.NORMAL, // Mặc định là ưu tiên bình thường
      },
    });

    return contact;
  }

  /**
   * Lấy danh sách contacts với filter và pagination (GET /api/admin/contacts)
   */
  async getContacts(params?: ContactListParams): Promise<{
    contacts: ContactResponse[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      priority,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params || {};

    // Build where clause
    const where: any = {};

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    // Status filter
    if (status !== undefined) {
      where.status = status;
    }

    // Priority filter
    if (priority !== undefined) {
      where.priority = priority;
    }

    // Count total
    const total = await prisma.contact.count({ where });

    // Fetch contacts
    const contacts = await prisma.contact.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      contacts,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Lấy contact theo ID (GET /api/admin/contacts/:id)
   */
  async getContactById(id: string): Promise<ContactResponse | null> {
    const contact = await prisma.contact.findUnique({
      where: { id },
    });

    return contact;
  }

  /**
   * Cập nhật contact (PUT /api/admin/contacts/:id)
   */
  async updateContact(
    id: string,
    input: UpdateContactRequest,
  ): Promise<ContactResponse> {
    const data: any = {};

    if (input.status !== undefined) {
      data.status = input.status;
    }

    if (input.note !== undefined) {
      data.note = input.note;
    }

    if (input.priority !== undefined) {
      data.priority = input.priority;
    }

    const contact = await prisma.contact.update({
      where: { id },
      data,
    });

    return contact;
  }

  /**
   * Xóa contact (DELETE /api/admin/contacts/:id)
   */
  async deleteContact(id: string): Promise<void> {
    await prisma.contact.delete({
      where: { id },
    });
  }

  /**
   * Lấy tất cả contacts (không phân trang)
   */
  async getAllContacts(): Promise<ContactResponse[]> {
    const contacts = await prisma.contact.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return contacts;
  }

  /**
   * Đếm số lượng contacts theo status
   */
  async getContactStats(): Promise<{
    total: number;
    open: number;
    inProgress: number;
    closed: number;
  }> {
    const [total, open, inProgress, closed] = await Promise.all([
      prisma.contact.count(),
      prisma.contact.count({
        where: { status: ContactStatus.OPEN },
      }),
      prisma.contact.count({
        where: { status: ContactStatus.IN_PROGRESS },
      }),
      prisma.contact.count({
        where: { status: ContactStatus.CLOSED },
      }),
    ]);

    return {
      total,
      open,
      inProgress,
      closed,
    };
  }
}

// Export singleton instance
export const contactService = new ContactService();
