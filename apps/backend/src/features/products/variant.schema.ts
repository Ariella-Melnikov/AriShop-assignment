import { Schema } from 'mongoose';

export const VariantSchema = new Schema(
  {
    size: { type: String },
    color: { type: String },
    packaging: { type: String },
    price: {
      amount: Number,
      currency: String,
    },
    inventory: {
      quantity: Number,
      location: String,
      restockThreshold: Number,
      restockStatus: String,
      lastUpdated: Date,
    },
    productId: String,
  },
);