import { IsString, IsEmail, IsNumber, IsArray, ValidateNested, IsBoolean, IsObject } from 'class-validator';
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

class BillingAddress {
  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  zipCode: string;

  @IsString()
  country: string;
}

export class CreateCheckoutDto {
  @IsNumber()
  amount: number; // in ILS (from frontend)

  @IsString()
  currency: string; // from frontend, will be ignored in backend

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

  @IsObject()
  @ValidateNested()
  @Type(() => BillingAddress)
  billingAddress: BillingAddress;

  @IsBoolean()
  shippingSameAsBilling: boolean;

  @IsString()
  successfulPaymentRedirect: string;
}