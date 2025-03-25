import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './features/products/products.module';
import { CartModule } from './features/cart/cart.module';
import { config } from 'dotenv';
import { AuthModule } from './features/auth/auth.module';
import { UserModule } from './features/user/user.module';
import { AddressModule } from './features/address/address.module';
import { OrderModule } from './features/order/order.module';
import { PaymentModule } from './features/payment/payment.module';

config();
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    ProductsModule,
    CartModule,
    AuthModule,
    UserModule,
    AddressModule,
    OrderModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {} 