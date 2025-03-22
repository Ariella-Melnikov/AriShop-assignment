import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Price, ProductMedia, Variant } from '@arishop/shared/types/product'
import { ProductMediaSchema } from './product-media.schema'
import { VariantSchema } from './variant.schema'

export type ProductDocument = Product & Document

@Schema({ timestamps: true })
export class Product {

    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    description: string

    @Prop({ type: [String], default: [] })
    categories: string[]

    @Prop({ type: [String], default: [] })
    tags: string[]

    @Prop({ type: Object, required: true })
    basePrice: Price

    @Prop({ type: [ProductMediaSchema], default: [] })
    media: ProductMedia[];
  
    @Prop({ type: [VariantSchema], default: [] })
    variants: Variant[];
  
    @Prop({ type: String })
    fragranceLevel: string;

    @Prop({ type: Object, default: { inStock: true } })
    availability: { inStock: boolean };

    @Prop()
    createdAt: Date;
  
    @Prop()
    updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product)
