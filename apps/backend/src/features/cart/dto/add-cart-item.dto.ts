import { IsNotEmpty, IsMongoId, IsInt, Min } from 'class-validator'

export class AddCartItemDto {
  @IsMongoId()
  @IsNotEmpty()
  productId: string

  @IsMongoId()
  @IsNotEmpty()
  variantId: string

  @IsInt()
  @Min(1)
  quantity: number
}