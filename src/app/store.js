import { configureStore } from '@reduxjs/toolkit'
import optionReducer from '../features/optionSelection/optionSlice'
import pageStatReducer from '../features/optionSelection/pageStatSlice'
import objectiveReducer from '../features/questionStem/objectiveSlice'


export default configureStore({
  reducer: {
      option: optionReducer,
      pageStat: pageStatReducer,
      objective : objectiveReducer
  },
})