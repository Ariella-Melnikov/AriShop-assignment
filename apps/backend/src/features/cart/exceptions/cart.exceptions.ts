import { BadRequestException, NotFoundException } from '@nestjs/common';

export class CartItemNotFoundException extends NotFoundException {
  constructor(itemId: string) {
    super(`Cart item with ID ${itemId} not found`);
  }
}

export class InvalidCartOperationException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
} 