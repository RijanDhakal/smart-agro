export interface User {
  userId: string;
  username: string;
  contact: string;
  gmail: string;
}

export interface OrderProduct {
  productId: string;
  productName: string;
  productImage: string;
  price: string;
  quantity: string;
  sellerId: string;
}

export interface Order {
  orderId: string;
  address: string;
  orderStatus: string;
  productId: string;
  quantity: number;
  PaymentMethod: string;
  Product: OrderProduct;
  user: User;
  userId: string;
  userUserId: string;
}

export interface Product {
  productId: string;
  productName: string;
  productImage: string;
  price: string;
  quantity: string;
  description: string;
  expectedLifeSpan: string;
  sellerId: string;
  order: Order[];
}

export interface FarmerResponse {
  address: string;
  citizenShip_back: string | null;
  citizenShip_front: string | null;
  contact: string;
  farmerID: string;
  gmail: string;
  products: Product[];
  username: string;
  verified: boolean;
}
