import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Address, Order } from '@arishop/shared';

@Schema({ timestamps: true }) // handles createdAt and updatedAt automatically
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

}

export const UserSchema = SchemaFactory.createForClass(User);