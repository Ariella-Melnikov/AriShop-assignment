import { useSelector, useDispatch } from 'react-redux'
import { CartProductCard } from '../components/ProductCard/CartProductCard'
import { RootState, AppDispatch } from '../store/store'
import { fetchCart, removeCartItem, updateCartItem } from '../store/actions/cartActions'
import { useNavigate } from 'react-router-dom'
import { PageTitle } from '../components/Title/PageTitle'
import { useEffect, useState } from 'react'
import { fetchProducts } from '../store/slices/productSlice'

export const CartPage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const [showLoading, setShowLoading] = useState(true)
    const { items, subtotal, loading } = useSelector((state: RootState) => state.cart)
    const user = useSelector((state: RootState) => state.user.user)
    const products = useSelector((state: RootState) => state.products.products)
    const deliveryCost = 0
    const total = { 
        amount: subtotal.amount + deliveryCost, 
        currency: subtotal.currency 
    }

    useEffect(() => {
        if (!products.length) {
          dispatch(fetchProducts())
        }
      }, [dispatch, products])

    useEffect(() => {
        const token = localStorage.getItem('cart-token')
        if (token || user) {
          dispatch(fetchCart())
        }
      
        const timeout = setTimeout(() => setShowLoading(false), 3000)
      
        return () => clearTimeout(timeout)
      }, [dispatch, user])


    const handleQtyChange = async (cartItemId: string, quantity: number) => {
        if (quantity < 1) return
        try {
            await dispatch(updateCartItem({ itemId: cartItemId, quantity })).unwrap()
        } catch (error) {
            console.error('Failed to update quantity:', error)
        }
    }

    const handleRemove = async (cartItemId: string) => {
        try {
            await dispatch(removeCartItem(cartItemId)).unwrap()
        } catch (error) {
            console.error('Failed to remove item:', error)
        }
    }

    if (showLoading) {
        return <p>Loading your cart...</p>
    }
    
    if (!loading && items.length === 0) {
        return (
            <div className='empty-cart'>
                <div className='cart-icon'>🛒</div>
                <p className='main-message'>Your cart is empty</p>
                <p className='sub-message'>Sign in to see your cart</p>
                <p className='tagline'>and get a new Boquete</p>
                <button className='signin-btn' onClick={() => console.log('Sign in logic here')}>
                    Sign In
                </button>
            </div>
        )
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
                            key={item._id}
                            cartItem={item}
                            isEditable={true}
                            showRemove={true}
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
                                <span>{subtotal.amount.toFixed(2)} ₪</span>
                            </div>
                            <div className='summary-row with-border'>
                                <span>Delivery</span>
                                <span>Free</span>
                            </div>
                            <div className='summary-row total'>
                                <strong>Total</strong>
                                <strong>{total.amount.toFixed(2)} {total.currency}</strong>
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
