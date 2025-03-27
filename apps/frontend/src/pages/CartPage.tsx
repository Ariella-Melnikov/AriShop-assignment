import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../store/store'
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice'
import { useNavigate } from 'react-router-dom'
import { Title } from '../components/Title/Title'

export const CartPage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const { items, subtotal } = useSelector((state: RootState) => state.cart)

    const handleQtyChange = (variantId: string, quantity: number) => {
        if (quantity < 1) return
        dispatch(updateQuantity({ variantId, quantity }))
    }

    const handleRemove = (variantId: string) => {
        dispatch(removeFromCart({ variantId }))
    }

    return (
        <div className='cart-page'>
            {items.length > 0 && <Title>Your Cart</Title>}
            
            {items.length === 0 ? (
                <div className='empty-cart'>
                    <div className='cart-icon'>🛒</div> {/* Replace with an actual icon component if needed */}
                    <p className='main-message'>Your cart is empty</p>
                    <p className='sub-message'>Sign in to see your cart</p>
                    <p className='tagline'>and get a new Boquete</p>
                    <button className='signin-btn' onClick={() => console.log('Sign in logic here')}>
                        Sign In
                    </button>
                </div>
            ) : (
                <div className='cart-items'>
                    {items.map((item) => (
                        <div key={item.variantId} className='cart-item'>
                            <div className='cart-item-info'>
                                <p>
                                    <strong>Product ID:</strong> {item.productId}
                                </p>
                                <p>
                                    <strong>Variant ID:</strong> {item.variantId}
                                </p>
                                <p>
                                    <strong>Price:</strong> {item.price} ₪
                                </p>
                            </div>

                            <div className='cart-item-controls'>
                                <button onClick={() => handleQtyChange(item.variantId, item.quantity - 1)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => handleQtyChange(item.variantId, item.quantity + 1)}>+</button>

                                <button className='remove-btn' onClick={() => handleRemove(item.variantId)}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {items.length > 0 && (
                <div className='cart-summary'>
                    <p>
                        <strong>Subtotal:</strong> {subtotal.toFixed(2)} ₪
                    </p>
                    <button className='checkout-btn' onClick={() => navigate('/checkout')}>
                        Proceed to Checkout
                    </button>
                </div>
            )}
        </div>
    )
}
