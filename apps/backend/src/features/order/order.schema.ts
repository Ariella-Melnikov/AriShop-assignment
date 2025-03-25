import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
    Order as OrderInterface,
    OrderItem,
    ProductSnapshot,
    StatusHistoryEntry,
    Address,
    Payment,
    DeliveryMethod,
  } from '@arishop/shared';
import mongoose, { Types, Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ _id: false })
export class ProductSnapshotSchemaClass implements ProductSnapshot {
  @Prop({ required: true })
  title: string;

  @Prop({ type: Map, of: String })
  attributes: Record<string, string>;

  @Prop({ required: true })
  price: number;

  @Prop({
    type: {
      url: { type: String, required: true },
      alt: { type: String, required: true },
    },
    required: true,
  })
  media: {
    url: string;
    alt: string;
  };
}

export const ProductSnapshotSchema = SchemaFactory.createForClass(ProductSnapshotSchemaClass);

@Schema({ _id: false })
export class OrderItemSchemaClass implements OrderItem {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  productId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  variantId: string;

  @Prop({ type: ProductSnapshotSchema, required: true })
  productSnapshot: ProductSnapshot;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  totalPrice: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItemSchemaClass);

@Schema({ _id: false })
export class StatusHistoryEntrySchemaClass implements StatusHistoryEntry {
  @Prop({ required: true, enum: ['pending_payment', 'processing', 'shipped', 'delivered', 'cancelled'] })
  status: 'pending_payment' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

  @Prop({ required: true })
  timestamp: Date;
}

export const StatusHistoryEntrySchema = SchemaFactory.createForClass(StatusHistoryEntrySchemaClass);

@Schema({ timestamps: true })
export class Order extends Document implements OrderInterface {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true, unique: true })
  orderNumber: string;

  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Prop({ type: Object, required: true })
  shippingAddress: Address;

  @Prop({ type: Object, required: true })
  deliveryMethod: DeliveryMethod;

  @Prop({ type: Object, required: true })
  payment: Payment;

  @Prop({ required: true, enum: ['pending_payment', 'processing', 'shipped', 'delivered', 'cancelled'] })
  status: 'pending_payment' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

  @Prop({ type: [StatusHistoryEntrySchema], default: [] })
  statusHistory: StatusHistoryEntry[];

  @Prop()
  createdAt: Date;

  // Optional for interface alignment; normally _id is handled by Mongoose
  @Prop()
  _id: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);