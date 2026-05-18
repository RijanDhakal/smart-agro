import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Bounded from "./landing/Bounded";
import StarGrid from "./landing/StarGrid";
import { useUser } from "@/context/UserContext";
import { extractNumericValue, formatSmartValue } from "@/lib/formatSmartValue";
import {
  ShoppingBag,
  TrendingUp,
  Users,
  Package,
  Eye,
  MapPin,
  Phone,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { DashboardStats, FarmerOrder } from "@/types/Order";
import Loader from "@/components/shared/Loader";
import { API_BASE_URL } from "@/config/apiDetails";
import axios from "axios";
import type { FarmerResponse } from "@/types/FarmerDashboard";

function FarmerDashboard() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [orders, setOrders] = useState<FarmerOrder[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    orderRequests: 0,
    turnover: 0,
    customers: 0,
    delivered: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get<{ data: FarmerResponse }>(
          `${API_BASE_URL}/users/getFarmerSoldProducts/${user.id}`
        );

        console.log("Fetched dashboard data:", response.data.data);

        const farmerData = response.data.data;

        const transformedOrders: FarmerOrder[] = [];

        farmerData.products.forEach((product) => {
          product.order.forEach((order) => {
            transformedOrders.push({
              orderId: order.orderId,
              customerName: order.user.username,
              productName: product.productName,
              quantity: order.quantity,
              price: product.price,
              status: order.orderStatus.toLowerCase() as FarmerOrder["status"],
              customerContact: order.user.contact,
              paymentMethod: order.PaymentMethod.toLowerCase() as
                | "cod"
                | "esewa",
              orderDate: new Date().toISOString(),
              deliveryAddress: order.address,
            });
          });
        });

        console.log("Transformed orders:", transformedOrders);
        setOrders(transformedOrders);

        const totalEntries = transformedOrders.length;
        const deliveredOrders = transformedOrders.filter(
          (order) => order.status === "delivered"
        ).length;
        const totalTurnover = transformedOrders.reduce((sum, order) => {
          const price = extractNumericValue(order.price.toString());
          return sum + price * order.quantity;
        }, 0);
        const uniqueCustomers = new Set(
          transformedOrders.map((order) => order.customerName)
        ).size;

        setStats({
          orderRequests: totalEntries,
          turnover: totalTurnover,
          customers: uniqueCustomers,
          delivered: deliveredOrders,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to fetch dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, navigate]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId
            ? { ...order, status: newStatus as FarmerOrder["status"] }
            : order
        )
      );

      toast.success("Order status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status: FarmerOrder["status"]) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "confirmed":
        return "bg-indigo-100 text-indigo-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "ordered":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (isLoading) {
    return (
      <Bounded className="pt-0!">
        <StarGrid />
        <Loader></Loader>
      </Bounded>
    );
  }

  if (!user || !user.username) {
    navigate("/login");
    toast.error("Please log in to access dashboard.");
    return;
  }

  if (user.identity !== "farmer") {
    navigate("/home");
    toast.error("Access denied. Farmers only.");
    return;
  }

  return (
    <Bounded className="min-h-screen pb-20">
      <StarGrid />
      <div className="w-full max-w-7xl mx-auto py-6 px-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Farmer Dashboard
        </h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Order Requests</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.orderRequests}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Turnover</p>
                <p className="text-2xl font-semibold text-gray-900">
                  रू. {formatSmartValue(stats.turnover)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Customers</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.customers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Delivered</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.delivered}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Order Management
            </h2>
          </div>

          <div className="lg:hidden divide-y divide-gray-200">
            {orders.map((order) => (
              <div key={order.orderId} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">
                    {order.orderId.slice(0, 8)}...
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-900">{order.customerName}</p>
                  <p className="text-sm text-gray-600">{order.productName}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Qty: {order.quantity}</span>
                    <span>
                      रू. {formatSmartValue(order.price)} × {order.quantity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 capitalize">
                    {order.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : "eSewa"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Select
                    value={order.status}
                    onValueChange={(value) =>
                      handleStatusChange(order.orderId, value)
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ordered">Ordered</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Eye className="w-5 h-5 text-gray-600" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-600 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-gray-900 mb-2">
                              Delivery Address
                            </h4>
                            <p className="text-sm text-gray-600">
                              {order.deliveryAddress}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 pt-2 border-t border-gray-200">
                          <Phone className="w-4 h-4 text-gray-600 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-gray-900 mb-1">
                              Contact
                            </h4>
                            <p className="text-sm text-gray-600">
                              {order.customerContact}
                            </p>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.orderId.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      रू. {formatSmartValue(order.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {order.paymentMethod === "cod" ? "COD" : "eSewa"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Select
                        value={order.status}
                        onValueChange={(value) =>
                          handleStatusChange(order.orderId, value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ordered">Ordered</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium cursor-pointer">
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-3">
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-gray-600 mt-0.5" />
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm text-gray-900 mb-2">
                                  Delivery Address
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {order.deliveryAddress}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 pt-2 border-t border-gray-200">
                              <Phone className="w-4 h-4 text-gray-600 mt-0.5" />
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm text-gray-900 mb-1">
                                  Contact
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {order.customerContact}
                                </p>
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Bounded>
  );
}

export default FarmerDashboard;
