import { Product, ProductMedia, ProductTag, Variant } from '@arishop/shared'
import { http } from './httpService'

const API_ROUTE = '/products'

interface BackendProduct {
  _id: string
  name: string
  description: string
  categories: string[]
  tags: ProductTag[]
  media: ProductMedia[]
  variants: Variant[]
  createdAt: string
  updatedAt: string
}

const transformProduct = (product: BackendProduct): Product => ({
  _id: product._id,
  name: product.name,
  description: product.description,
  categories: product.categories,
  tags: product.tags,
  media: product.media,
  variants: product.variants,
  availability: {
    inStock: product.variants?.some(v => v.inventory.quantity > 0) ?? true
  },
  createdAt: new Date(product.createdAt),
  updatedAt: new Date(product.updatedAt)
})


export const productService = {
  async fetchProducts(): Promise<Product[]> {
    const data = await http.get(`${API_ROUTE}`)
    return data.map(transformProduct)
  },

  async fetchProductById(productId: string): Promise<Product> {
    const data = await http.get(`${API_ROUTE}/${productId}`)
    return transformProduct(data)
  },

  async fetchTags(): Promise<string[]> {
    return await http.get(`${API_ROUTE}/tags`)
  }
}; 