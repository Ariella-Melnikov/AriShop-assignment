import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'
import { Price } from '@arishop/shared'

interface PopulatedProduct {
    _id: string
    name: string
    media: { url: string; altText?: string }[]
}

@Schema({ _id: false })
class CartItemSchema {
    @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
    _id: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true })
    productId: string | PopulatedProduct

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    variantId: string

    @Prop({ required: true, min: 1 })
    quantity: number

    @Prop({ type: Object, required: true })
    price: Price

    @Prop({ type: Object, required: true })
    totalPrice: Price

    @Prop({ type: Date, default: Date.now })
    addedAt: Date
}

@Schema({ timestamps: true })
export class Cart extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })
    userId?: string

    @Prop({ required: false })
    cartToken?: string

    @Prop({ type: [CartItemSchema], default: [] })
    items: CartItemSchema[]

    @Prop({ type: Object, required: true })
    subtotal: Price

    @Prop({ type: Object, required: true })
    total: Price

    @Prop({ default: Date.now, expires: 3600 }) 
    createdAt: Date

    @Prop()
    updatedAt: Date
}

export const CartSchema = SchemaFactory.createForClass(Cart)

CartSchema.index({ cartToken: 1 }, { unique: true, sparse: true })
CartSchema.index({ userId: 1 }, { unique: true, sparse: true })
CartSchema.index({ 'items.productId': 1, 'items.variantId': 1 }, { unique: true, sparse: true })
