import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store/store'
import { removeCartItem } from '../../store/actions/cartActions'
import { fetchProducts } from '../../store/slices/productSlice'
import CloseIcon from '@/assets/icons/X.svg?react'
import { ActionButton } from '../Buttons/ActionButton'
import { CartProductCard } from '../ProductCard/CartProductCard'

interface CartModalProps {
    onClose: () => void
}

export const CartModal = ({ onClose }: CartModalProps) => {
    const dispatch = useDispatch<AppDispatch>()
    const { items, subtotal } = useSelector((state: RootState) => state.cart)
    const { products, loading } = useSelector((state: RootState) => state.products)
    const navigate = useNavigate()

    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProducts())
        }
    }, [dispatch, products.length])

    // Close modal on ESC
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [onClose])

    useEffect(() => {
        if (items.length === 0) {
            onClose()
        }
    }, [items.length, onClose])

    const handleViewCart = () => {
        navigate('/cart')
        onClose()
    }

    const handleCheckout = () => {
        navigate('/checkout')
        onClose()
    }

    const handleRemoveItem = async (variantId: string) => {
        try {
            await dispatch(removeCartItem(variantId)).unwrap()
        } catch (error) {
            console.error('Failed to remove item:', error)
        }
    }

    if (loading) {
        return <div className='loading'>Loading...</div>
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
                            const product = products.find(p => p._id === item.productId)
                            if (!product) {
                                console.log('Product not found:', item.productId)
                                return null
                            }
                            return (
                                <li key={item.variantId} className='cart-item'>
                                    <CartProductCard
                                        cartItem={item}
                                        isEditable={false}
                                        showRemove={true}
                                        onQuantityChange={() => {}} // not used in modal
                                        onRemove={handleRemoveItem}
                                        className='modal-card'
                                    />
                                </li>
                            )
                        })}
                    </ul>
                )}

                <div className='cart-summary'>
                    <span>Subtotal:</span>
                    <span>{subtotal.amount.toFixed(2)} ₪</span>
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
