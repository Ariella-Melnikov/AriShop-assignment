import { IsString, IsArray } from 'class-validator';

export class UniPaaSAuthorizeDto {
  @IsString()
  vendorId: string;

  @IsArray()
  scopes: string[]; // e.g., ["onboarding_write"]
}
