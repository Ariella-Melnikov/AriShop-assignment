import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Order, OrderSchema } from './order.schema'
import { OrderService } from './order.service'
import { OrderController } from './order.controller'
import { AdminOrderController } from './admin-order.controller'
import { User, UserSchema } from '../user/user.schema'
import { Cart, CartSchema } from '../cart/cart.schema'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Order.name, schema: OrderSchema },
            { name: User.name, schema: UserSchema },
            { name: Cart.name, schema: CartSchema }, 
        ]),
    ],
    controllers: [OrderController, AdminOrderController],
    providers: [OrderService],
})
export class OrderModule {}
