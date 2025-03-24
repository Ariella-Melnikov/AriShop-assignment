import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class AddCartItemDto {
  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  variantId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}