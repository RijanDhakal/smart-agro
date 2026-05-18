import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Bounded from "./landing/Bounded";
import StarGrid from "./landing/StarGrid";
import { useUser } from "@/context/UserContext";
import { extractNumericValue, formatSmartValue } from "@/lib/formatSmartValue";
import { Package, ChevronRight } from "lucide-react";
import type { Order } from "@/types/Order";
import Loader from "@/components/shared/Loader";
import axios from "axios";
import { API_BASE_URL } from "@/config/apiDetails";
import Button from "@/components/shared/Button";

function Orders() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchOrders = async () => {
      try {
        const userOrders = await axios.get(
          `${API_BASE_URL}/users/getorders/${user.id}`
        );
        console.log("Fetched orders:", userOrders.data.data);
        setOrders(userOrders.data.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user.id]);

  const getStatusColor = (status: Order["orderStatus"]) => {
    switch (status) {
      case "delivered":
        return "text-green-600";
      case "shipped":
        return "text-blue-600";
      case "confirmed":
        return "text-indigo-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  const getStatusText = (status: Order["orderStatus"]) => {
    switch (status) {
      case "delivered":
        return "Delivered";
      case "shipped":
        return "Shipped";
      case "confirmed":
        return "Confirmed";
      case "cancelled":
        return "Cancelled";
      default:
        return "Pending";
    }
  };

  const calculateOrderTotal = (order: Order) => {
    const price = extractNumericValue(order.Product.price);
    return price * order.quantity;
  };

  if (isLoading) {
    return (
      <Bounded className="pt-0!">
        <StarGrid />
        <Loader></Loader>
      </Bounded>
    );
  }

  if (orders.length === 0) {
    return (
      <Bounded className="min-h-screen">
        <StarGrid />
        <div className="h-full w-full flex flex-col items-center justify-center py-20">
          <Package className="h-24 w-24 text-gray-300" strokeWidth={1} />
          <h2 className="mt-6 text-2xl font-semibold text-gray-900">
            No orders yet
          </h2>
          <p className="mt-2 text-gray-600 text-center max-w-md">
            You haven't placed any orders yet. Start shopping to see your orders
            here.
          </p>
          <Button
            title="Start Shopping"
            onClick={() => navigate("/home")}
            containerClass="mt-6 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          ></Button>
        </div>
      </Bounded>
    );
  }

  if (!user || !user.username) {
    navigate("/login");
    toast.error("Please log in to view orders.");
    return;
  }

  return (
    <Bounded className="min-h-screen pb-20">
      <StarGrid />
      <div className="w-full max-w-4xl mx-auto py-6 px-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">My Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-500">
                      Order #{order.orderId.slice(0, 12)}
                    </p>
                    <p className="text-xs text-gray-500">Placed recently</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      &middot; {getStatusText(order.orderStatus)}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="p-4 flex gap-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/product/${order.productId}`)}
              >
                <img
                  src={order.Product.productImage}
                  alt={order.Product.productName}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2">
                    {order.Product.productName}
                  </h3>
                  <div className="mt-1 flex items-center gap-3 text-sm text-gray-600">
                    <span>Qty: {order.quantity}</span>
                    <span>&middot;</span>
                    <span className="font-medium">
                      {formatSmartValue(order.Product.price).includes("रू")
                        ? formatSmartValue(order.Product.price)
                        : "रू. " + formatSmartValue(order.Product.price)}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 shrink-0 self-center" />
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-600">
                      Payment:{" "}
                      {order.PaymentMethod === "cod"
                        ? "Cash on Delivery"
                        : "eSewa"}
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-1">
                      {order.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Total:</span>
                    <span className="text-lg font-semibold text-gray-900">
                      रू. {formatSmartValue(calculateOrderTotal(order))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Bounded>
  );
}

export default Orders;
