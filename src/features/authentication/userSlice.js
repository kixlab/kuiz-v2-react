import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'setKeyword',
  initialState: {
    userInfo:{},
    cid:""
  },
  reducers: {
    loginUser: (state, action) => {
      state.userInfo = action.payload
    },
    logoutUser: (state, action) => {
        state.userInfo = action.payload
    },
    enrollClass:(state, action) => {
      state.cid=action.payload
    }
  },
})

export const { loginUser, logoutUser, enrollClass } = userSlice.actions

export default userSlice.reducer