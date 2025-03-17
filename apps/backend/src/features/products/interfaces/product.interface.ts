export interface ProductMedia {
  _id: string;
  type: 'image' | 'video';
  url: string;
  altText?: string;
}

export interface Price {
  amount: number;
  currency: 'ILS' | 'USD' | 'EUR';
}

export interface Variant {
  _id: string;
  productId: string;
  size?: string;
  color?: string;
  price: Price;
  inventory: {
    quantity: number;
    availableQuantity: number;
  };
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  brand: string;
  color?: string;
  categories: string[];
  tags: string[];
  basePrice: Price;
  media: ProductMedia[];
  variants: Variant[];
  createdAt: Date;
  updatedAt: Date;
} 