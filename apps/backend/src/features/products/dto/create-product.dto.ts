import { ProductMedia, Price } from '@arishop/shared';

export class CreateProductDto {
  name: string;
  description: string;
  flowerType: string[];
  categories: string[];
  tags: string[];
  media: Omit<ProductMedia, '_id'>[];
}

