import { configureStore, combineReducers } from '@reduxjs/toolkit'
import optionReducer from '../features/optionSelection/optionSlice'
import pageStatReducer from '../features/optionSelection/pageStatSlice'
import objectiveReducer from '../features/questionStem/objectiveSlice'
import userReducer from '../features/authentication/userSlice'
import postReducer from '../features/post/postSlice'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import logger from 'redux-logger';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const rootReducer = combineReducers({
    option: optionReducer,
    pageStat: pageStatReducer,
    objective : objectiveReducer,
    userInfo : userReducer,
    post : postReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      // }).concat(logger),
    }),
});

export const persistor = persistStore(store);
export default store;

// export default configureStore({
//   reducer: {
//       option: optionReducer,
//       pageStat: pageStatReducer,
//       objective : objectiveReducer,
//       userInfo : userReducer,
//       post : postReducer
//   },
// })