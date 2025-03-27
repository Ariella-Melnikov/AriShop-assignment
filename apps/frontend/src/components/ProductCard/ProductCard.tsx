import { Product, Variant } from '@arishop/shared'
import { ActionButton } from '../Buttons/ActionButton'
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
    product: Product;
    displayVariant: Variant | null;
    onAddToCart: (product: Product, variant: Variant) => void;
}

export const ProductCard = ({ product, displayVariant, onAddToCart }: ProductCardProps) => {
    const navigate = useNavigate()
    const imageUrl = product.media?.[0]?.url || ''
    const imageAlt = product.media?.[0]?.altText || product.name
    const isInStock = !!displayVariant
    const price = displayVariant?.price?.amount || 0
    const currency = displayVariant?.price?.currency || 'USD'

    const handleCardClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.action-button')) return
        navigate(`/shop/${product._id}`)
    }

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
                    onClick={() => displayVariant && onAddToCart(product, displayVariant)}
                    type='button'
                    disabled={!isInStock}
                />
            </div>
        </div>
    )
}