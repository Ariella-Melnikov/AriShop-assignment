import {
    IsString,
    IsEmail,
    IsNumber,
    IsArray,
    ValidateNested,
    IsBoolean,
    IsObject,
    IsOptional,
  } from 'class-validator'
  import { Type } from 'class-transformer'
  
  export class CheckoutItem {
    @IsString()
    name: string;
  
    @IsNumber()
    amount: number;
  
    @IsNumber()
    platformFee: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    quantity?: number;
  }
  
  class AddressDto {
    @IsString()
    firstName: string
  
    @IsString()
    lastName: string
  
    @IsString()
    email: string
  
    @IsString()
    city: string
  
    @IsString()
    country: string
  
    @IsString()
    line1: string
  
    @IsString()
    line2: string
  
    @IsString()
    postalCode: string
  
    @IsString()
    state: string
  }
  
  export class CreateCheckoutDto {
    @IsNumber()
    amount: number 
  
    @IsString()
    currency: string 
  
    @IsString()
    orderId: string
  
    @IsEmail()
    email: string
  
    @IsString()
    country: string
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CheckoutItem)
    items: CheckoutItem[]
  
    @IsObject()
    @ValidateNested()
    @Type(() => AddressDto)
    shippingAddress: AddressDto
  
    @IsObject()
    @ValidateNested()
    @Type(() => AddressDto)
    billingAddress: AddressDto // ✅ Added billingAddress
  
    @IsBoolean()
    shippingSameAsBilling: boolean
  
    @IsString()
    successfulPaymentRedirect: string
  }