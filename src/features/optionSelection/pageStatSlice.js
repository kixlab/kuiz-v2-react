import { createSlice } from '@reduxjs/toolkit'

export const pageStatSlice = createSlice({
  name: 'optionSelection',
  initialState: {
    value: true,//true : option input, false : option detail
  },
  reducers: {
    changePageStat: (state, action) => {
      state.value = action.payload
    },
  },
})

export const { changePageStat } = pageStatSlice.actions

export default pageStatSlice.reducer