import { NextRequest, NextResponse } from "next/server";
import { contactService } from "@/services/contact-service";
import { UpdateContactRequest } from "@/types/contact";

/**
 * GET /api/admin/contacts/:id
 * Lấy chi tiết contact theo ID (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const contact = await contactService.getContactById(params.id);

    if (!contact) {
      return NextResponse.json(
        {
          error: "Not found",
          message: "Contact not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(contact, { status: 200 });
  } catch (error) {
    console.error("Error fetching contact:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message:
          error instanceof Error ? error.message : "Failed to fetch contact",
      },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/admin/contacts/:id
 * Cập nhật contact (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body: UpdateContactRequest = await request.json();

    // Check if contact exists
    const existingContact = await contactService.getContactById(params.id);
    if (!existingContact) {
      return NextResponse.json(
        {
          error: "Not found",
          message: "Contact not found",
        },
        { status: 404 },
      );
    }

    // Update contact
    const contact = await contactService.updateContact(params.id, body);

    return NextResponse.json(contact, { status: 200 });
  } catch (error) {
    console.error("Error updating contact:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message:
          error instanceof Error ? error.message : "Failed to update contact",
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/contacts/:id
 * Xóa contact (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Check if contact exists
    const existingContact = await contactService.getContactById(params.id);
    if (!existingContact) {
      return NextResponse.json(
        {
          error: "Not found",
          message: "Contact not found",
        },
        { status: 404 },
      );
    }

    // Delete contact
    await contactService.deleteContact(params.id);

    return NextResponse.json(
      { message: "Contact deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message:
          error instanceof Error ? error.message : "Failed to delete contact",
      },
      { status: 500 },
    );
  }
}
