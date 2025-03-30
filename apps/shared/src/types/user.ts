import { Order } from "./order";
import { Price } from "./product";

export interface Address {
  _id: string;
  street: string;
  apartment: string;
  city: string;
  country: string;
  zip: string;
  isDefault?: boolean;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  price: Price;
}

export interface Cart {
  items: CartItem[];
  subtotal: Price;
  total: Price;
  updatedAt: Date;
}

export interface User {
  _id: string;
  email: string;
  password?: string; // Only in backend
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  defaultAddressId?: string;
  orderHistory: Order[];
  cart?: Cart;
  createdAt: Date;
}

export interface AnonymousUserInfo {
  firstName: string
  lastName: string
  email: string
  deliveryAddress: Address | null
  billingAddress: Address | null
}
// For auth responses (frontend-safe)
export interface PublicUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'admin';
}

export interface LoginResponse {
  access_token: string;
  user: PublicUser;
}