import { Schema } from 'mongoose';

export const ProductMediaSchema = new Schema(
    {
      type: { type: String },
      url: { type: String },
      altText: { type: String },
    },
    { _id: true }
  );