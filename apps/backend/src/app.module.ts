import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './features/products/products.module';
import { config } from 'dotenv';

config();
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {} 