import { ProductMedia, Price, Variant } from '../interfaces/product.interface';

export class CreateProductDto {
  title: string;
  description: string;
  flowerType: string;
  occasion?: string[];
  categories: string[];
  tags: string[];
  basePrice: Price;
  media: Omit<ProductMedia, '_id'>[];
  variants: Omit<Variant, '_id' | 'productId'>[];
  fragranceLevel?: 'light' | 'medium' | 'strong';
  freshnessDuration?: number;
  seasonalAvailability?: string[];
}