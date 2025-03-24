import { Cart } from '../cart.schema';

export class CartTransformer {
  static transform(cart: Cart) {
    return {
      id: cart._id,
      items: cart.items.map(item => ({
        id: item._id,
        product: {
          id: typeof item.productId === 'string' ? item.productId : item.productId._id,
          name: typeof item.productId === 'string' ? undefined : item.productId.name,
          media: typeof item.productId === 'string' ? undefined : item.productId.media?.[0],
        },
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.totalPrice,
        addedAt: item.addedAt,
      })),
      subtotal: cart.subtotal,
      total: cart.total,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  }
} 