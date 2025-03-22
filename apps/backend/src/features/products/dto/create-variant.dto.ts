import { Price, Inventory } from '@arishop/shared/types/product';

export class CreateVariantsDto {
  variants: CreateVariantDto[];
}

export class CreateVariantDto {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  packaging?: 'standard' | 'gift';
  price: Price;
  inventory: Inventory;
}
