import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { CartProductCard } from '../components/ProductCard/CartProductCard'
import { clearCart } from '../store/slices/cartSlice'
import { PageTitle } from '../components/Title/PageTitle'
import { orderService } from '../services/orderService'
import { ActionButton } from '../components/Buttons/ActionButton'

export const SuccessPaymentPage = () => {
    const [searchParams] = useSearchParams()
    const [isSubmitting, setIsSubmitting] = useState(true)
    const [createdOrder, setCreatedOrder] = useState<any | null>(null)

    const dispatch = useDispatch()
    const cartItems = useSelector((state: RootState) => state.cart.items)
    const user = useSelector((state: RootState) => state.user.user)
    const anonymousUser = useSelector((state: RootState) => state.anonymousUser)
    const deliveryAddress =
        user?.addresses.find((a) => a._id === user.defaultAddressId) || anonymousUser.deliveryAddress
    const billingAddress = user?.addresses.find((a) => a._id === user.defaultAddressId) || anonymousUser.billingAddress

    const orderId = searchParams.get('orderId')

    useEffect(() => {
        const createOrder = async () => {
            if (!orderId || !deliveryAddress || !billingAddress || !cartItems.length) return

            try {
                const payload = {
                    orderId,
                    deliveryAddress,
                    billingAddress,
                    deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    userInfo: {
                        firstName: user?.firstName || anonymousUser.firstName,
                        lastName: user?.lastName || anonymousUser.lastName,
                        email: user?.email || anonymousUser.email,
                    },
                    items: cartItems,
                    payment: {
                        approvalNumber: 'AUTO-APPROVED-MOCK', // You can replace with actual ID if UniPaaS returns it
                    },
                }

                const savedOrder = await orderService.createFromRedirect(payload)
                setCreatedOrder(savedOrder)
                dispatch(clearCart())
            } catch (err) {
                console.error('Order creation failed:', err)
            } finally {
                setIsSubmitting(false)
            }
        }

        createOrder()
    }, [orderId, deliveryAddress, billingAddress, cartItems, user, anonymousUser, dispatch])

    const handleDownloadPDF = async () => {
        const input = document.getElementById('order-summary')
        if (!input) return

        try {
            const canvas = await html2canvas(input)
            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF()
            const imgProps = pdf.getImageProperties(imgData)
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
            pdf.save(`Order_${createdOrder.orderNumber}.pdf`)
        } catch (err) {
            console.error('PDF generation failed:', err)
        }
    }

    if (isSubmitting || !createdOrder) return <p>Finalizing your order...</p>

    return (
        <div className='success-page'>
            <PageTitle>Payment Successful!</PageTitle>

            <section className='order-summary'>
                <p>
                    <strong>Order ID:</strong> {createdOrder._id}
                </p>
                <p>
                    <strong>Approval #:</strong> {createdOrder.payment.approvalNumber}
                </p>
                <p>
                    <strong>Delivery Date:</strong> {new Date(createdOrder.deliveryDate).toLocaleDateString()}
                </p>

                <h3>Shipping To</h3>
                <p>
                    {createdOrder.deliveryAddress.street}, {createdOrder.deliveryAddress.city}
                </p>

                <h3>Billing To</h3>
                <p>
                    {createdOrder.billingAddress.street}, {createdOrder.billingAddress.city}
                </p>

                <h3>Customer</h3>
                <p>
                    {createdOrder.userInfo.firstName} {createdOrder.userInfo.lastName}
                </p>
                <p>{createdOrder.userInfo.email}</p>

                <h3>Products</h3>
                <ul>
                    {createdOrder.items.map((item: any) => (
                        <li key={item.variantId}>
                            <CartProductCard
                                cartItem={item}
                                isEditable={false}
                                showRemove={false}
                                onQuantityChange={() => {}}
                                onRemove={() => {}}
                            />
                        </li>
                    ))}
                </ul>
            </section>
            <ActionButton
                label='Download Receipt as PDF'
                onClick={handleDownloadPDF}
                variant='secondary' 
            />
        </div>
    )
}
