import { IsArray, IsString, ValidateNested, IsObject } from 'class-validator'
import { Type } from 'class-transformer'
import { Address } from '@arishop/shared'

export class UserInfoDto {
  @IsString() firstName: string
  @IsString() lastName: string
  @IsString() email: string
}

export class PaymentSummaryDto {
  @IsString() approvalNumber: string
}

export class CreateOrderFromPaymentDto {
  @IsString() orderId: string

  @IsObject()
  deliveryAddress: Address

  @IsObject()
  billingAddress: Address

  @ValidateNested()
  @Type(() => UserInfoDto)
  userInfo: UserInfoDto

  @IsString() deliveryDate: string

  @IsArray()
  items: any[] // Simplified; can refine later with a CartItemDto if needed

  @ValidateNested()
  @Type(() => PaymentSummaryDto)
  payment: PaymentSummaryDto
}