import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Headers,
  UseGuards,
  Request,
  HttpCode,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
// import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard'; 
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Cart')
@Controller('cart')
// @UseGuards(OptionalAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current cart' })
  @ApiResponse({ status: 200, description: 'Returns the current cart' })
  async getCart(@Request() req, @Headers('cart-token') cartToken: string) {
    if (!req.user && !cartToken) {
      throw new BadRequestException('Either authentication or cart-token is required');
    }

    return this.cartService.findOrCreateCart({
      userId: req.user?.id,
      cartToken: !req.user ? cartToken : undefined,
    });
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 201, description: 'Item added to cart' })
  async addItem(
    @Request() req,
    @Headers('cart-token') cartToken: string,
    @Body() dto: AddCartItemDto,
  ) {
    if (!req.user && !cartToken) {
      throw new BadRequestException('Either authentication or cart-token is required');
    }

    return this.cartService.addItem(
      {
        userId: req.user?.id,
        cartToken: !req.user ? cartToken : undefined,
      },
      dto,
    );
  }

  @Put('items/:itemId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiResponse({ status: 200, description: 'Cart item updated' })
  async updateItem(
    @Request() req,
    @Headers('cart-token') cartToken: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItemQuantity(
      {
        userId: req.user?.id,
        cartToken: !req.user ? cartToken : undefined,
      },
      itemId,
      dto,
    );
  }

  @Delete('items/:itemId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 204, description: 'Item removed from cart' })
  async removeItem(
    @Request() req,
    @Headers('cart-token') cartToken: string,
    @Param('itemId') itemId: string,
  ) {
    await this.cartService.removeItem(
      {
        userId: req.user?.id,
        cartToken: !req.user ? cartToken : undefined,
      },
      itemId,
    );
  }

  @Delete()
  @HttpCode(204)
  @ApiOperation({ summary: 'Clear cart' })
  @ApiResponse({ status: 204, description: 'Cart cleared' })
  async clearCart(
    @Request() req,
    @Headers('cart-token') cartToken: string,
  ) {
    await this.cartService.clearCart({
      userId: req.user?.id,
      cartToken: !req.user ? cartToken : undefined,
    });
  }

  @Post('merge')
  @ApiOperation({ summary: 'Merge guest cart into user cart' })
  @ApiResponse({ status: 200, description: 'Carts merged successfully' })
  async mergeGuestCart(
    @Request() req,
    @Headers('cart-token') cartToken: string,
  ) {
    if (!req.user) {
      throw new BadRequestException('User must be authenticated to merge carts');
    }
    if (!cartToken) {
      throw new BadRequestException('Cart token is required');
    }

    return this.cartService.mergeGuestCartIntoUserCart(req.user.id, cartToken);
  }
}