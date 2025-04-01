export type ProductTag =
  | 'Birthday'
  | 'Anniversary'
  | 'Love & Romance'
  | 'Congratulations'
  | 'Get Well Soon'
  | 'Thank You'
  | 'Sympathy'
  | 'Roses'
  | 'Red'
  | 'Mixed Flowers';
export interface Price {
    amount: number;
    currency: 'ILS' | 'USD' | 'EUR';
  }
  
  export interface ProductMedia {
    _id: string;
    type: 'image' | 'video';
    url: string;
    altText?: string;
  }
  
  export interface Inventory {
    quantity: number;
    location: string;
    restockThreshold: number;
    restockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
    lastUpdated: Date;
  }
  
  export interface Variant {
    _id: string;
    productId: string;
    size?: 'small' | 'medium' | 'large';
    color?: string;
    packaging?: 'standard' | 'gift';
    price: Price;
    inventory: Inventory;
  }
  
  export interface Availability {
    inStock: boolean;
    leadTime?: number;
  }
  
  export interface Product {
    _id: string;
    name: string;
    description: string;
    flowerType: string[];
    categories: string[];
    tags: ProductTag[];
    media: ProductMedia[];
    variants: Variant[];
    availability: Availability;
    createdAt: string;
    updatedAt: string;
  }

