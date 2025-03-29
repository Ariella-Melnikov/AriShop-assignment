import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { AppDispatch, RootState } from '../store/store'
import { fetchLoggedInUser, updateUserAddress } from '../store/slices/userSlice'
import { Title } from '../components/Title/Title'
import { ActionButton } from '../components/Buttons/ActionButton'
import unipaasLogo from '@/assets/icons/unipaas-logo.svg'
import AppLogo from '@/assets/icons/app-logo.svg?react'
import { DeliveryAddressBox } from '../components/Checkout/DeliveryAddressBox'
import { DeliveryOptionsBox } from '../components/Checkout/DeliveryOptionsBox'
import { setAnonymousBillingAddress, setAnonymousDeliveryAddress, setAnonymousNameAndEmail } from '../store/slices/anonymousUserSlice'
  import { Address } from '@arishop/shared'

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
                    <Title>CHECKOUT</Title>
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
                        <h2>Payment</h2>
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
                        <h3>Payment Type</h3>
                        <div className='unipaas-method'>
                            <img src={unipaasLogo} alt='UniPaaS' />
                            <span>UniPaaS</span>
                        </div>
                        <footer className='payment-footer'>
                            <span>We Accept:</span>
                            {/* Add credit card logos later */}
                        </footer>
                        <ActionButton label='Pay with UniPaaS' onClick={() => {}} />
                    </div>
                </section>

                <section className='checkout-summary'>
                    <div className='box sticky'>
                        <div className='summary-header'>
                            <h2>{items.length} ITEMS</h2>
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
