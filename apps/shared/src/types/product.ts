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

export interface Variant {
    _id: string;
    productId: string;
    size?: 'small' | 'medium' | 'large';
    color?: string;
    packaging?: 'standard' | 'gift';
    price: Price;
    inventory: number;
}

export interface Availability {
    inStock: boolean;
    leadTime?: number; // Days required to fulfill the order if not in stock
}

export interface Product {
    _id: string;
    name: string;
    description: string;
    categories: string[];
    tags: string[];
    basePrice: Price;
    media: ProductMedia[];
    variants: Variant[];
    availability: Availability;
    createdAt: Date;
    updatedAt: Date;
} 