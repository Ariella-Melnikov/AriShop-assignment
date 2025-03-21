import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './features/products/products.module';
import { DatabaseModule } from './common/database/database.module';
import { VariantsModule } from './features/products/variants.module';
import { config } from 'dotenv';

config();
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),,
    ProductsModule,
    VariantsModule,
    DatabaseModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {} 