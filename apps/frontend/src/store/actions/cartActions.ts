import { createAsyncThunk } from '@reduxjs/toolkit'
import { cartService } from '../../services/cartService'
import { Cart } from '@arishop/shared'

export const fetchCart = createAsyncThunk<Cart>('cart/fetchCart', async () => {
  return await cartService.getCart() as Cart
})

export const addCartItem = createAsyncThunk<Cart, { productId: string; variantId: string; quantity: number }>(
  'cart/addCartItem',
  async (item) => {
    return await cartService.addItem(item) as Cart
  }
)

export const updateCartItem = createAsyncThunk<Cart, { itemId: string; quantity: number }>(
  'cart/updateCartItem',
  async ({ itemId, quantity }) => {
    return await cartService.updateItem(itemId, quantity)
  }
)

export const removeCartItem = createAsyncThunk<Cart, string>(
  'cart/removeCartItem',
  async (itemId) => {
    return await cartService.removeItem(itemId)
  }
)

export const clearCartItems = createAsyncThunk<void>(
  'cart/clearCartItems',
  async () => {
    await cartService.clearCart()
  }
)
