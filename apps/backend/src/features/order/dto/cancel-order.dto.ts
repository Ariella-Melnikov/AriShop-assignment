import { IsOptional, IsString } from 'class-validator';

export class CancelOrderDto {
  @IsOptional() @IsString() reasonTag?: string; 
  @IsOptional() @IsString() reasonText?: string;
}
