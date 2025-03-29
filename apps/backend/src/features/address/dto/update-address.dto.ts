import { IsOptional, IsString } from 'class-validator';

export class UpdateAddressDto {
  @IsOptional() @IsString() street?: string;
  @IsOptional() @IsString() apartment?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() zip?: string;
}