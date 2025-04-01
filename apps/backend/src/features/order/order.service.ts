import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Order } from './order.schema'
import { User } from '../user/user.schema'
import { CreateOrderDto } from './dto/create-order.dto'
import { CancelOrderDto } from './dto/cancel-order.dto'
import { UpdateOrderStatusDto } from './dto/update-order-status.dto'
import { Cart } from '../cart/cart.schema'
import { v4 as uuidv4 } from 'uuid'
import { CreateOrderFromPaymentDto } from './dto/create-order-from-payment.dto'

@Injectable()
export class OrderService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<Order>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Cart.name) private cartModel: Model<Cart>
    ) {}

    async create(userId: string, dto: CreateOrderDto) {
        const cart = await this.cartModel.findOne({ userId })
        if (!cart || cart.items.length === 0) {
            throw new BadRequestException('Cart is empty')
        }

        const user = await this.userModel.findById(userId)
        if (!user) throw new NotFoundException('User not found')

        const order = new this.orderModel({
            userId,
            orderNumber: uuidv4(),
            items: cart.items.map((item) => ({
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
                price: item.price.amount,
                totalPrice: item.totalPrice.amount,
                productSnapshot: {
                    title: '',
                    attributes: {},
                    price: item.price.amount,
                    media: typeof item.productId === 'object' ? item.productId?.media?.[0] : { url: '', alt: '' },
                },
            })),
            shippingAddress: user.addresses.find((addr) => addr._id.toString() === dto.shippingAddressId),
            deliveryMethod: dto.deliveryMethodId,
            payment: dto.paymentDetails,
            status: 'pending_payment',
            statusHistory: [{ status: 'pending_payment', timestamp: new Date() }],
        })

        await order.save()
        return order
    }

    async createFromPaymentRedirect(dto: CreateOrderFromPaymentDto) {
        const { orderId, deliveryAddress, billingAddress, userInfo, deliveryDate, items, payment } = dto
      
        const order = new this.orderModel({
          orderNumber: orderId,
          deliveryAddress,
          billingAddress,
          userInfo,
          items,
          deliveryDate: new Date(deliveryDate),
          payment: {
            token: '', // guest, no token
            last4: '', // optional
            method: 'unipaas',
            approvalNumber: payment.approvalNumber,
          },
          status: 'paid',
          statusHistory: [{ status: 'paid', timestamp: new Date() }],
          createdAt: new Date(),
        })
      
        await order.save()
        return order
      }

    async findAll(userId: string, query: any) {
        const { status, from, to, page = 1, limit = 10 } = query
        const filter: any = { userId }
        if (status) filter.status = status
        if (from || to) filter.createdAt = {}
        if (from) filter.createdAt.$gte = new Date(from)
        if (to) filter.createdAt.$lte = new Date(to)

        const orders = await this.orderModel
            .find(filter)
            .skip((+page - 1) * +limit)
            .limit(+limit)
            .sort({ createdAt: -1 })

        return orders
    }

    async findOne(userId: string, id: string) {
        const order = await this.orderModel.findOne({ _id: id, userId })
        if (!order) throw new NotFoundException('Order not found')
        return order
    }

    async cancel(userId: string, id: string, dto: CancelOrderDto) {
        const order = await this.orderModel.findOne({ _id: id, userId })
        if (!order) throw new NotFoundException('Order not found')
        if (['shipped', 'delivered'].includes(order.status)) {
            throw new BadRequestException('Cannot cancel a shipped or delivered order')
        }

        order.status = 'cancelled'
        order.statusHistory.push({ status: 'cancelled', timestamp: new Date() })
        if (dto.reasonTag || dto.reasonText) {
            ;(order as any).cancelReason = {
                tag: dto.reasonTag,
                text: dto.reasonText,
            }
        }

        await order.save()
        return order
    }

    async adminFindAll(query: any) {
        const { status, from, to, page = 1, limit = 10 } = query
        const filter: any = {}
        if (status) filter.status = status
        if (from || to) filter.createdAt = {}
        if (from) filter.createdAt.$gte = new Date(from)
        if (to) filter.createdAt.$lte = new Date(to)

        return this.orderModel
            .find(filter)
            .skip((+page - 1) * +limit)
            .limit(+limit)
            .sort({ createdAt: -1 })
    }

    async updateStatus(id: string, dto: UpdateOrderStatusDto) {
        const order = await this.orderModel.findById(id)
        if (!order) throw new NotFoundException('Order not found')

        order.status = dto.status
        order.statusHistory.push({ status: dto.status, timestamp: new Date() })
        await order.save()

        return order
    }
}
