import { Product, ProductTranslate } from "./product";

export type Order = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string;
  message: string | null;
  note: string | null;
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  couponCode: string | null;
  discountType: string | null;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  paidAt: Date | null;
  shippingMethod: string | null;
  trackingNumber: string | null;
  estimatedDelivery: Date | null;
  deliveredAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  cancelledAt: Date | null;
};

export enum OrderStatus {
  PENDING = 0,
  CONFIRMED = 1,
  PROCESSING = 2,
  SHIPPING = 3,
  DELIVERED = 4,
  RETURNING = 5,
  RETURNED = 6,
  CANCELLED = 7,
}

export enum PaymentStatus {
  UNPAID = 0,
  PENDING = 1,
  PAID = 2,
  REFUNDED = 3,
  FAILED = 4,
}

export type OrderDetail = {
  id: string;
  orderId: string;
  productId: string;
  price: number; // Giá tại thời điểm đặt hàng
  quantity: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  product: Product & { translates: ProductTranslate[] }; // Join với Product
};

export type OrderWithDetails = Order & {
  orderDetails: OrderDetail[];
};

export type CreateOrderInput = {
  name: string;
  phone: string;
  email?: string | null;
  address: string;
  message?: string | null;
  note?: string | null;
  subtotal: number;
  shippingFee: number;
  discount?: number;
  totalAmount: number;
  couponCode?: string | null;
  discountType?: string | null;
  paymentMethod?: string;
  shippingMethod?: string | null;
  orderDetails: Array<{
    productId: string;
    price: number; // Giá tại thời điểm đặt hàng
    quantity: number;
    totalPrice: number;
  }>;
};

export type UpdateOrderInput = {
  name?: string;
  phone?: string;
  email?: string | null;
  address?: string;
  message?: string | null;
  note?: string | null;
  shippingFee?: number;
  discount?: number;
  totalAmount?: number;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: string;
  paidAt?: Date | null;
  shippingMethod?: string | null;
  trackingNumber?: string | null;
  estimatedDelivery?: Date | null;
  deliveredAt?: Date | null;
  cancelledAt?: Date | null;
};
