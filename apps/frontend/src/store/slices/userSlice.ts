// store/slices/userSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User, Address } from '@arishop/shared'
import { userService } from '../../services/userService'

interface UserState {
  user: User | null
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null
}

export const fetchLoggedInUser = createAsyncThunk('user/fetch', async () => {
  return await userService.getLoggedInUser()
})

export const updateUserAddress = createAsyncThunk('user/updateAddress', async (address: Address) => {
  return await userService.updateAddress(address)
})

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoggedInUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload
        state.loading = false
      })
      .addCase(updateUserAddress.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload
      })
  }
})

export const { logout } = userSlice.actions
export default userSlice.reducer
