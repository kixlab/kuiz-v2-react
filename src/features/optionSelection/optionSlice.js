import { createSlice } from '@reduxjs/toolkit'

export const optionSlice = createSlice({
  name: 'optionSelection',
  initialState: {
    value: "",
  },
  reducers: {
    changeOptionSelection: (state, action) => {
      state.value = action.payload
    },
  },
})

export const { changeOptionSelection } = optionSlice.actions

export default optionSlice.reducer