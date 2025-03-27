import { Product, Variant } from '@arishop/shared';
import { ProductCard } from '../ProductCard/ProductCard';

interface ProductListProps {
    products: {
        product: Product;
        displayVariant: Variant | null;
    }[];
    onAddToCart: (product: Product, variant: Variant) => void;
}

export const ProductList = ({ products, onAddToCart }: ProductListProps) => {
    return (
        <div className="product-list">
            {products.map(({ product, displayVariant }) => (
                <ProductCard
                    key={product._id}
                    product={product}
                    displayVariant={displayVariant}
                    onAddToCart={onAddToCart}
                />
            ))}
        </div>
    )
}