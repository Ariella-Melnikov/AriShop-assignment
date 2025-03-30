import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../store/store'
import { removeFromCart } from '../../store/slices/cartSlice'
import CloseIcon from '@/assets/icons/X.svg?react'
import { ActionButton } from '../Buttons/ActionButton'
import { CartProductCard } from '../ProductCard/CartProductCard'

interface CartModalProps {
    onClose: () => void
}

export const CartModal = ({ onClose }: CartModalProps) => {
    const { items, subtotal } = useSelector((state: RootState) => state.cart)
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
        navigate('/checkout') // ✅ Navigate to checkout
        onClose()
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
                        {items.map((item) => (
                            <li key={item.variantId} className='cart-item'>
                                <CartProductCard
                                    cartItem={item}
                                    isEditable={false}
                                    showRemove={true}
                                    onQuantityChange={() => {}} // not used in modal
                                    onRemove={(variantId) => dispatch(removeFromCart({ variantId }))}
                                    className='modal-card'
                                />
                            </li>
                        ))}
                    </ul>
                )}

                <div className='cart-summary'>
                    <strong>Subtotal: {subtotal.toFixed(2)} ₪</strong>
                </div>
                {items.length > 0 && (
                    <div className='cart-actions'>
                        <ActionButton label='View Cart' onClick={handleViewCart} variant='secondary' />
                        <ActionButton label='Checkout' onClick={handleCheckout} />
                    </div>
                )}
            </div>
        </div>
    )
}
