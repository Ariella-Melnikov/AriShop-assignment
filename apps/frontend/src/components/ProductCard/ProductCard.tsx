import { Product } from '@arishop/shared';

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
    const imageUrl = product.media?.[0]?.url || '';
    const imageAlt = product.media?.[0]?.altText || product.name;
    const price = product.basePrice?.amount || 0;
    const currency = product.basePrice?.currency || 'USD';
    const isInStock = product.availability?.inStock ?? true;

    return (
        <div className="product-card">
            <img 
                src={imageUrl} 
                alt={imageAlt} 
                className="product-image" 
            />
            <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-price">
                    {price.toFixed(2)} {currency}
                </p>
                <button 
                    className="add-to-cart-btn"
                    onClick={() => onAddToCart(product)}
                    disabled={!isInStock}
                >
                    {isInStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
    );
}; 