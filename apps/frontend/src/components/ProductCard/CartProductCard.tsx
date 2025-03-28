// src/components/Cart/CartProductCard.tsx
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { CartItem } from '@arishop/shared'

interface CartProductCardProps {
  cartItem: CartItem
  onQuantityChange: (variantId: string, quantity: number) => void
  onRemove: (variantId: string) => void
}

export const CartProductCard = ({
  cartItem,
  onQuantityChange,
  onRemove,
}: CartProductCardProps) => {
  const { productId, variantId, quantity } = cartItem

  const product = useSelector((state: RootState) =>
    state.products.products.find((p) => p._id === productId)
  )

  const variant = product?.variants.find((v) => v._id === variantId)

  if (!product || !variant) return null

  const imageUrl = product.media?.[0]?.url || ''
  const totalPrice = (variant.price.amount * quantity).toFixed(2)

  return (
    <div className="cart-product-card">
      <div className="image-container">
        <img src={imageUrl} alt={product.name} />
      </div>

      <div className="info-container">
        <h3 className="title">{product.name}</h3>
        <p className="description">{product.description}</p>

        <div className="controls">
          <span className="label">Qty:</span>
          <button onClick={() => onQuantityChange(variantId, quantity - 1)}>-</button>
          <span className="quantity">{quantity}</span>
          <button onClick={() => onQuantityChange(variantId, quantity + 1)}>+</button>
        </div>

        <div className="footer-row">
          <div className="total-price">{totalPrice} ₪</div>
          <button className="remove-btn" onClick={() => onRemove(variantId)}>
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}
