import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import mongoose from 'mongoose'
import { Cart } from './cart.schema'
import { AddCartItemDto } from './dto/add-cart-item.dto'
import { UpdateCartItemDto } from './dto/update-cart-item.dto'
import { ProductsService } from '../products/products.service'

@Injectable()
export class CartService {
    constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>, private productsService: ProductsService) {}

    async findOrCreateCart(identifier: { userId?: string; cartToken?: string }): Promise<Cart> {
        let cart = await this.cartModel.findOne(identifier)

        if (!cart) {
            cart = await this.cartModel.create({
                ...identifier,
                items: [],
                subtotal: { amount: 0, currency: 'ILS' },
                total: { amount: 0, currency: 'ILS' },
            })
        }

        return cart
    }

    async addItem(identifier: { userId?: string; cartToken?: string }, dto: AddCartItemDto): Promise<Cart> {
        const cart = await this.findOrCreateCart(identifier)
        const product = await this.productsService.findOne(dto.productId)

        if (!product) throw new NotFoundException('Product not found')

        const variant = product.variants.find((v) => v._id.toString() === dto.variantId)
        if (!variant) throw new NotFoundException('Variant not found')

        const existingIndex = cart.items.findIndex(
            (item) => item.productId.toString() === dto.productId && item.variantId.toString() === dto.variantId
        )

        if (existingIndex > -1) {
            cart.items[existingIndex].quantity += dto.quantity
            cart.items[existingIndex].totalPrice.amount = cart.items[existingIndex].quantity * variant.price.amount
        } else {
            cart.items.push({
                _id: new mongoose.Types.ObjectId().toString(),
                productId: dto.productId,
                variantId: dto.variantId,
                quantity: dto.quantity,
                price: variant.price,
                totalPrice: {
                    amount: variant.price.amount * dto.quantity,
                    currency: variant.price.currency,
                },
                addedAt: new Date(),
            })
        }

        cart.markModified('items')
        this.recalculateCartTotals(cart)
        await cart.save()

        return this.cartModel.findById(cart._id).populate('items.productId')
    }

    async updateItemQuantity(
        identifier: { userId?: string; cartToken?: string },
        itemId: string,
        dto: UpdateCartItemDto
    ): Promise<Cart> {
        const cart = await this.findOrCreateCart(identifier)
        const item = cart.items.find((i) => i._id.toString() === itemId)

        if (!item) {
            throw new NotFoundException('Cart item not found')
        }

        item.quantity = dto.quantity
        item.totalPrice.amount = item.price.amount * dto.quantity

        cart.markModified('items')
        this.recalculateCartTotals(cart)
        await cart.save()

        return this.cartModel.findById(cart._id).populate('items.productId')
    }

    async removeItem(identifier: { userId?: string; cartToken?: string }, itemId: string): Promise<Cart> {
        const cart = await this.findOrCreateCart(identifier)
        cart.items = cart.items.filter((item) => item._id.toString() !== itemId)

        cart.markModified('items')
        this.recalculateCartTotals(cart)
        await cart.save()

        return this.cartModel.findById(cart._id).populate('items.productId')
    }

    async clearCart(identifier: { userId?: string; cartToken?: string }): Promise<void> {
        await this.cartModel.findOneAndUpdate(identifier, {
            items: [],
            subtotal: { amount: 0, currency: 'ILS' },
            total: { amount: 0, currency: 'ILS' },
        })
    }

    async mergeGuestCartIntoUserCart(userId: string, cartToken: string): Promise<Cart> {
        const [userCart, guestCart] = await Promise.all([
            this.findOrCreateCart({ userId }),
            this.cartModel.findOne({ cartToken }),
        ])

        if (!guestCart) {
            return userCart
        }

        // Merge items from guest cart to user cart
        for (const guestItem of guestCart.items) {
            const existingItem = userCart.items.find(
                (item) =>
                    item.productId.toString() === guestItem.productId.toString() &&
                    item.variantId.toString() === guestItem.variantId.toString()
            )

            if (existingItem) {
                existingItem.quantity += guestItem.quantity
                existingItem.totalPrice.amount = existingItem.price.amount * existingItem.quantity
            } else {
                userCart.items.push(guestItem)
            }
        }

        userCart.markModified('items')
        this.recalculateCartTotals(userCart)

        await Promise.all([guestCart.deleteOne(), userCart.save()])

        return this.cartModel.findById(userCart._id).populate('items.productId')
    }

    private recalculateCartTotals(cart: Cart): void {
        const subtotal = cart.items.reduce((sum, item) => sum + item.totalPrice.amount, 0)
        cart.subtotal = { amount: subtotal, currency: 'ILS' }
        cart.total = { amount: subtotal, currency: 'ILS' } // Add tax/shipping later if needed
    }
}
