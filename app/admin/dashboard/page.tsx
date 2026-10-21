"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/contexts/admin-context";
import { useI18n } from "@/lib/i18n";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  Newspaper,
  ShoppingCart,
  MessageSquare,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
} from "lucide-react";

export default function AdminDashboard() {
  const { isAuthenticated } = useAdmin();
  const router = useRouter();
  const { t } = useI18n();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const stats = [
    {
      title: t("admin.dashboard.totalProducts") || "Tổng sản phẩm",
      value: "248",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      trend: "+12%",
    },
    {
      title: t("admin.dashboard.totalOrders") || "Đơn hàng",
      value: "1,234",
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-100",
      trend: "+23%",
    },
    {
      title: t("admin.dashboard.totalRevenue") || "Doanh thu",
      value: "₫125M",
      icon: DollarSign,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      trend: "+18%",
    },
    {
      title: t("admin.dashboard.totalContacts") || "Liên hệ",
      value: "89",
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      trend: "+5%",
    },
    {
      title: t("admin.dashboard.totalNews") || "Tin tức",
      value: "45",
      icon: Newspaper,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      trend: "+8%",
    },
    {
      title: t("admin.dashboard.activeUsers") || "Khách truy cập",
      value: "2,543",
      icon: Users,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
      trend: "+15%",
    },
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "Nguyễn Văn A",
      total: "₫1,250,000",
      status: "completed",
      date: "2025-11-02",
    },
    {
      id: "ORD-002",
      customer: "Trần Thị B",
      total: "₫850,000",
      status: "processing",
      date: "2025-11-02",
    },
    {
      id: "ORD-003",
      customer: "Lê Văn C",
      total: "₫2,100,000",
      status: "completed",
      date: "2025-11-01",
    },
    {
      id: "ORD-004",
      customer: "Phạm Thị D",
      total: "₫650,000",
      status: "pending",
      date: "2025-11-01",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return t("admin.orders.completed") || "Hoàn thành";
      case "processing":
        return t("admin.orders.processing") || "Đang xử lý";
      case "pending":
        return t("admin.orders.pending") || "Chờ xử lý";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      <div className="lg:pl-64">
        <AdminHeader
          title={t("admin.dashboard.title") || "Dashboard"}
          subtitle={t("admin.dashboard.subtitle") || "Tổng quan hệ thống"}
        />

        <main className="pt-[100px] min-h-screen overflow-y-auto">
          <div className="p-6 lg:p-8 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-shadow duration-200"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {stat.title}
                          </p>
                          <p className="text-3xl font-bold">{stat.value}</p>
                          <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            {stat.trend}
                          </p>
                        </div>
                        <div className={`${stat.bgColor} p-4 rounded-full`}>
                          <Icon className={`h-8 w-8 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  {t("admin.dashboard.recentOrders") || "Đơn hàng gần đây"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-sm">
                          {t("admin.orders.orderId") || "Mã đơn"}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm">
                          {t("admin.orders.customer") || "Khách hàng"}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm">
                          {t("admin.orders.total") || "Tổng tiền"}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm">
                          {t("admin.orders.status") || "Trạng thái"}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm">
                          {t("admin.orders.date") || "Ngày"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-3 px-4 font-medium">{order.id}</td>
                          <td className="py-3 px-4">{order.customer}</td>
                          <td className="py-3 px-4 font-semibold text-primary">
                            {order.total}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                order.status,
                              )}`}
                            >
                              {getStatusText(order.status)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {order.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
