import { useUser } from "@/context/UserContext";
import { useCart } from "@/hooks/useCart";
import {
  ShoppingCart,
  BookOpen,
  LayoutDashboard,
  ShoppingBasket,
  Warehouse,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { getTotalItems } = useCart();
  return (
    <>
      <header className="w-full px-6 py-4 flex flex-row items-center justify-between bg-white border-b border-gray-200">
        <div
          className="flex flex-row items-center gap-2 cursor-pointer"
          onClick={() => navigate("/home")}
        >
          <ShoppingBasket className="w-6 h-6 text-primary" />
          <span className="text-lg font-semibold text-gray-900 sr-only sm:not-sr-only">
            SmartAgro
          </span>
        </div>

        <nav className="flex flex-row items-center gap-6">
          <button
            onClick={() => navigate("/news")}
            className="flex flex-row items-center gap-1.5 text-gray-700 hover:text-primary transition-colors cursor-pointer"
            aria-label="News"
          >
            <BookOpen className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">News</span>
          </button>

          <button
            onClick={() => navigate("/coldstorage")}
            className="flex flex-row items-center gap-1.5 text-gray-700 hover:text-primary transition-colors cursor-pointer"
            aria-label="ColdStorage"
          >
            <Warehouse className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">
              ColdStorage
            </span>
          </button>

          {user?.identity === "farmer" && (
            <button
              onClick={() => navigate("/farmer-dashboard")}
              className="flex flex-row items-center gap-1.5 text-gray-700 hover:text-primary transition-colors cursor-pointer"
              aria-label="Farmer Dashboard"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">
                Dashboard
              </span>
            </button>
          )}

          {/* For testing, admin access */}
          {user?.username === "admin" && (
            <button
              onClick={() => navigate("/admin-dashboard")}
              className="flex flex-row items-center gap-1.5 text-gray-700 hover:text-primary transition-colors cursor-pointer"
              aria-label="Admin Dashboard"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">
                Admin
              </span>
            </button>
          )}

          <button
            onClick={() => navigate("/checkout")}
            className="relative flex flex-row items-center gap-1.5 text-gray-700 hover:text-primary transition-colors cursor-pointer"
            aria-label="Checkout"
          >
            <ShoppingCart className="w-5 h-5" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -left-1 bg-primary text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
            <span className="hidden sm:inline text-sm font-medium">Cart</span>
          </button>
        </nav>
      </header>
    </>
  );
}

export default Navbar;
