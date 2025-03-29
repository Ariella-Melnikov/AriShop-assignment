import { IsString, IsEmail, IsNumber, IsArray, ValidateNested, IsBoolean, IsObject } from 'class-validator'
import { Type } from 'class-transformer'

class CheckoutItem {
    @IsString()
    name: string

    @IsNumber()
    amount: number

    @IsString()
    vendorId: string

    @IsNumber()
    platformFee: number
}

class ShippingAddress {
    @IsString()
    firstName: string

    @IsString()
    lastName: string

    @IsString()
    city: string

    @IsString()
    country: string

    @IsString()
    line1: string

    @IsString()
    postalCode: string

    @IsString()
    line2: string

    @IsString()
    state: string
}

export class CreateCheckoutDto {
    @IsNumber()
    amount: number // in ILS (from frontend)

    @IsString()
    currency: string // from frontend, will be ignored in backend

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
    @Type(() => ShippingAddress)
    shippingAddress: ShippingAddress

    @IsBoolean()
    shippingSameAsBilling: boolean;
  
    @IsString()
    successfulPaymentRedirect: string;
  }
