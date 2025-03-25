import { IsOptional, IsString } from 'class-validator';

export class CancelOrderDto {
  @IsOptional() @IsString() reasonTag?: string; // e.g., changed_mind, ordered_wrong
  @IsOptional() @IsString() reasonText?: string;
}
