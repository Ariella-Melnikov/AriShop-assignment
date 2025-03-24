// address.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Address extends Document {
  @Prop({ required: true }) street: string;
  @Prop({ required: true }) city: string;
  @Prop({ required: true }) country: string;
  @Prop({ required: true }) zip: string;
  @Prop({ default: false }) isDefault: boolean;
  @Prop({ required: true }) userId: string; // to ensure user ownership
}

export const AddressSchema = SchemaFactory.createForClass(Address);
