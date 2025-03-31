import { IsString, IsArray, IsOptional } from 'class-validator';

export class UniPaaSAuthorizeDto {
  @IsString()
  @IsOptional()
  vendorId: string;

  @IsArray()
  scopes: string[]; // e.g., ["onboarding_write"]
}
