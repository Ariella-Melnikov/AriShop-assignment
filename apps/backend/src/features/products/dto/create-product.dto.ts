import { ProductMedia, Price, Variant } from '@shared/types/product';

export class CreateProductDto {
  name: string;
  description: string;
  categories: string[];
  tags: string[];
  basePrice: Price;
  media: Omit<ProductMedia, '_id'>[];
  variants: Omit<Variant, '_id' | 'productId'>[];
}