import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/services/order-service";
import { CreateOrderInput, OrderStatus, PaymentStatus } from "@/types/order";

// GET /api/orders - List orders with filters and pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const status = searchParams.get("status");
    const paymentStatus = searchParams.get("paymentStatus");
    const search = searchParams.get("search");

    const params: any = {
      page,
      pageSize,
      search: search || undefined,
    };

    if (status !== null && status !== "all") {
      params.status = parseInt(status) as OrderStatus;
    }

    if (paymentStatus !== null && paymentStatus !== "all") {
      params.paymentStatus = parseInt(paymentStatus) as PaymentStatus;
    }

    const result = await orderService.getOrders(params);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderInput = await request.json();

    // Validate required fields
    if (!body.name || !body.phone || !body.address) {
      return NextResponse.json(
        { error: "Missing required fields: name, phone, address" },
        { status: 400 },
      );
    }

    if (!body.orderDetails || body.orderDetails.length === 0) {
      return NextResponse.json(
        { error: "Order must have at least one item" },
        { status: 400 },
      );
    }

    const order = await orderService.createOrder(body);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
