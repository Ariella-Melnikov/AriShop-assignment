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
  _id: string;
  productId: string;
  variantId: string;
  quantity: number;
  price: Price;
}
export interface Cart {
  _id: string;
  items: CartItem[];
  subtotal: Price;
  total: Price;
  updatedAt: string | Date;
}

export interface User {
  _id: string;
  email: string;
  password?: string; 
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
  billingManuallyEdited?: boolean
}
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