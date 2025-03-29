import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { firstValueFrom } from 'rxjs'
import { CreateCheckoutDto } from './dto/create-checkout.dto'

@Injectable()
export class PaymentService {
    constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {}

    async createCheckout(dto: CreateCheckoutDto) {
        const apiKey = this.configService.get<string>('UNIPAAS_API')
        if (!apiKey) throw new InternalServerErrorException('Missing UniPaaS API key')

        const headers = {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        }

        // Example fixed exchange rate — in production, fetch live rate
        const exchangeRate = 0.28 // 1 ILS ≈ 0.28 USD
        const amountInUsd = Math.round(dto.amount * exchangeRate * 100) // convert to cents

        const payload = {
            amount: amountInUsd,
            currency: 'USD',
            country: 'IL',
            email: dto.email,
            orderId: dto.orderId,
            shippingAddress: dto.shippingAddress, // ← remapped
            shippingSameAsBilling: dto.shippingSameAsBilling,
            items: dto.items,
            successfulPaymentRedirect: dto.successfulPaymentRedirect,
            paymentMethods: ['creditCard'],
        }

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
