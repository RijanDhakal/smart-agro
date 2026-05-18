import { useUser } from "@/context/UserContext";
// import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import StarGrid from "./landing/StarGrid";
import Products from "@/components/products/Products";
import Bounded from "./landing/Bounded";
import { useEffect, useState } from "react";
import type { UIProduct } from "@/types/Product";
import axios from "axios";
import { API_BASE_URL } from "@/config/apiDetails";
import { products } from "@/config/mockProducts";
import HomeBanner from "@/components/HomeBanner";
import { extractNumericValue } from "@/lib/formatSmartValue";

function Home() {
  // const navigate = useNavigate();
  const { user } = useUser();
  const [productLists, setProductLists] = useState<UIProduct[]>([]);
  const [nearbyProducts, setNearbyProducts] = useState<UIProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products/get`);
        if (response.status === 200) {
          setProductLists((response.data.data as UIProduct[]) ?? products);
          console.log("Fetched products:", response.data.data);
        } else {
          toast.error("Failed to fetch products.");
        }
      } catch (error: unknown) {
        console.error("Error fetching products:", error);
        toast.error("An error occurred while fetching products.");
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const getLocalProducts = async () => {
      const response = await axios.get(
        `${API_BASE_URL}/products/getnearestproducts/${user.id}`
      );
      const flattenedProducts = response.data.data.flat();
      setNearbyProducts(flattenedProducts);
    };
    getLocalProducts();
  }, [user.id]);

  // if (!user || !user.username) {
  //   navigate("/login");
  //   toast.error("Please log in to access the home page.");
  //   return null;
  // }

  return (
    <main>
      <StarGrid />
      <Bounded className="pt-0! mb-16">
        <HomeBanner />
        {nearbyProducts.length > 0 && (
          <div className="w-full flex flex-col items-start justify-start gap-4 mb-8">
            <h3 className="text-lg font-semibold">Nearby Products</h3>
            <div className="w-full overflow-x-auto overflow-y-visible scrollbar-hide -mx-4 px-4 py-4">
              <div className="flex gap-4">
                {nearbyProducts.map((product, index) => (
                  <a
                    key={`nearby-${index}`}
                    href={`/product/${product.productId}`}
                    className="relative shrink-0 w-32 sm:w-40 aspect-square rounded-xl overflow-visible cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={product.productImage}
                      className="h-full w-full object-cover rounded-xl"
                      alt={product.productName}
                    />
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg max-w-full">
                      <p className="text-xs sm:text-sm font-medium text-white text-center whitespace-nowrap">
                        {product.productName}
                      </p>
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 bg-primary px-4 py-1.5 rounded-lg shadow-lg">
                      <p className="text-sm sm:text-base font-semibold text-white text-center whitespace-nowrap">
                        {"रू. " + extractNumericValue(product.price)}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
        <Products mode="vertical" products={productLists}></Products>
      </Bounded>
    </main>
  );
}

export default Home;
