import { IsString, IsEmail, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CheckoutItem {
  @IsString()
  name: string;

  @IsNumber()
  amount: number;

  @IsString()
  vendorId: string;

  @IsNumber()
  platformFee: number;
}

export class CreateCheckoutDto {
  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  orderId: string;

  @IsEmail()
  email: string;

  @IsString()
  country: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckoutItem)
  item: CheckoutItem[];

  @IsString()
  successfulPaymentRedirect: string;
}
