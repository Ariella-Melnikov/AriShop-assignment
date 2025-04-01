import { http } from './httpService'
import { Order } from '@arishop/shared'

export const orderService = {
  async createFromRedirect(payload: any): Promise<Order> {
    return await http.post('/orders/webhook/success', payload)
  },
}
