import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slice/counterslice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
})