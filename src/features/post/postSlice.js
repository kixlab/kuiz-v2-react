import { createSlice } from '@reduxjs/toolkit'

export const postSlice = createSlice({
  name: 'setKeyword',
  initialState: {
    posts: [],
    notification:false
  },
  reducers: {
    showAllPosts: (state, action) => {
      state.posts = [...state.posts, action.payload]
    },
    notification: (state, action) => {
        state.notification = [...state.notification, action.payload]
    }
  },
})

export const { showAllPosts, notification } = postSlice.actions

export default postSlice.reducer