import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema';
import { VariantsModule } from './variants.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]), 
    VariantsModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {} 