import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppDispatch, RootState } from '../store/store'
import { fetchLoggedInUser, updateUserAddress } from '../store/slices/userSlice'
import { setAnonymousBillingAddress, setAnonymousDeliveryAddress, setAnonymousNameAndEmail } from '../store/slices/anonymousUserSlice'
import { fetchProducts } from '../store/slices/productSlice'
import { PageTitle } from '../components/Title/PageTitle'
import { ActionButton } from '../components/Buttons/ActionButton'
import { DeliveryAddressBox } from '../components/Checkout/DeliveryAddressBox'
import { DeliveryOptionsBox } from '../components/Checkout/DeliveryOptionsBox'
import { SectionTitle } from '../components/Title/SectionTitle'
import { CartProductCard } from '../components/ProductCard/CartProductCard'
import { PageLoader } from '../components/Loader/PageLoader'
import { paymentService } from '../services/paymentService'
import { Address } from '@arishop/shared'
import { fetchILSToUSDRate } from '@arishop/shared'
import unipaasLogo from '@/assets/icons/unipaas-logo.svg'
import AppLogo from '@/assets/icons/app-logo.svg?react'
import creditCards from '@/assets/icons/credit-cards.svg'

export const CheckoutPage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const { loading } = useSelector((state: RootState) => state.products)
    const [showLoader, setShowLoader] = useState(true)
    const [exchangeRate, setExchangeRate] = useState<number>(0.28)
    const { items } = useSelector((state: RootState) => state.cart)
    const products = useSelector((state: RootState) => state.products.products)
    const user = useSelector((state: RootState) => state.user.user)
    const anonymousUser = useSelector((state: RootState) => state.anonymousUser)

    useEffect(() => {
        if (!user) dispatch(fetchLoggedInUser())
    }, [dispatch, user])

    useEffect(() => {
        if (!products.length) {
            dispatch(fetchProducts())
        }
    }, [dispatch, products])

    useEffect(() => {
        const timer = setTimeout(() => setShowLoader(false), 3000)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        fetchILSToUSDRate().then((rate) => {
            if (rate) setExchangeRate(rate)
        })
    }, [])

    const handleGuestInfoSave = (info: { firstName: string; lastName: string; email: string }) => {
        dispatch(setAnonymousNameAndEmail(info))
    }

    const handleSaveDeliveryAddress = (updatedAddress: Address) => {
        if (user) {
            dispatch(updateUserAddress(updatedAddress))
        } else {
            dispatch(setAnonymousDeliveryAddress(updatedAddress))
            dispatch(setAnonymousBillingAddress(updatedAddress)) 
        }
    }

    const handleSaveBillingAddress = (updatedAddress: Address) => {
        if (!user) {
            dispatch(setAnonymousBillingAddress(updatedAddress))
        }
    }

    const handleUniPaaSPayment = async () => {
        let totalAmount = 0
    
        try {
            const orderId = crypto.randomUUID()
            const email = user?.email || anonymousUser.email
            const shippingAddress = deliveryAddress!
            const billingName = {
                firstName: user?.firstName || anonymousUser.firstName,
                lastName: user?.lastName || anonymousUser.lastName,
            }
    
            const itemsPayload = items.map((item) => {
                const product = products.find((p) => p._id === item.productId)
                const variant = product?.variants.find((v) => v._id === item.variantId)
                const itemPriceILS = variant?.price.amount || 0
    
                const itemPriceUSD = parseFloat((itemPriceILS * exchangeRate).toFixed(2))
                const totalForItem = parseFloat((itemPriceUSD * item.quantity).toFixed(2))
    
                totalAmount += totalForItem
    
                return {
                    name: product?.name || 'Unknown',
                    amount: itemPriceUSD, 
                    platformFee: 0,
                    description: product?.description || 'No description',
                    quantity: item.quantity,
                }
            })

            const redirectUrl = `${window.location.origin}/success?orderId=${orderId}&paymentApproved=true`
            console.log('Redirecting to:', window.location.origin)
            
            const payload = {
                amount: parseFloat(totalAmount.toFixed(2)), 
                currency: 'USD',
                orderId,
                email,
                country: 'IL',
                items: itemsPayload,
                shippingSameAsBilling: true,
                shippingAddress: {
                    ...shippingAddress,
                    firstName: billingName.firstName,
                    lastName: billingName.lastName,
                    line1: shippingAddress.street,
                    line2: shippingAddress.apartment,
                    postalCode: shippingAddress.zip,
                    state: '',
                },
                billingAddress: {
                    ...shippingAddress,
                    firstName: billingName.firstName,
                    lastName: billingName.lastName,
                    line1: shippingAddress.street,
                    line2: shippingAddress.apartment,
                    postalCode: shippingAddress.zip,
                    state: '',
                },
                successfulPaymentRedirect: redirectUrl,
            }
    
            const { checkoutUrl } = await paymentService.createCheckout(payload)
            window.location.href = checkoutUrl
        } catch (err) {
            console.error('Failed to create checkout:', err)
            alert('Failed to create payment session. Please try again.')
        }
    }

    const deliveryAddress: Address | undefined = useSelector((state: RootState) =>
        state.user.user
          ? state.user.user.addresses.find((addr) => addr._id === state.user.user!.defaultAddressId)
          : state.anonymousUser.deliveryAddress ?? undefined // convert `null` to `undefined`
      )
      
      const billingAddress: Address | undefined = useSelector((state: RootState) =>
        state.user.user
          ? state.user.user.addresses.find((addr) => addr._id === state.user.user!.defaultAddressId)
          : state.anonymousUser.billingAddress ?? undefined
      )

    const subtotalILS = items.reduce((acc, item) => {
        const product = products.find((p) => p._id === item.productId)
        const variant = product?.variants.find((v) => v._id === item.variantId)
        if (!variant) return acc
        return acc + variant.price.amount * item.quantity
    }, 0)

    const subtotalUSD = +(subtotalILS * exchangeRate).toFixed(2)

    if (loading || showLoader) {
        return (
            <PageLoader />
        )
    }

    return (
        <div className='checkout-page'>
            <header className='checkout-header'>
                <div className='app-logo-column'>
                    <div className='app-logo'>
                        <AppLogo className='app-logo' />
                    </div>
                </div>
                <div className='checkout-title'>
                    <PageTitle>CHECKOUT</PageTitle>
                </div>
                <div className='unipaas-logo-column'>
                    <div className='unipaas-logo'>
                        <img src={unipaasLogo} alt='UniPaaS' />
                    </div>
                </div>
            </header>

            <main className='checkout-main'>
                <section className='checkout-left'>
                    <div className='box'>
                        <DeliveryAddressBox
                            address={deliveryAddress ?? anonymousUser.deliveryAddress ?? undefined}
                            firstName={user?.firstName || anonymousUser.firstName}
                            lastName={user?.lastName || anonymousUser.lastName}
                            email={user?.email || anonymousUser.email}
                            isSignedIn={!!user}
                            onSave={handleSaveDeliveryAddress}
                            title='Delivery Address'
                            onGuestInfoSave={handleGuestInfoSave}
                        />
                    </div>
                    <div className='box'>
                        <DeliveryOptionsBox />
                    </div>
                    <div className='box'>
                        <div className='payment-box'>
                            <SectionTitle>PAYMENT</SectionTitle>
                            <DeliveryAddressBox
                                address={billingAddress}
                                firstName={user?.firstName || anonymousUser.firstName}
                                lastName={user?.lastName || anonymousUser.lastName}
                                email={user?.email || anonymousUser.email}
                                isSignedIn={!!user}
                                editable={!user} 
                                onSave={handleSaveBillingAddress}
                                title='Billing Address'
                                onGuestInfoSave={handleGuestInfoSave}
                            />
                        </div>
                        <div className='payment-type-box'>
                            <SectionTitle>PAYMENT TYPE</SectionTitle>
                            <div className='unipaas-method'>
                                <img src={unipaasLogo} alt='UniPaaS' />
                                <span>UniPaaS</span>
                            </div>
                        </div>
                    </div>
                    <div className='payment-footer-box box'>
                        <span>We Accept:</span>
                        <img src={creditCards} alt='Accepted credit cards' className='credit-cards-img' />
                    </div>
                    <div className='payment-button'>
                        <ActionButton label='Pay with UniPaaS' onClick={handleUniPaaSPayment} />
                    </div>
                </section>

                <section className='checkout-summary'>
                    <div className='box sticky'>
                        <div className='summary-header'>
                            <SectionTitle>{items.length} ITEMS</SectionTitle>
                            <ActionButton label='Edit' variant='secondary' onClick={() => navigate('/cart')} />
                        </div>
                        {items.length === 0 ? (
                            <p className='empty-cart-msg'>Cart is empty.</p>
                        ) : (
                            <ul className='cart-items-list'>
                                {items.map((item) => (
                                    <li key={item.variantId} className='cart-item'>
                                        <CartProductCard
                                            key={item.variantId}
                                            cartItem={item}
                                            isEditable={false}
                                            showRemove={false}
                                            onQuantityChange={() => {}}
                                            onRemove={() => {}}
                                            className='checkout-card'
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className='summary-line'>
                            <span>Subtotal</span>
                            <span>{subtotalILS.toFixed(2)} ₪</span>
                        </div>
                        <div className='summary-line'>
                            <span>Delivery</span>
                            <span>Free</span>
                        </div>
                        <div className='summary-line total'>
                            <strong>Total to Pay:</strong>
                            <strong>${subtotalUSD}</strong>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
