"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderWithDetails, OrderStatus, PaymentStatus } from "@/types/order";
import { useOrder } from "@/hooks/useOrder";
import Image from "next/image";

interface OrderDetailPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderWithDetails | null;
  onUpdate?: () => void;
}

export function OrderDetailPopup({
  open,
  onOpenChange,
  order,
  onUpdate,
}: OrderDetailPopupProps) {
  const { t, locale } = useI18n();
  const { updateOrder, loading } = useOrder();
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState(order);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED:
        return "bg-green-100 text-green-700";
      case OrderStatus.SHIPPING:
        return "bg-blue-100 text-blue-700";
      case OrderStatus.PROCESSING:
        return "bg-purple-100 text-purple-700";
      case OrderStatus.CONFIRMED:
        return "bg-cyan-100 text-cyan-700";
      case OrderStatus.PENDING:
        return "bg-yellow-100 text-yellow-700";
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-700";
      case OrderStatus.RETURNING:
        return "bg-orange-100 text-orange-700";
      case OrderStatus.RETURNED:
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "Chờ xác nhận";
      case OrderStatus.CONFIRMED:
        return "Đã xác nhận";
      case OrderStatus.PROCESSING:
        return "Đang chuẩn bị";
      case OrderStatus.SHIPPING:
        return "Đang giao";
      case OrderStatus.DELIVERED:
        return "Đã giao";
      case OrderStatus.RETURNING:
        return "Đang hoàn";
      case OrderStatus.RETURNED:
        return "Đã hoàn";
      case OrderStatus.CANCELLED:
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return "bg-green-100 text-green-700";
      case PaymentStatus.PENDING:
        return "bg-yellow-100 text-yellow-700";
      case PaymentStatus.UNPAID:
        return "bg-gray-100 text-gray-700";
      case PaymentStatus.REFUNDED:
        return "bg-blue-100 text-blue-700";
      case PaymentStatus.FAILED:
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentStatusText = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.UNPAID:
        return "Chưa thanh toán";
      case PaymentStatus.PENDING:
        return "Đang xử lý";
      case PaymentStatus.PAID:
        return "Đã thanh toán";
      case PaymentStatus.REFUNDED:
        return "Đã hoàn tiền";
      case PaymentStatus.FAILED:
        return "Thất bại";
      default:
        return "Không xác định";
    }
  };

  const handleSave = async () => {
    if (!editedOrder) return;

    const updated = await updateOrder(editedOrder.id, {
      name: editedOrder.name,
      phone: editedOrder.phone,
      email: editedOrder.email,
      address: editedOrder.address,
      note: editedOrder.note,
      orderStatus: editedOrder.orderStatus,
      paymentStatus: editedOrder.paymentStatus,
      shippingMethod: editedOrder.shippingMethod,
      trackingNumber: editedOrder.trackingNumber,
    });

    if (updated) {
      setIsEditing(false);
      onUpdate?.();
    }
  };

  if (!order) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          setIsEditing(false);
          setEditedOrder(order);
        }
        onOpenChange(newOpen);
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Chi tiết đơn hàng - {order.id}</DialogTitle>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditing(true);
                    setEditedOrder(order);
                  }}
                >
                  Chỉnh sửa
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedOrder(order);
                    }}
                  >
                    Hủy
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={loading}>
                    {loading ? "Đang lưu..." : "Lưu"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin khách hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Họ tên</p>
                  {isEditing ? (
                    <Input
                      value={editedOrder?.name || ""}
                      onChange={(e) =>
                        setEditedOrder(
                          editedOrder
                            ? {
                                ...editedOrder,
                                name: e.target.value,
                              }
                            : null,
                        )
                      }
                    />
                  ) : (
                    <p className="font-medium">{order.name}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Số điện thoại
                  </p>
                  {isEditing ? (
                    <Input
                      value={editedOrder?.phone || ""}
                      onChange={(e) =>
                        setEditedOrder(
                          editedOrder
                            ? {
                                ...editedOrder,
                                phone: e.target.value,
                              }
                            : null,
                        )
                      }
                    />
                  ) : (
                    <p className="font-medium">{order.phone}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={editedOrder?.email || ""}
                      onChange={(e) =>
                        setEditedOrder(
                          editedOrder
                            ? {
                                ...editedOrder,
                                email: e.target.value,
                              }
                            : null,
                        )
                      }
                    />
                  ) : (
                    <p className="font-medium">{order.email || "N/A"}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">Địa chỉ</p>
                  {isEditing ? (
                    <Textarea
                      value={editedOrder?.address || ""}
                      onChange={(e) =>
                        setEditedOrder(
                          editedOrder
                            ? {
                                ...editedOrder,
                                address: e.target.value,
                              }
                            : null,
                        )
                      }
                      rows={3}
                    />
                  ) : (
                    <p className="font-medium">{order.address}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Status & Shipping */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trạng thái & Vận chuyển</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Trạng thái đơn hàng
                  </p>
                  {isEditing ? (
                    <Select
                      value={editedOrder?.orderStatus.toString()}
                      onValueChange={(value) =>
                        setEditedOrder(
                          editedOrder
                            ? {
                                ...editedOrder,
                                orderStatus: parseInt(value) as OrderStatus,
                              }
                            : null,
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={OrderStatus.PENDING.toString()}>
                          Chờ xác nhận
                        </SelectItem>
                        <SelectItem value={OrderStatus.CONFIRMED.toString()}>
                          Đã xác nhận
                        </SelectItem>
                        <SelectItem value={OrderStatus.PROCESSING.toString()}>
                          Đang chuẩn bị
                        </SelectItem>
                        <SelectItem value={OrderStatus.SHIPPING.toString()}>
                          Đang giao
                        </SelectItem>
                        <SelectItem value={OrderStatus.DELIVERED.toString()}>
                          Đã giao
                        </SelectItem>
                        <SelectItem value={OrderStatus.RETURNING.toString()}>
                          Đang hoàn
                        </SelectItem>
                        <SelectItem value={OrderStatus.RETURNED.toString()}>
                          Đã hoàn
                        </SelectItem>
                        <SelectItem value={OrderStatus.CANCELLED.toString()}>
                          Đã hủy
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        order.orderStatus,
                      )}`}
                    >
                      {getStatusText(order.orderStatus)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Trạng thái thanh toán
                  </p>
                  {isEditing ? (
                    <Select
                      value={editedOrder?.paymentStatus.toString()}
                      onValueChange={(value) =>
                        setEditedOrder(
                          editedOrder
                            ? {
                                ...editedOrder,
                                paymentStatus: parseInt(value) as PaymentStatus,
                              }
                            : null,
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={PaymentStatus.UNPAID.toString()}>
                          Chưa thanh toán
                        </SelectItem>
                        <SelectItem value={PaymentStatus.PENDING.toString()}>
                          Đang xử lý
                        </SelectItem>
                        <SelectItem value={PaymentStatus.PAID.toString()}>
                          Đã thanh toán
                        </SelectItem>
                        <SelectItem value={PaymentStatus.REFUNDED.toString()}>
                          Đã hoàn tiền
                        </SelectItem>
                        <SelectItem value={PaymentStatus.FAILED.toString()}>
                          Thất bại
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStatusColor(
                        order.paymentStatus,
                      )}`}
                    >
                      {getPaymentStatusText(order.paymentStatus)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Phương thức vận chuyển
                  </p>
                  {isEditing ? (
                    <Input
                      value={editedOrder?.shippingMethod || ""}
                      onChange={(e) =>
                        setEditedOrder(
                          editedOrder
                            ? {
                                ...editedOrder,
                                shippingMethod: e.target.value,
                              }
                            : null,
                        )
                      }
                      placeholder="VD: Giao hàng nhanh"
                    />
                  ) : (
                    <p className="font-medium">
                      {order.shippingMethod || order.paymentMethod}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Mã vận đơn
                  </p>
                  {isEditing ? (
                    <Input
                      value={editedOrder?.trackingNumber || ""}
                      onChange={(e) =>
                        setEditedOrder(
                          editedOrder
                            ? {
                                ...editedOrder,
                                trackingNumber: e.target.value,
                              }
                            : null,
                        )
                      }
                      placeholder="Nhập mã vận đơn"
                    />
                  ) : (
                    <p className="font-medium">
                      {order.trackingNumber || "N/A"}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Sản phẩm ({order.orderDetails.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.orderDetails.map((item) => {
                  const productTranslate =
                    item.product.translates.find((t) => t.lang === locale) ||
                    item.product.translates[0];
                  const productName =
                    productTranslate?.name || "Sản phẩm không tên";
                  const productUnit = productTranslate?.unit || "";

                  return (
                    <div
                      key={item.id}
                      className="flex gap-4 pb-4 border-b last:border-0"
                    >
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                        <Image
                          src={item.product.thumbnail}
                          alt={productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{productName}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.price.toLocaleString("vi-VN")}
                          đ/{productUnit} x {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-primary mt-1">
                          {item.totalPrice.toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tổng kết</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{order.subtotal.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>{order.shippingFee.toLocaleString("vi-VN")}đ</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Giảm giá</span>
                  <span>-{order.discount.toLocaleString("vi-VN")}đ</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Tổng cộng</span>
                <span className="text-primary">
                  {order.totalAmount.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {(order.message || order.note || isEditing) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ghi chú</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.message && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Lời nhắn từ khách hàng
                    </p>
                    <p className="font-medium">{order.message}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Ghi chú nội bộ
                  </p>
                  {isEditing ? (
                    <Textarea
                      value={editedOrder?.note || ""}
                      onChange={(e) =>
                        setEditedOrder(
                          editedOrder
                            ? {
                                ...editedOrder,
                                note: e.target.value,
                              }
                            : null,
                        )
                      }
                      rows={3}
                      placeholder="Nhập ghi chú nội bộ..."
                    />
                  ) : (
                    <p className="font-medium">{order.note || "N/A"}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin thời gian</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Ngày tạo</p>
                  <p className="font-medium">
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cập nhật lần cuối</p>
                  <p className="font-medium">
                    {new Date(order.updatedAt).toLocaleString("vi-VN")}
                  </p>
                </div>
                {order.paidAt && (
                  <div>
                    <p className="text-muted-foreground">Ngày thanh toán</p>
                    <p className="font-medium">
                      {new Date(order.paidAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                )}
                {order.deliveredAt && (
                  <div>
                    <p className="text-muted-foreground">Ngày giao hàng</p>
                    <p className="font-medium">
                      {new Date(order.deliveredAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
