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
  size?: string; // Not as relevant for flowers, but keeping for bouquet sizes
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
  flowerType: string; // Added, e.g., "Roses", "Lilies", "Tulips"
  occasion?: string[]; // Added, e.g., ["Wedding", "Birthday", "Valentine's Day"]
  categories: string[]; 
  tags: string[]; 
  basePrice: Price;
  media: ProductMedia[];
  variants: Variant[]; 
  fragranceLevel?: 'light' | 'medium' | 'strong'; // New, to describe flower scent
  createdAt: Date;
  updatedAt: Date;
}