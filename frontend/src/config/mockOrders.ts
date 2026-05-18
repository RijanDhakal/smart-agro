import type { Order } from "@/types/Order";

export const mockOrders: Order[] = [
  {
    orderId: "ORD123456789",
    productId: "1",
    userId: "user001",
    address: "Thamel, Kathmandu, Bagmati, Nepal",
    quantity: 5,
    Product: {
      productId: "1",
      productName: "Fresh Organic Tomatoes",
      productImage:
        "https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400",
      quantity: 5,
      price: "150",
      description: "Fresh organic tomatoes from local farms",
      sellerId: "seller001",
      expectedLifeSpan: "7",
    },
    PaymentMethod: "cod",
    orderStatus: "delivered",
  },
  {
    orderId: "ORD987654321",
    productId: "2",
    userId: "user002",
    address: "Patan Dhoka, Lalitpur, Bagmati, Nepal",
    quantity: 2,
    Product: {
      productId: "2",
      productName: "Premium Quality Rice - 5kg",
      productImage:
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
      quantity: 2,
      price: "800",
      description: "High-quality premium rice",
      sellerId: "seller002",
      expectedLifeSpan: "365",
    },
    PaymentMethod: "esewa",
    orderStatus: "shipped",
  },
  {
    orderId: "ORD555444333",
    productId: "3",
    userId: "user003",
    address: "Pokhara, Kaski, Gandaki, Nepal",
    quantity: 1,
    Product: {
      productId: "3",
      productName: "Fresh Potato - 10kg",
      productImage:
        "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400",
      quantity: 1,
      price: "500",
      description: "Fresh potatoes from mountain regions",
      sellerId: "seller003",
      expectedLifeSpan: "30",
    },
    PaymentMethod: "cod",
    orderStatus: "ordered",
  },
];
