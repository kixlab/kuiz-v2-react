import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'setKeyword',
  initialState: {
    userInfo:{}
  },
  reducers: {
    loginUser: (state, action) => {
      state.userInfo = action.payload
    },
    logoutUser: (state, action) => {
        state.userInfo = action.payload
    }
  },
})

export const { loginUser, logoutUser } = userSlice.actions

export default userSlice.reducer