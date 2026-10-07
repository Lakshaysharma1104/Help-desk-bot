import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AppSettings } from '@/types';
import { readJson, writeJson } from '@/utils/storage';

const SETTINGS_KEY = 'helpdesk_settings';
const DEFAULT_API_BASE_URL = 'https://help-desk-bot.onrender.com';

const defaultSettings: AppSettings = {
  theme: 'system',
  userEmail: '',
  apiBaseUrl: DEFAULT_API_BASE_URL,
};

function loadSettings(): AppSettings {
  return readJson<AppSettings>(SETTINGS_KEY, defaultSettings);
}

function persistSettings(settings: AppSettings): void {
  writeJson(SETTINGS_KEY, settings);
}

interface SettingsState extends AppSettings {}

const initialState: SettingsState = loadSettings();

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<AppSettings['theme']>) {
      state.theme = action.payload;
      persistSettings(state);
    },
    setUserEmail(state, action: PayloadAction<string>) {
      state.userEmail = action.payload.trim();
      persistSettings(state);
    },
    setApiBaseUrl(state, action: PayloadAction<string>) {
      state.apiBaseUrl = action.payload.trim();
      persistSettings(state);
    },
    resetSettings() {
      persistSettings(defaultSettings);
      return { ...defaultSettings };
    },
  },
});

export const { setTheme, setUserEmail, setApiBaseUrl, resetSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
