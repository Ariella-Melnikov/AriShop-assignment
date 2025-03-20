export interface Product {
    id: string;
    title: string;
    price: number;
    image: string;
    description: string;
    category: string;
}

export interface ProductState {
    products: Product[];
    loading: boolean;
    error: string | null;
} 