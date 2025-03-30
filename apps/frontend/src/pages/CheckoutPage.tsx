import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
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
import { Address } from '@arishop/shared'
import unipaasLogo from '@/assets/icons/unipaas-logo.svg'
import AppLogo from '@/assets/icons/app-logo.svg?react'
import creditCards from '@/assets/icons/credit-cards.svg'

export const CheckoutPage = () => {
    const { items, subtotal } = useSelector((state: RootState) => state.cart)
    const dispatch = useDispatch<AppDispatch>()
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

    const deliveryAddress: Address | undefined = user
        ? user.addresses.find((addr) => addr._id === user.defaultAddressId)
        : anonymousUser.deliveryAddress ?? undefined

    const billingAddress: Address | undefined = user
        ? user.addresses.find((addr) => addr._id === user.defaultAddressId)
        : anonymousUser.billingAddress ?? anonymousUser.deliveryAddress ?? undefined

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
                        <ActionButton label='Pay with UniPaaS' onClick={() => {}} />
                    </div>
                </section>

                <section className='checkout-summary'>
                    <div className='box sticky'>
                        <div className='summary-header'>
                            <SectionTitle>{items.length} ITEMS</SectionTitle>
                            <button className='secondary'>Edit</button>
                        </div>
                        <div className='cart-items'>Cart Items - TBD</div>
                        <div className='summary-line'>
                            <span>Subtotal</span>
                            <span>${(subtotal / 100).toFixed(2)}</span>
                        </div>
                        <div className='summary-line'>
                            <span>Delivery</span>
                            <span>Free</span>
                        </div>
                        <div className='summary-line total'>
                            <strong>Total to Pay:</strong>
                            <strong>${(subtotal / 100).toFixed(2)}</strong>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
