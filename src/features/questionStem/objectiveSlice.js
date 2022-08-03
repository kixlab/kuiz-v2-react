import { createSlice } from '@reduxjs/toolkit'

export const objectiveSlice = createSlice({
  name: 'setKeyword',
  initialState: {
    keywords: [],
    verbs:[]
  },
  reducers: {
    addKeyword: (state, action) => {
      state.keywords = [...state.keywords, action.payload]
    },
    addVerb: (state, action) => {
      state.verbs = [...state.verbs, action.payload]
    },
    removeKeyword:(state, action) => {
      const newKeywords = state.keywords.filter(x=>x!==action.payload)
      state.keywords = newKeywords
    },
    removeVerb: (state, action) => {
      const newVerbs = state.verbs.filter(x=>x!==action.payload)
      state.verbs = newVerbs
    },
    // updateKeywords: (state, action) => {
    //   state.keywords = action.payload
    // },
    // updateVerbs: (state, action) => {
    //   state.verbs = action.payload
    // }
  },
})

export const { addKeyword, addVerb, removeKeyword, removeVerb, updateKeywords, updateVerbs } = objectiveSlice.actions

export default objectiveSlice.reducer