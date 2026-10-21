"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/contexts/admin-context";
import { useI18n } from "@/lib/i18n";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { OrderDetailPopup } from "@/components/admin/popups/order-detail-popup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, Package, Trash2 } from "lucide-react";
import { useOrder } from "@/hooks/useOrder";
import { OrderWithDetails, OrderStatus, PaymentStatus } from "@/types/order";

export default function OrdersPage() {
  const { isAuthenticated } = useAdmin();
  const router = useRouter();
  const { t, locale } = useI18n();
  const { getOrders, updateOrder, deleteOrder, loading } = useOrder();
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }
    loadOrders();
  }, [
    isAuthenticated,
    router,
    page,
    filterStatus,
    filterPaymentStatus,
    searchQuery,
  ]);

  const loadOrders = async () => {
    const result = await getOrders({
      page,
      pageSize,
      status:
        filterStatus === "all"
          ? "all"
          : (parseInt(filterStatus) as OrderStatus),
      paymentStatus:
        filterPaymentStatus === "all"
          ? "all"
          : (parseInt(filterPaymentStatus) as PaymentStatus),
      search: searchQuery || undefined,
    });

    if (result) {
      setOrders(result.orders);
      setTotal(result.total);
    }
  };

  const handleViewOrder = (order: OrderWithDetails) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleUpdateStatus = async (
    orderId: string,
    orderStatus: OrderStatus,
  ) => {
    const updated = await updateOrder(orderId, { orderStatus });
    if (updated) {
      loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus });
      }
    }
  };

  const handleUpdatePaymentStatus = async (
    orderId: string,
    paymentStatus: PaymentStatus,
  ) => {
    const updated = await updateOrder(orderId, { paymentStatus });
    if (updated) {
      loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, paymentStatus });
      }
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
      const success = await deleteOrder(orderId);
      if (success) {
        loadOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setIsDialogOpen(false);
          setSelectedOrder(null);
        }
      }
    }
  };

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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      <div className="lg:pl-64">
        <AdminHeader
          title={t("admin.orders.title") || "Quản lý đơn hàng"}
          subtitle={t("admin.orders.subtitle") || `Tổng ${total} đơn hàng`}
        />

        <main className="pt-[100px] min-h-screen overflow-y-auto">
          <div className="p-6 lg:p-8">
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={
                    t("admin.orders.search") || "Tìm kiếm đơn hàng..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Trạng thái đơn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
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
              <Select
                value={filterPaymentStatus}
                onValueChange={setFilterPaymentStatus}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Thanh toán" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
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
            </div>

            {/* Orders Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left py-4 px-4 font-semibold text-sm">
                          {t("admin.orders.customer") || "Khách hàng"}
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-sm">
                          {t("admin.orders.phone") || "Số điện thoại"}
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-sm">
                          {t("admin.orders.total") || "Tổng tiền"}
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-sm">
                          {t("admin.orders.status") || "Trạng thái"}
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-sm">
                          {t("admin.orders.date") || "Ngày"}
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-sm">
                          {t("admin.actions") || "Thao tác"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-t hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium">{order.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {order.email || "N/A"}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-4">{order.phone}</td>
                          <td className="py-4 px-4 font-semibold text-primary">
                            {order.totalAmount.toLocaleString("vi-VN")}đ
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col gap-2">
                              <Select
                                value={order.orderStatus.toString()}
                                onValueChange={(value) =>
                                  handleUpdateStatus(
                                    order.id,
                                    parseInt(value) as OrderStatus,
                                  )
                                }
                              >
                                <SelectTrigger
                                  className={`w-36 text-xs ${getStatusColor(
                                    order.orderStatus,
                                  )}`}
                                >
                                  <SelectValue>
                                    {getStatusText(order.orderStatus)}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem
                                    value={OrderStatus.PENDING.toString()}
                                  >
                                    Chờ xác nhận
                                  </SelectItem>
                                  <SelectItem
                                    value={OrderStatus.CONFIRMED.toString()}
                                  >
                                    Đã xác nhận
                                  </SelectItem>
                                  <SelectItem
                                    value={OrderStatus.PROCESSING.toString()}
                                  >
                                    Đang chuẩn bị
                                  </SelectItem>
                                  <SelectItem
                                    value={OrderStatus.SHIPPING.toString()}
                                  >
                                    Đang giao
                                  </SelectItem>
                                  <SelectItem
                                    value={OrderStatus.DELIVERED.toString()}
                                  >
                                    Đã giao
                                  </SelectItem>
                                  <SelectItem
                                    value={OrderStatus.RETURNING.toString()}
                                  >
                                    Đang hoàn
                                  </SelectItem>
                                  <SelectItem
                                    value={OrderStatus.RETURNED.toString()}
                                  >
                                    Đã hoàn
                                  </SelectItem>
                                  <SelectItem
                                    value={OrderStatus.CANCELLED.toString()}
                                  >
                                    Đã hủy
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <Select
                                value={order.paymentStatus.toString()}
                                onValueChange={(value) =>
                                  handleUpdatePaymentStatus(
                                    order.id,
                                    parseInt(value) as PaymentStatus,
                                  )
                                }
                              >
                                <SelectTrigger
                                  className={`w-36 text-xs ${getPaymentStatusColor(
                                    order.paymentStatus,
                                  )}`}
                                >
                                  <SelectValue>
                                    {getPaymentStatusText(order.paymentStatus)}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem
                                    value={PaymentStatus.UNPAID.toString()}
                                  >
                                    Chưa thanh toán
                                  </SelectItem>
                                  <SelectItem
                                    value={PaymentStatus.PENDING.toString()}
                                  >
                                    Đang xử lý
                                  </SelectItem>
                                  <SelectItem
                                    value={PaymentStatus.PAID.toString()}
                                  >
                                    Đã thanh toán
                                  </SelectItem>
                                  <SelectItem
                                    value={PaymentStatus.REFUNDED.toString()}
                                  >
                                    Đã hoàn tiền
                                  </SelectItem>
                                  <SelectItem
                                    value={PaymentStatus.FAILED.toString()}
                                  >
                                    Thất bại
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString(
                              "vi-VN",
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => handleViewOrder(order)}
                              >
                                <Eye className="h-4 w-4" />
                                Xem
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteOrder(order.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {loading && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Đang tải...</p>
                  </div>
                )}

                {!loading && orders.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {t("admin.orders.noData") || "Chưa có đơn hàng nào"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Order Detail Popup */}
      <OrderDetailPopup
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        order={selectedOrder}
        onUpdate={loadOrders}
      />
    </div>
  );
}
