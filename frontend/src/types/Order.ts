export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: string;
  description: string;
  sellerId: string;
  expectedLifeSpan: string;
}

export interface Order {
  orderId: string;
  productId: string;
  userId: string;
  address: string;
  quantity: number;
  Product: OrderItem;
  PaymentMethod: "cod" | "esewa";
  orderStatus:
    | "ordered"
    | "pending"
    | "confirmed"
    | "shipped"
    | "delivered"
    | "cancelled";
}

export interface FarmerOrder {
  orderId: string;
  customerName: string;
  productName: string;
  quantity: number;
  price: number | string;
  status:
    | "ordered"
    | "pending"
    | "confirmed"
    | "shipped"
    | "delivered"
    | "cancelled";
  customerContact: string;
  paymentMethod: "cod" | "esewa";
  orderDate: string;
  deliveryAddress: string;
}

export interface DashboardStats {
  orderRequests: number;
  turnover: number;
  customers: number;
  delivered: number;
}
