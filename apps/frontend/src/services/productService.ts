import { Product, ProductMedia, ProductTag, Variant } from '@arishop/shared';

const API_BASE_URL = import.meta.env.DEV
  ? import.meta.env.VITE_API_URL + '/products'
  : 'api/products';

interface BackendProduct {
    _id: string;
    name: string;
    description: string;
    categories: string[];
    tags: ProductTag[];
    media: ProductMedia[];
    variants: Variant[];
    createdAt: string;
    updatedAt: string;
}

const transformProduct = (product: BackendProduct): Product => ({
    _id: product._id,
    name: product.name,
    description: product.description,
    categories: product.categories,
    tags: product.tags,
    media: product.media,
    variants: product.variants,
    availability: {
        inStock: product.variants?.some(v => v.inventory.quantity > 0) ?? true
    },
    createdAt: new Date(product.createdAt),
    updatedAt: new Date(product.updatedAt)
});

export const productService = {

  
    async fetchProducts(): Promise<Product[]> {
      console.log('💡 API_BASE_URL:', API_BASE_URL);
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            // Transform the API data to match our Product interface
            return data.map(transformProduct);
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Failed to fetch products');
        }
    },

    async fetchProductById(productId: string): Promise<Product> {
        try {
          const response = await fetch(`${API_BASE_URL}/${productId}`);
          if (!response.ok) throw new Error('Failed to fetch product');
          const data = await response.json();
          return transformProduct(data);
        } catch (err) {
          throw new Error(err instanceof Error ? err.message : 'Unknown error');
        }
      },

    async fetchTags(): Promise<string[]> {
        try {
          const res = await fetch(`${API_BASE_URL}/tags`);
          if (!res.ok) throw new Error('Failed to fetch tags');
          return res.json();
        } catch (err) {
          throw new Error(err instanceof Error ? err.message : 'Unknown error');
        }
      }
}; 