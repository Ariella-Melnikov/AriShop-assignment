import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Address, Order, Cart } from '@arishop/shared'
import mongoose, { Document, Types } from 'mongoose'
import { CartSchema } from '../cart/cart.schema';
import { OrderSchema } from '../order/order.schema';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  phone: string;

  @Prop({ enum: ['customer', 'admin'], default: 'customer' })
  role: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }] })
  addresses: Address[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Address' })
  defaultAddressId: Types.ObjectId;

  @Prop({ type: [OrderSchema] })
  orderHistory: Order[];

  @Prop({ type: CartSchema })
  cart: Cart;

  @Prop()
  createdAt: Date;
}
