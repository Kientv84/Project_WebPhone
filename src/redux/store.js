import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slice/counterslice'
import userReduceer from './slice/userslice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReduceer
  },
})