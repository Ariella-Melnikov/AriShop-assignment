import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppDispatch, RootState } from '../store/store'
import { fetchLoggedInUser, updateUserAddress } from '../store/slices/userSlice'
import {
    setAnonymousBillingAddress,
    setAnonymousDeliveryAddress,
    setAnonymousNameAndEmail,
} from '../store/slices/anonymousUserSlice'
import { PageTitle } from '../components/Title/PageTitle'
import { ActionButton } from '../components/Buttons/ActionButton'
import { DeliveryAddressBox } from '../components/Checkout/DeliveryAddressBox'
import { DeliveryOptionsBox } from '../components/Checkout/DeliveryOptionsBox'
import { SectionTitle } from '../components/Title/SectionTitle'
import { paymentService } from '../services/paymentService'
import { Address } from '@arishop/shared'
import unipaasLogo from '@/assets/icons/unipaas-logo.svg'
import AppLogo from '@/assets/icons/app-logo.svg?react'
import creditCards from '@/assets/icons/credit-cards.svg'
import { CartProductCard } from '../components/ProductCard/CartProductCard'
import { fetchILSToUSDRate } from '@arishop/shared'

export const CheckoutPage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const [exchangeRate, setExchangeRate] = useState<number>(0.28)
    const { items } = useSelector((state: RootState) => state.cart)
    const products = useSelector((state: RootState) => state.products.products)
    const user = useSelector((state: RootState) => state.user.user)
    const anonymousUser = useSelector((state: RootState) => state.anonymousUser)

    useEffect(() => {
        if (!user) dispatch(fetchLoggedInUser())
    }, [dispatch, user])

    useEffect(() => {
        if (!user && anonymousUser.deliveryAddress) {
            dispatch(setAnonymousBillingAddress(anonymousUser.deliveryAddress))
        }
    }, [anonymousUser.deliveryAddress])

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
            dispatch(setAnonymousBillingAddress(updatedAddress)) // Default billing = delivery
        }
    }

    const handleSaveBillingAddress = (updatedAddress: Address) => {
        if (!user) {
            dispatch(setAnonymousBillingAddress(updatedAddress))
        }
    }

    const handleUniPaaSPayment = async () => {
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

                return {
                    name: product?.name || 'Unknown',
                    amount: variant?.price.amount || 0,
                    vendorId: 'demo_vendor',
                    platformFee: 0,
                }
            })

            const payload = {
                amount: subtotalILS,
                currency: 'ILS',
                orderId,
                email,
                country: 'IL',
                items: itemsPayload,
                shippingSameAsBilling: true,
                shippingAddress: {
                    ...billingName,
                    city: shippingAddress.city,
                    country: shippingAddress.country,
                    line1: shippingAddress.street,
                    postalCode: shippingAddress.zip,
                    line2: '',
                    state: '',
                },
                successfulPaymentRedirect: `${window.location.origin}/success?orderId=${orderId}`,
            }

            const { checkoutUrl } = await paymentService.createCheckout(payload)
            window.location.href = checkoutUrl
        } catch (err) {
            console.error('Failed to create checkout:', err)
            alert('Failed to create payment session. Please try again.')
        }
    }

    const deliveryAddress: Address | undefined = user
        ? user.addresses.find((addr) => addr._id === user.defaultAddressId)
        : anonymousUser.deliveryAddress ?? undefined

    const billingAddress: Address | undefined = user
        ? user.addresses.find((addr) => addr._id === user.defaultAddressId)
        : anonymousUser.billingAddress ?? anonymousUser.deliveryAddress ?? undefined

    const subtotalILS = items.reduce((acc, item) => {
        const product = products.find((p) => p._id === item.productId)
        const variant = product?.variants.find((v) => v._id === item.variantId)
        if (!variant) return acc
        return acc + variant.price.amount * item.quantity
    }, 0)

    const subtotalUSD = +(subtotalILS * exchangeRate).toFixed(2)

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
                                editable={!user} // signed-in users don’t edit billing
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
