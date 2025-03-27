import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CartItem } from '@arishop/shared'

interface CartState {
  items: CartItem[]
  subtotal: number
  total: number
  loading: boolean
  error: string | null
}

const initialState: CartState = {
  items: [],
  subtotal: 0,
  total: 0,
  loading: false,
  error: null,
}

const recalculateTotals = (state: CartState) => {
    state.subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    state.total = state.subtotal // We'll add shipping/tax later if needed
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const item = action.payload

      const existingItem = state.items.find(
        (i) => i.variantId === item.variantId
      )

      if (existingItem) {
        existingItem.quantity += item.quantity
      } else {
        state.items.push(item)
      }

      recalculateTotals(state)
    },

    removeFromCart(state, action: PayloadAction<{ variantId: string }>) {
      state.items = state.items.filter((i) => i.variantId !== action.payload.variantId)
      recalculateTotals(state)
    },

    updateQuantity(state, action: PayloadAction<{ variantId: string; quantity: number }>) {
      const item = state.items.find((i) => i.variantId === action.payload.variantId)
      if (item) {
        item.quantity = action.payload.quantity
        recalculateTotals(state)
      }
    },

    clearCart(state) {
      state.items = []
      state.subtotal = 0
      state.total = 0
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
