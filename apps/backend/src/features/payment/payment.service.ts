import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { firstValueFrom } from 'rxjs'
import { CreateCheckoutDto } from './dto/create-checkout.dto'
import { AddressDto } from './dto/address.dto'
@Injectable()
export class PaymentService {
    constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {}

    async createCheckout(dto: CreateCheckoutDto) {
        const apiKey = this.configService.get<string>('UNIPAAS_API')
        if (!apiKey) throw new InternalServerErrorException('Missing UniPaaS API key')

        const headers = {
            authorization: `Bearer ${apiKey}`,
            'content-type': 'application/json',
            accept: 'application/json',
        }

        function cleanAddress(address: AddressDto) {
            return {
                firstName: address.firstName,
                lastName: address.lastName,
                line1: address.line1,
                line2: address.line2,
                city: address.city,
                postalCode: address.postalCode,
                country: address.country,
                state: address.state,
            }
        }

        const payload = {
            currency: 'USD',
            amount: dto.amount,
            country: 'IL',
            email: dto.email,
            orderId: dto.orderId,
            isMoto: false,
            storePaymentMethod: false,
            metadata: {
                source: 'frontend', // optional but helps for debugging
            },
            billingAddress: cleanAddress(dto.billingAddress), // ✅ new field required
            shippingSameAsBilling: dto.shippingSameAsBilling,
            shippingAddress: {
                ...cleanAddress(dto.shippingAddress),
                email: dto.email,
            },
            items: dto.items.map((item) => ({
                name: item.name,
                amount: item.amount,
                description: item.description || 'N/A', // optional fallback
                quantity: item.quantity || 1,
            })),
            // successfulPaymentRedirect: dto.successfulPaymentRedirect,
        }

        console.log('[DEBUG] Final Payload to UniPaaS:', JSON.stringify(payload, null, 2))

        try {
            const response = await firstValueFrom(
                this.httpService.post('https://sandbox.unipaas.com/platform/pay-ins/checkout', payload, { headers })
            )

            const checkoutUrl = response.data?.checkoutUrl || response.data?.shortLink
            if (!checkoutUrl) {
                throw new InternalServerErrorException('Missing checkout URL in response')
            }
            return { checkoutUrl }
        } catch (err) {
            console.error('UniPaaS Checkout error:', err.response?.data || err.message)
            throw new InternalServerErrorException('Failed to create UniPaaS checkout')
        }
    }
}
