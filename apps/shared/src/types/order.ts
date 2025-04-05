import { Payment } from "./payment";
import { Address } from "./user";
import { DeliveryMethod } from "./delivery";

export interface ProductSnapshot {
    title: string;
    attributes: Record<string, string>; 
    price: number;
    media: {
      url: string;
      alt: string;
    };
  }
  
  export interface OrderItem {
    productId: string;
    variantId: string;
    productSnapshot: ProductSnapshot;
    quantity: number;
    price: number;
    totalPrice: number;
  }

  export interface StatusHistoryEntry {
    status: 'pending_payment' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    timestamp: Date;
  }
  
  export interface Order {
    _id: string;
    userId: string;
    orderNumber: string;
    items: OrderItem[];
    shippingAddress: Address;
    deliveryMethod: DeliveryMethod;
    payment: Payment;
    status: 'pending_payment' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    statusHistory: StatusHistoryEntry[];
    createdAt: Date;
  }
