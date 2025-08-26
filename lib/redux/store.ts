import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { authSlice } from './slices/authSlice'
import { projectSlice } from './slices/projectSlice'
import { proposalSlice } from './slices/proposalSlice'
import { signupSlice } from './slices/signupSlice'
import { firebaseApi } from './api/firebaseApi'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    projects: projectSlice.reducer,
    proposals: proposalSlice.reducer,
    signup: signupSlice.reducer,
    [firebaseApi.reducerPath]: firebaseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(firebaseApi.middleware),
})

// Setup RTK Query listeners for caching and refetching
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
