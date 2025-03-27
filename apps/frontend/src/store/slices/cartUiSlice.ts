import { createSlice } from '@reduxjs/toolkit'

interface CartUiState {
  showCartModal: boolean
}

const initialState: CartUiState = {
  showCartModal: false,
}

const cartUiSlice = createSlice({
  name: 'cartUi',
  initialState,
  reducers: {
    openCartModal: (state) => {
      state.showCartModal = true
    },
    closeCartModal: (state) => {
      state.showCartModal = false
    },
  },
})

export const { openCartModal, closeCartModal } = cartUiSlice.actions
export default cartUiSlice.reducer
