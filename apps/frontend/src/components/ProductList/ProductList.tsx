import { Product } from '@arishop/shared/types/product';
import { ProductCard } from '../ProductCard/ProductCard';

interface ProductListProps {
    products: Product[];
    onAddToCart: (product: Product) => void;
}

export const ProductList = ({ products, onAddToCart }: ProductListProps) => {
    return (
        <div className="product-list">
            {products.map((product) => (
                <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={onAddToCart}
                />
            ))}
        </div>
    );
}; 