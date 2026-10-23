/**
 * spotify.js - 楽曲検索・データ取得モジュール（高橋担当）
 */
let mockTracksCache = null;

export const SpotifyAPI = {
  async init() {
    if (!mockTracksCache) {
      try {
        const res = await fetch('./data/mock-tracks.json');
        mockTracksCache = await res.json();
      } catch (e) {
        console.error('Failed to load mock tracks:', e);
        mockTracksCache = [];
      }
    }
  },

  async searchTracks(query) {
    await this.init();
    if (!query.trim()) return mockTracksCache;
    
    const q = query.toLowerCase();
    return mockTracksCache.filter(track => 
      track.title.toLowerCase().includes(q) ||
      track.artist.toLowerCase().includes(q) ||
      track.genre.toLowerCase().includes(q)
    );
  },

  async getAllCandidates() {
    await this.init();
    return mockTracksCache;
  }
};
