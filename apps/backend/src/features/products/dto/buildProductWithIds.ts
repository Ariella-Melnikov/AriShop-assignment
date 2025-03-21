import { CreateProductDto } from './create-product.dto';
import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export function buildProductWithIds(dto: CreateProductDto) {
  const _id = new Types.ObjectId();

  const media = dto.media.map(media => ({
    ...media,
  }));

  const variants = dto.variants.map(variant => ({
    productId: _id,
    ...variant,
  }));

  return {
    _id,
    ...dto,
    media,
    variants,
    availability: {
      inStock: variants.some(v => v.inventory?.quantity > 0),
    },
  };
}