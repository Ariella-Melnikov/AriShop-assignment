// services/cartService.ts
import { http } from './httpService'

export const cartService = {
  async getCart() {
    return await http.get('/cart')
  },

  async addItem(item: { productId: string; variantId: string; quantity: number }) {
    return await http.post('/cart/items', item)
  },

  async updateItem(itemId: string, quantity: number) {
    return await http.put(`/cart/items/${itemId}`, { quantity })
  },

  async removeItem(itemId: string) {
    return await http.delete(`/cart/items/${itemId}`)
  },

  async clearCart() {
    return await http.delete('/cart')
  },
}
