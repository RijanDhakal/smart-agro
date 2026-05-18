import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Bounded from "./landing/Bounded";
import StarGrid from "./landing/StarGrid";
import { useCart } from "@/hooks/useCart";
import { useUser } from "@/context/UserContext";
import { formatSmartValue } from "@/lib/formatSmartValue";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import InputField from "@/components/shared/InputField";
import Button from "@/components/shared/Button";
import { FaCity, FaFlagCheckered } from "react-icons/fa6";
import axios from "axios";
import { API_BASE_URL } from "@/config/apiDetails";

interface DeliveryAddress {
  country: string;
  province: string;
  district: string;
  address: string;
}

function Checkout() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } =
    useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "esewa">("cod");
  const [address, setAddress] = useState<DeliveryAddress>({
    country: "Nepal",
    province: "",
    district: "",
    address: "",
  });

  if (!user || !user.username) {
    navigate("/login");
    toast.error("Please log in to checkout.");
    return null;
  }

  const handleInputChange = (field: keyof DeliveryAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsLoading(true);

    try {
      const orderData = {
        // items: cart.map((item) => ({
        //   productId: item.product.productId,
        //   quantity: item.quantity,
        //   price: item.product.price,
        // })),
        productId: cart[0].product.productId,
        quantity: cart[0].quantity,
        address: `${address.address}, ${address.district}, ${address.province}, ${address.country}`,
        // totalAmount: getTotalPrice(),
        userId: user?.id,
        paymentMethod,
      };

      console.log("Order data:", orderData);

      if (paymentMethod === "esewa") {
        toast.info("Redirecting to eSewa...");
        // TODO: Backend
      }

      const response = axios.post(`${API_BASE_URL}/products/order`, orderData);
      console.log(response);

      toast.success("Order placed successfully!");
      clearCart();
      navigate("/home");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Bounded className="h-[calc(100vh-1px)] w-[calc(100vw-1px)] flex flex-row items-center justify-center">
        <StarGrid />
        <div className="h-full w-full space-y-4 flex flex-col items-center justify-center">
          <ShoppingCart className="h-32 w-32 text-gray-300" strokeWidth={1} />
          <h2 className="text-2xl font-semibold">Your cart is empty</h2>
          <p className="text-gray-600">Add some products to get started</p>
          <Button
            title="Continue Shopping"
            onClick={() => navigate("/home")}
            containerClass="mt-4"
          />
        </div>
      </Bounded>
    );
  }

  return (
    <Bounded>
      <StarGrid />
      <div className="h-full w-full flex flex-col items-center justify-start py-8">
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
          <h1 className="text-3xl font-semibold">Checkout</h1>

          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold">Your Cart</h2>

            <div className="flex flex-col gap-3">
              {cart.map((item) => (
                <div
                  key={item.product.productId}
                  className="flex flex-row gap-4 p-4 border border-gray-200 rounded-lg"
                >
                  <img
                    src={item.product.productImage}
                    alt={item.product.productName}
                    className="w-20 h-20 object-cover rounded-md"
                  />

                  <div className="flex-1 flex flex-col gap-1">
                    <h3 className="font-semibold text-base">
                      {item.product.productName}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {item.product.description}
                    </p>
                    <p className="text-sm font-medium">
                      {formatSmartValue(item.product.price).includes("रू")
                        ? formatSmartValue(item.product.price)
                        : "रू. " + formatSmartValue(item.product.price)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.product.productId)}
                      className="text-destructive/80 hover:text-destructive transition-colors cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex flex-row items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.productId,
                            item.quantity - 1
                          )
                        }
                        className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.productId,
                            item.quantity + 1
                          )
                        }
                        className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <form onSubmit={handlePlaceOrder} className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold">Delivery Address</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Country
                </label>
                <InputField
                  name="country"
                  icon={<FaFlagCheckered />}
                  value={address.country}
                  onChange={(value) => handleInputChange("country", value)}
                  required
                  placeholder="Nepal"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Province
                </label>
                <InputField
                  name="province"
                  icon={<FaFlagCheckered />}
                  value={address.province}
                  onChange={(value) => handleInputChange("province", value)}
                  required
                  placeholder="e.g., Bagmati"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  District
                </label>
                <InputField
                  name="district"
                  icon={<FaFlagCheckered />}
                  value={address.district}
                  onChange={(value) => handleInputChange("district", value)}
                  required
                  placeholder="e.g., Kathmandu"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Address
                </label>
                <InputField
                  name="address"
                  icon={<FaCity />}
                  value={address.address}
                  onChange={(value) => handleInputChange("address", value)}
                  required
                  placeholder="Street address"
                />
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-semibold">Payment Method</h2>

              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as "cod" | "esewa")
                    }
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">Cash on Delivery</p>
                    <p className="text-sm text-gray-600">
                      Pay when you receive your order
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="esewa"
                    checked={paymentMethod === "esewa"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as "cod" | "esewa")
                    }
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">eSewa</p>
                    <p className="text-sm text-gray-600">
                      Pay securely with eSewa
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-3">
              <div className="flex flex-row items-center justify-between text-lg">
                <span className="font-medium">Total Items:</span>
                <span>
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>

              <div className="flex flex-row items-center justify-between text-xl font-semibold">
                <span>Total Amount:</span>
                <span>रू. {formatSmartValue(getTotalPrice())}</span>
              </div>
            </div>

            <Button
              type="submit"
              title={
                paymentMethod === "cod" ? "Place Order" : "Proceed to Payment"
              }
              isLoading={isLoading}
              containerClass="w-full"
            />
          </form>
        </div>
      </div>
    </Bounded>
  );
}

export default Checkout;
