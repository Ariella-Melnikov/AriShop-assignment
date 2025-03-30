import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Headers,
  Request,
  HttpCode,
  BadRequestException
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
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

    let cart = await this.cartService.findCart({
        userId: req.user?.id,
        cartToken: !req.user ? cartToken : undefined,
    });

    if (!cart) {
        cart = await this.cartService.createCart({
            userId: req.user?.id,
            cartToken: !req.user ? cartToken : undefined,
        });
    }

    return cart;
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 201, description: 'Item added to cart' })
  async addItem(
    @Request() req,
    @Headers('cart-token') cartToken: string,
    @Body() dto: AddCartItemDto,
  ) {
    try {
      if (!req.user && !cartToken) {
        throw new BadRequestException('Either authentication or cart-token is required');
      }

      // First try to find existing cart
      let cart = await this.cartService.findCart({
        userId: req.user?.id,
        cartToken: !req.user ? cartToken : undefined,
      });

      // If no cart exists, create a new one
      if (!cart) {
        cart = await this.cartService.createCart({
          userId: req.user?.id,
          cartToken: !req.user ? cartToken : undefined,
        });
      }

      // Add item to cart
      return this.cartService.addItem(cart._id.toString(), dto);
    } catch (error) {
      console.error('Add item error:', error);
      throw error;
    }
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
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, description: 'Item removed from cart' }) // ⬅️ changed from 204 to 200
  async removeItem(
    @Request() req,
    @Headers('cart-token') cartToken: string,
    @Param('itemId') itemId: string,
  ) {
    return await this.cartService.removeItem(
      {
        userId: req.user?.id,
        cartToken: !req.user ? cartToken : undefined,
      },
      itemId,
    )
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