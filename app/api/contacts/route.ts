import { NextRequest, NextResponse } from "next/server";
import { contactService } from "@/services/contact-service";
import { CreateContactRequest } from "@/types/contact";

/**
 * POST /api/contacts
 * Tạo contact mới từ user (public endpoint)
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateContactRequest = await request.json();

    // Validate input
    if (!body.name || !body.email || !body.phone || !body.message) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          message: "Name, email, phone, and message are required",
        },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          error: "Invalid email",
          message: "Please provide a valid email address",
        },
        { status: 400 },
      );
    }

    // Create contact
    const contact = await contactService.createContact(body);

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message:
          error instanceof Error ? error.message : "Failed to create contact",
      },
      { status: 500 },
    );
  }
}
