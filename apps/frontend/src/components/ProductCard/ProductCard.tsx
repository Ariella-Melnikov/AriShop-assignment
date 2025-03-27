import { Product } from '@arishop/shared'
import { ActionButton } from '../Buttons/ActionButton'
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
    product: Product
    onAddToCart: (product: Product) => void;

}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
    const imageUrl = product.media?.[0]?.url || ''
    const imageAlt = product.media?.[0]?.altText || product.name
    const mediumVariant = product.variants?.find((v) => v.size === 'medium')
    const price = mediumVariant?.price?.amount || 0
    const currency = mediumVariant?.price?.currency || 'USD'
    const isInStock = Boolean(mediumVariant?.inventory?.quantity)
    const navigate = useNavigate();

    const handleCardClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.action-button')) {
            return;
        }
        navigate(`/shop/${product._id}`);
    };

    return (
        <div className='product-card' onClick={handleCardClick}>
            <img src={imageUrl} alt={imageAlt} className='product-image' />
            <div className='product-info'>
                <h3 className='product-title'>{product.name}</h3>
                <h3 className='product-price'>
                    {price.toFixed(2)} {currency}
                </h3>
                <ActionButton
                    label={isInStock ? 'Add to Cart' : 'Out of Stock'}
                    onClick={() => onAddToCart(product)}
                    type='button'
                    disabled={!isInStock}
                />
            </div>
        </div>
    )
}
