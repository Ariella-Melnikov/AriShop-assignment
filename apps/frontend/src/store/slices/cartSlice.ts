import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CartItem, Cart, Price } from '@arishop/shared'
import {
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCartItems,
  fetchCart
} from '../actions/cartActions'

interface CartState {
  items: CartItem[]
  subtotal: Price
  total: Price
  loading: boolean
  error: string | null
}

const initialState: CartState = {
  items: [],
  subtotal: { amount: 0, currency: 'ILS' },
  total: { amount: 0, currency: 'ILS' },
  loading: false,
  error: null,
}

const normalizeCart = (cart: Cart): CartState => {
  return {
    items: cart.items
      .filter((item) => item && item.productId && item.variantId)
      .map((item) => {
        const productId =
          typeof item.productId === 'string'
            ? item.productId
            : (item.productId as { _id: string })._id

        return {
          _id: item._id,
          productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
        }
      }),
    subtotal: cart.subtotal,
    total: cart.total,
    loading: false,
    error: null,
  }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart(state) {
      state.items = []
      state.subtotal = { amount: 0, currency: 'ILS' }
      state.total = { amount: 0, currency: 'ILS' }
    },
  },
  
  extraReducers: (builder) => {
    builder
    .addCase(fetchCart.pending, (state) => {
      state.loading = true
      state.error = null
    })
    .addCase(fetchCart.fulfilled, (state, action: PayloadAction<Cart>) => {
      Object.assign(state, normalizeCart(action.payload))
    })
    .addCase(fetchCart.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || 'Failed to fetch cart'
    })

    .addCase(addCartItem.pending, (state) => {
      state.loading = true
      state.error = null
    })
    .addCase(addCartItem.fulfilled, (state, action: PayloadAction<Cart>) => {
      console.log('Cart updated:', action.payload)
      Object.assign(state, normalizeCart(action.payload))
    })
    .addCase(addCartItem.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || 'Failed to add item to cart'
      console.error('Cart error:', action.error)
    })

    .addCase(updateCartItem.fulfilled, (state, action: PayloadAction<Cart>) => {
      Object.assign(state, normalizeCart(action.payload))
    })
    .addCase(removeCartItem.fulfilled, (state, action: PayloadAction<Cart>) => {
      Object.assign(state, normalizeCart(action.payload))
    })

    .addCase(clearCartItems.fulfilled, (state) => {
      state.items = []
      state.subtotal = { amount: 0, currency: 'ILS' }
      state.total = { amount: 0, currency: 'ILS' }
      state.loading = false
      state.error = null
    })
}
})

export const { clearCart } = cartSlice.actions
export default cartSlice.reducer
