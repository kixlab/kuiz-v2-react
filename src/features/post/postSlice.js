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
    showNotification: (state, action) => {
        state.notification = [...state.notification, action.payload]
    }
  },
})

export const { showAllPosts, showNotification } = postSlice.actions

export default postSlice.reducer