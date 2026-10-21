import { NextRequest, NextResponse } from "next/server";
import { contactService } from "@/services/contact-service";
import { ContactListParams } from "@/types/contact";

/**
 * GET /api/admin/contacts
 * Lấy danh sách contacts với filter và pagination (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const params: ContactListParams = {
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!)
        : 10,
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status")
        ? parseInt(searchParams.get("status")!)
        : undefined,
      priority: searchParams.get("priority")
        ? parseInt(searchParams.get("priority")!)
        : undefined,
      sortBy: (searchParams.get("sortBy") as any) || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as any) || "desc",
    };

    const result = await contactService.getContacts(params);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message:
          error instanceof Error ? error.message : "Failed to fetch contacts",
      },
      { status: 500 },
    );
  }
}
