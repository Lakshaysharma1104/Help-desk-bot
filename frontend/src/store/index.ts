import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chatSlice';
import conversationReducer from './slices/conversationSlice';
import settingsReducer from './slices/settingsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    conversations: conversationReducer,
    settings: settingsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
