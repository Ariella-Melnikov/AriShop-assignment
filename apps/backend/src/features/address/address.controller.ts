import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  findAll(@CurrentUser('userId') userId: string) {
    return this.addressService.findAll(userId);
  }

  @Get(':id')
  findById(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.addressService.findById(userId, id);
  }

  @Post()
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateAddressDto) {
    return this.addressService.create(userId, dto);
  }

  @Put(':id')
  update(@CurrentUser('userId') userId: string, @Param('id') id: string, @Body() dto: UpdateAddressDto) {
    return this.addressService.update(userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.addressService.remove(userId, id);
  }

  @Put(':id/default')
  setDefault(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.addressService.setDefault(userId, id);
  }
}