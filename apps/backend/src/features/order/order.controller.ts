import { Body, Controller, Get, Param, Post, Query, UseGuards, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateOrderDto) {
    return this.orderService.create(userId, dto);
  }

  @Get()
  findAll(@CurrentUser('userId') userId: string, @Query() query: any) {
    return this.orderService.findAll(userId, query);
  }

  @Get(':id')
  findOne(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.orderService.findOne(userId, id);
  }

  @Post(':id/cancel')
  cancel(@CurrentUser('userId') userId: string, @Param('id') id: string, @Body() dto: CancelOrderDto) {
    return this.orderService.cancel(userId, id, dto);
  }
}
