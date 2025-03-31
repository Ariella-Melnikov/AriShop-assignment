import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Address, AnonymousUserInfo } from '@arishop/shared'

const initialState: AnonymousUserInfo = {
  firstName: '',
  lastName: '',
  email: '',
  deliveryAddress: null,
  billingAddress: null,
  billingManuallyEdited: false,
}

const anonymousUserSlice = createSlice({
  name: 'anonymousUser',
  initialState,
  reducers: {
    setAnonymousNameAndEmail(state, action: PayloadAction<{ firstName: string; lastName: string; email: string }>) {
      state.firstName = action.payload.firstName
      state.lastName = action.payload.lastName
      state.email = action.payload.email
    },
    setAnonymousDeliveryAddress(state, action: PayloadAction<Address>) {
      state.deliveryAddress = action.payload
      if (!state.billingManuallyEdited) {
        state.billingAddress = action.payload
      }
    },
    setAnonymousBillingAddress(state, action: PayloadAction<Address>) {
      state.billingAddress = action.payload
      state.billingManuallyEdited = true // now treat it as custom
    },
    clearAnonymousUser() {
      return initialState
    },
  },
})

export const {
  setAnonymousNameAndEmail,
  setAnonymousDeliveryAddress,
  setAnonymousBillingAddress,
  clearAnonymousUser,
} = anonymousUserSlice.actions

export default anonymousUserSlice.reducer
