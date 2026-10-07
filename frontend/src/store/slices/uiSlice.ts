import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
  isMobileNavOpen: boolean;
  composerDraft: string;
}

const initialState: UiState = {
  sidebarOpen: true,
  isMobileNavOpen: false,
  composerDraft: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setMobileNavOpen(state, action: PayloadAction<boolean>) {
      state.isMobileNavOpen = action.payload;
    },
    setComposerDraft(state, action: PayloadAction<string>) {
      state.composerDraft = action.payload;
    },
    clearComposerDraft(state) {
      state.composerDraft = '';
    },
  },
});

export const {
  setSidebarOpen,
  toggleSidebar,
  setMobileNavOpen,
  setComposerDraft,
  clearComposerDraft,
} = uiSlice.actions;

export default uiSlice.reducer;
