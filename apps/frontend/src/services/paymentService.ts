// src/services/paymentService.ts
import { http } from './httpService'

interface CheckoutItem {
  name: string
  amount: number
  platformFee: number
}

interface ShippingAddress {
  firstName: string
  lastName: string
  city: string
  country: string
  line1: string
  postalCode: string
  line2: string
  state: string
}

interface CreateCheckoutPayload {
  amount: number
  currency: string
  orderId: string
  email: string
  country: string
  items: CheckoutItem[]
  shippingAddress: ShippingAddress
  shippingSameAsBilling: boolean
  successfulPaymentRedirect?: string
}

export const paymentService = {
  async createCheckout(payload: CreateCheckoutPayload): Promise<{ checkoutUrl: string }> {
    return await http.post('/payments/checkout', payload)
  },
}
