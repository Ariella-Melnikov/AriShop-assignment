import { ProductMedia, Price } from '@arishop/shared/types/product';

export class CreateProductDto {
  name: string;
  description: string;
  categories: string[];
  tags: string[];
  basePrice: Price;
  media: Omit<ProductMedia, '_id'>[];
}

