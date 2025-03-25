import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}