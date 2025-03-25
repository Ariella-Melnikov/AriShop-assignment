import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('checkout')
  async createCheckout(@Body() dto: CreateCheckoutDto) {
    return this.paymentService.createCheckout(dto);
  }
}
