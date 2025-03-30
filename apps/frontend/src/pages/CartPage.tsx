import { useSelector, useDispatch } from 'react-redux'
import { CartProductCard } from '../components/ProductCard/CartProductCard'
import { RootState, AppDispatch } from '../store/store'
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice'
import { useNavigate } from 'react-router-dom'
import { PageTitle } from '../components/Title/PageTitle'

export const CartPage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate() // ✅ Add this


    const { items, subtotal } = useSelector((state: RootState) => state.cart)
    const deliveryCost = 35
    const total = subtotal + deliveryCost

    const handleQtyChange = (variantId: string, quantity: number) => {
        if (quantity < 1) return
        dispatch(updateQuantity({ variantId, quantity }))
    }

    const handleRemove = (variantId: string) => {
        dispatch(removeFromCart({ variantId }))

        if (items.length === 0) {
            return (
                <div className='empty-cart'>
                    <div className='cart-icon'>🛒</div> {/* Replace with an actual icon component if needed */}
                    <p className='main-message'>Your cart is empty</p>
                    <p className='sub-message'>Sign in to see your cart</p>
                    <p className='tagline'>and get a new Boquete</p>
                    <button className='signin-btn' onClick={() => console.log('Sign in logic here')}>
                        Sign In
                    </button>
                </div>
            )
        }
    }

    return (
        <section className='cart-page'>
            <div className='cart-title-section'>
                <PageTitle>Your Cart</PageTitle>
            </div>
            <div className='cart-page-main'>
                <div className='cart-items'>
                    {items.map((item) => (
                        <CartProductCard
                            key={item.variantId}
                            cartItem={item}
                            onQuantityChange={handleQtyChange}
                            onRemove={handleRemove}
                        />
                    ))}
                </div>

                <div className='cart-summary-section'>
                    <div className='cart-summary-box'>
                        <h3 className='summary-title'>Summary</h3>
                        <div className='summary-rows-wrapper'>
                        <div className='summary-row'>
                            <span>Subtotal</span>
                            <span>{subtotal.toFixed(2)} ₪</span>
                        </div>
                        <div className='summary-row with-border'>
                            <span>Delivery</span>
                            <span>{deliveryCost.toFixed(2)} ₪</span>
                        </div>
                        <div className='summary-row total'>
                            <strong>Total</strong>
                            <strong>{total.toFixed(2)} ₪</strong>
                        </div>
                        </div>
                        <div className='checkout-btn-wrapper'>
                        <button className='checkout-btn' onClick={() => navigate('/checkout')}>
                            Checkout
                        </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
