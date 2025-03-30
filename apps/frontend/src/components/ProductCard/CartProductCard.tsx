// src/components/Cart/CartProductCard.tsx
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { CartItem } from '@arishop/shared'
import CloseIcon from '@/assets/icons/X.svg?react'

interface CartProductCardProps {
    cartItem: CartItem
    onQuantityChange: (variantId: string, quantity: number) => void
    onRemove: (variantId: string) => void
    isEditable?: boolean
    showRemove?: boolean
    className?: string
}

export const CartProductCard = ({
    cartItem,
    onQuantityChange,
    onRemove,
    isEditable = false,
    showRemove = false,
    className = '',
}: CartProductCardProps) => {
    const { productId, variantId, quantity } = cartItem

    const product = useSelector((state: RootState) => state.products.products.find((p) => p._id === productId))

    const variant = product?.variants.find((v) => v._id === variantId)

    if (!product || !variant) return null

    const imageUrl = product.media?.[0]?.url || ''
    const totalPrice = (variant.price.amount * quantity).toFixed(2)

    return (
        <div className={`cart-product-card ${className}`}>
            <div className='image-container'>
                <img src={imageUrl} alt={product.name} />
            </div>

            <div className='items-details'>
                <div className='title-row'>
                    <h3 className='title'>{product.name}</h3>
                    {showRemove && onRemove && (
                        <button className='remove-btn' onClick={() => onRemove(variantId)} aria-label='Remove product'>
                            <CloseIcon className='remove-icon' />
                        </button>
                    )}
                </div>

                <p className='item-description'>{product.description}</p>

                <div className='item-meta-row'>
                    <span className='meta-label'>Size:</span>
                    <button disabled className='meta-button'>
                        {(variant.size || 'N/A').charAt(0).toUpperCase()}
                    </button>

                    <div className='controls'>
                        <span className='label'>Qty:</span>
                        {isEditable && onQuantityChange ? (
                            <>
                                <button
                                    className='meta-button'
                                    onClick={() =>
                                        quantity <= 1 ? onRemove(variantId) : onQuantityChange(variantId, quantity - 1)
                                    }>
                                    -
                                </button>
                                <span className='quantity'>{quantity}</span>
                                <button
                                    className='meta-button'
                                    onClick={() => onQuantityChange(variantId, quantity + 1)}>
                                    +
                                </button>
                            </>
                        ) : (
                            <span className='readonly-quantity'>{quantity}</span>
                        )}
                    </div>
                </div>

                <div className='footer-row'>
                    <div className='total-price'>{totalPrice} ₪</div>
                </div>
            </div>
        </div>
    )
}
