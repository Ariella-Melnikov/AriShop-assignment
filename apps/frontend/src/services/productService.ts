import { Product, Price, ProductMedia, Variant } from '@shared/types/product';

const API_URL = 'http://localhost:3030/api/products'; // Example API

interface BackendProduct {
    _id: string;
    title: string;
    description: string;
    categories: string[];
    tags: string[];
    basePrice: Price;
    media: ProductMedia[];
    variants: Variant[];
    createdAt: string;
    updatedAt: string;
}

const transformProduct = (product: BackendProduct): Product => ({
    _id: product._id,
    name: product.title, // Map title to name
    description: product.description,
    categories: product.categories,
    tags: product.tags,
    basePrice: product.basePrice,
    media: product.media,
    variants: product.variants,
    availability: {
        inStock: product.variants?.some(v => v.inventory > 0) ?? true
    },
    createdAt: new Date(product.createdAt),
    updatedAt: new Date(product.updatedAt)
});

export const productService = {
    async fetchProducts(): Promise<Product[]> {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            // Transform the API data to match our Product interface
            return data.map(transformProduct);
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Failed to fetch products');
        }
    }
}; 