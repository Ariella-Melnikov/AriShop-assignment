import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../store/store'
import { removeFromCart } from '../../store/slices/cartSlice'
import CloseIcon from '@/assets/icons/X.svg?react'
import { ActionButton } from '../Buttons/ActionButton'

interface CartModalProps {
    onClose: () => void
}

export const CartModal = ({ onClose }: CartModalProps) => {
    const { items, subtotal } = useSelector((state: RootState) => state.cart)
    const allProducts = useSelector((state: RootState) => state.products.products)
    const dispatch = useDispatch()
    const navigate = useNavigate()


    // Close modal on ESC
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [onClose])


    const handleViewCart = () => {
        navigate('/cart')
        onClose()
    }

    const handleCheckout = () => {
        console.log('CHECKOUT')
        // Later: navigate('/checkout')
    }

    return (
        <div className='cart-modal-backdrop' onClick={onClose}>
            <div className='cart-modal' onClick={(e) => e.stopPropagation()}>
                <div className='cart-modal-header'>
                    <h2 className='modal-title'>Shopping Cart</h2>
                    <button className='modal-close-btn' onClick={onClose}>
                        <CloseIcon className='close-icon' />
                    </button>
                </div>

                {items.length === 0 ? (
                    <p className='empty-cart-msg'>Cart is empty.</p>
                ) : (
                    <ul className='cart-items-list'>
                        {items.map((item) => {
                            const product = allProducts.find((p) => p._id === item.productId)
                            const variant = product?.variants.find((v) => v._id === item.variantId)
                            if (!product || !variant) return null

                            return (
                                <li key={item.variantId} className='cart-item'>
                                    <div className='item-img'>
                                        <img
                                            src={product.media?.[0]?.url}
                                            alt={product.media?.[0]?.altText || product.name}
                                        />
                                    </div>

                                    <div className='item-details'>
                                        <div className='item-title'>{product.name}</div>
                                        <div className='item-description'>
                                            {product.description.split(' ').slice(0, 10).join(' ')}...
                                        </div>
                                        <div className='item-meta-row'>
                                            <span className='meta-label'>Size:</span>
                                            <button disabled className='meta-button'>
                                                {(variant.size || 'N/A').charAt(0).toUpperCase()}
                                            </button>
                                            <span className='meta-label'>Qty:</span>
                                            <button disabled className='meta-button'>
                                                {item.quantity}
                                            </button>
                                        </div>
                                        <div className='price-remove-row'>
                                            <div className='item-price'>
                                                <span className='price'>
                                                    {variant.price.amount.toFixed(2)} {variant.price.currency}
                                                </span>
                                            </div>
                                            <div className='item-action'>
                                                <button
                                                    className='remove-btn'
                                                    onClick={() =>
                                                        dispatch(removeFromCart({ variantId: item.variantId }))
                                                    }
                                                    aria-label='Remove item'>
                                                    <i className='fas fa-trash'></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                )}

                <div className='cart-summary'>
                    <strong>Subtotal: {subtotal.toFixed(2)} ₪</strong>
                </div>
                {items.length > 0 && (
                    <div className='cart-actions'>
                        <ActionButton label='View Cart' onClick={handleViewCart} variant='secondary'  />
                        <ActionButton label='Checkout' onClick={handleCheckout} />
                    </div>
                )}
            </div>
        </div>
    )
}