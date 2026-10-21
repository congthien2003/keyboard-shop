import {
  Order,
  OrderDetail,
  OrderWithDetails,
  CreateOrderInput,
  UpdateOrderInput,
  OrderStatus,
  PaymentStatus,
} from "@/types/order";
import { prisma } from "@/lib/prisma";

export type OrderResponse = OrderWithDetails;

const orderDetailInclude = {
  orderDetails: {
    include: {
      product: {
        include: {
          translates: true,
        },
      },
    },
  },
};

type OrderWithDetailsFromDB = Awaited<
  ReturnType<typeof prisma.order.findUnique>
> & {
  orderDetails: Array<
    {
      product: {
        translates: Array<any>;
      } & any;
    } & any
  >;
};

class OrderService {
  // Parse image JSON string to array
  private parseImage(image: string): string[] {
    try {
      return JSON.parse(image || "[]");
    } catch {
      return [];
    }
  }

  // Transform Prisma result to match OrderResponse type
  private transformOrder(order: any): OrderResponse {
    return {
      ...order,
      orderDetails: order.orderDetails.map((detail: any) => ({
        ...detail,
        product: {
          ...detail.product,
          image: this.parseImage(detail.product.image),
        },
      })),
    } as OrderResponse;
  }

  async createOrder(input: CreateOrderInput): Promise<OrderResponse> {
    const order = await prisma.order.create({
      data: {
        name: input.name,
        phone: input.phone,
        email: input.email || null,
        address: input.address,
        message: input.message || null,
        note: input.note || null,
        subtotal: input.subtotal,
        shippingFee: input.shippingFee,
        discount: input.discount || 0,
        totalAmount: input.totalAmount,
        couponCode: input.couponCode || null,
        discountType: input.discountType || null,
        orderStatus: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.UNPAID,
        paymentMethod: input.paymentMethod || "COD",
        shippingMethod: input.shippingMethod || null,
        orderDetails: {
          create: input.orderDetails.map((detail) => ({
            productId: detail.productId,
            price: detail.price,
            quantity: detail.quantity,
            totalPrice: detail.totalPrice,
          })),
        },
      },
      include: orderDetailInclude,
    });

    return this.transformOrder(order);
  }

  async getOrders(params?: {
    page?: number;
    pageSize?: number;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    search?: string;
  }): Promise<{ orders: OrderResponse[]; total: number }> {
    const {
      page = 1,
      pageSize = 20,
      status,
      paymentStatus,
      search,
    } = params || {};

    const where: any = {};

    if (status !== undefined) {
      where.orderStatus = status;
    }
    if (paymentStatus !== undefined) {
      where.paymentStatus = paymentStatus;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: orderDetailInclude,
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders: orders.map((order: any) => this.transformOrder(order)),
      total,
    };
  }

  async getOrderById(id: string): Promise<OrderResponse | null> {
    const order = await prisma.order.findUnique({
      where: { id },
      include: orderDetailInclude,
    });

    if (!order) return null;

    return this.transformOrder(order);
  }

  async updateOrder(
    id: string,
    input: UpdateOrderInput,
  ): Promise<OrderResponse> {
    const data: any = { ...input };

    if (input.paymentStatus === PaymentStatus.PAID && !input.paidAt) {
      data.paidAt = new Date();
    }

    if (input.orderStatus === OrderStatus.DELIVERED && !input.deliveredAt) {
      data.deliveredAt = new Date();
    }

    if (input.orderStatus === OrderStatus.CANCELLED && !input.cancelledAt) {
      data.cancelledAt = new Date();
    }

    const order = await prisma.order.update({
      where: { id },
      data,
      include: orderDetailInclude,
    });

    return this.transformOrder(order);
  }

  async deleteOrder(id: string): Promise<void> {
    await prisma.order.delete({
      where: { id },
    });
  }

  async getOrderStats(): Promise<any> {
    const [
      total,
      pending,
      processing,
      shipping,
      delivered,
      cancelled,
      revenueResult,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { orderStatus: OrderStatus.PENDING } }),
      prisma.order.count({ where: { orderStatus: OrderStatus.PROCESSING } }),
      prisma.order.count({ where: { orderStatus: OrderStatus.SHIPPING } }),
      prisma.order.count({ where: { orderStatus: OrderStatus.DELIVERED } }),
      prisma.order.count({ where: { orderStatus: OrderStatus.CANCELLED } }),
      prisma.order.aggregate({
        where: {
          orderStatus: OrderStatus.DELIVERED,
          paymentStatus: PaymentStatus.PAID,
        },
        _sum: {
          totalAmount: true,
        },
      }),
    ]);

    return {
      total,
      pending,
      processing,
      shipping,
      delivered,
      cancelled,
      totalRevenue: revenueResult._sum.totalAmount || 0,
    };
  }
}

// Export singleton instance
export const orderService = new OrderService();
