import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/services/order-service";

// GET /api/orders/stats - Get order statistics
export async function GET(request: NextRequest) {
  try {
    const stats = await orderService.getOrderStats();

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching order stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch order statistics" },
      { status: 500 },
    );
  }
}
