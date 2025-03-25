import { IsIn } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsIn(['pending_payment', 'processing', 'shipped', 'delivered', 'cancelled'])
  status: 'pending_payment' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}
