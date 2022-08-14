import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'setKeyword',
  initialState: {
    userInfo:{},
    cid:"",
    cType:false,
    isLoggedIn:false
  },
  reducers: {
    loginUser: (state, action) => {
      state.userInfo = action.payload
      state.isLoggedIn = true
    },
    logoutUser: (state, action) => {
        state.userInfo = action.payload
        state.isLoggedIn = false
    },
    enrollClass:(state, action) => {
      if(state.isLoggedIn){
        state.cid=action.payload.cid
        state.cType=action.payload.cType
      }
    }
  },
})

export const { loginUser, logoutUser, enrollClass } = userSlice.actions

export default userSlice.reducer