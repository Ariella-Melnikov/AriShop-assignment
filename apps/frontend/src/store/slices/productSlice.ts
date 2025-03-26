import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Product } from '@arishop/shared'
import { productService } from '../../services/productService'

interface ProductState {
    products: Product[]
    filteredProducts: Product[]
    allTags: string[]
    selectedTags: string[]
    loading: boolean
    error: string | null
}

const initialState: ProductState = {
    products: [],
    filteredProducts: [],
    allTags: [],
    selectedTags: [],
    loading: false,
    error: null,
}

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
    const products = await productService.fetchProducts()
    return products
})

export const fetchTags = createAsyncThunk('products/fetchTags', async () => {
    return await productService.fetchTags()
})

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        toggleTag(state, action) {
            const tag = action.payload
            if (state.selectedTags.includes(tag)) {
                state.selectedTags = state.selectedTags.filter((t) => t !== tag)
            } else {
                state.selectedTags.push(tag)
            }
            // Filtering
            if (state.selectedTags.length === 0) {
                state.filteredProducts = state.products
            } else {
                state.filteredProducts = state.products.filter((product) =>
                    product.tags.some((tag) => state.selectedTags.includes(tag))
                )
            }
        },
        clearTags(state) {
            state.selectedTags = []
            state.filteredProducts = state.products
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false
                state.products = action.payload
                state.filteredProducts = action.payload
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to fetch products'
            })
            .addCase(fetchTags.fulfilled, (state, action) => {
                state.allTags = action.payload
            })
    },
})

export const { toggleTag, clearTags } = productSlice.actions
export default productSlice.reducer
