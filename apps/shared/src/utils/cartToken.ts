export const getOrCreateCartToken = (): string => {
    let token = localStorage.getItem('cart-token')
    if (!token) {
      token = crypto.randomUUID()
      localStorage.setItem('cart-token', token)
    }
    return token
  }