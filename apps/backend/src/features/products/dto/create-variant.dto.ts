import { Price, Inventory } from '@arishop/shared';

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
