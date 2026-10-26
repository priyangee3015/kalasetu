import { configureStore } from '@reduxjs/toolkit'
import craftsReducer from '../features/crafts/craftsSlice'
import { loadMarketplaceState, saveMarketplaceState } from '../features/crafts/persistence'

export const store = configureStore({
  reducer: { marketplace: craftsReducer },
  preloadedState: { marketplace: loadMarketplaceState() },
})

// Persist after real actions, never during startup hydration.
store.subscribe(() => saveMarketplaceState(store.getState().marketplace))
