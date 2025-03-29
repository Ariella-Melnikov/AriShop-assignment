import { User, Address } from '@arishop/shared'
import { http } from './httpService'

const API_ROUTE = '/user'

export const userService = {
  getLoggedInUser(): Promise<User> {
    return http.get(`${API_ROUTE}/me`)
  },

  updateAddress(address: Address): Promise<User> {
    return http.put(`${API_ROUTE}/address`, address)
  }
}