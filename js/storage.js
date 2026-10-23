/**
 * storage.js - LocalStorage 管理モジュール
 */
const STORAGE_KEYS = {
  GEMINI_KEY: 'otograph_gemini_api_key',
  SPOTIFY_TOKEN: 'otograph_spotify_token',
  REGISTERED_TRACKS: 'otograph_registered_tracks'
};

export const Storage = {
  getApiKey() {
    return localStorage.getItem(STORAGE_KEYS.GEMINI_KEY) || '';
  },
  setApiKey(key) {
    localStorage.setItem(STORAGE_KEYS.GEMINI_KEY, key.trim());
  },
  getRegisteredTracks() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REGISTERED_TRACKS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },
  saveRegisteredTracks(tracks) {
    localStorage.setItem(STORAGE_KEYS.REGISTERED_TRACKS, JSON.stringify(tracks));
  }
};
