import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PaymentDetailsDto {
  @IsString() @IsNotEmpty() last4: string;
  @IsString() @IsNotEmpty() token: string;
  @IsString() method?: string;
}

export class CreateOrderDto {
  @IsString() @IsNotEmpty() shippingAddressId: string;
  @IsString() @IsNotEmpty() deliveryMethodId: string;

  @ValidateNested()
  @Type(() => PaymentDetailsDto)
  paymentDetails: PaymentDetailsDto;
}