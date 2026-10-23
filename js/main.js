/**
 * main.js - 全体制御・イベント設定（室岡担当）
 */
import { Storage } from './storage.js';
import { SpotifyAPI } from './spotify.js';
import { Analyzer } from './analyzer.js';
import { AIProvider } from './ai.js';
import { UI } from './ui.js';

document.addEventListener('DOMContentLoaded', async () => {
  let registeredTracks = Storage.getRegisteredTracks();

  // 要素取得
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const registeredContainer = document.getElementById('registered-tracks');
  const recommendContainer = document.getElementById('recommendations');
  
  const apiKeyModal = document.getElementById('api-key-modal');
  const apiKeyBtn = document.getElementById('open-api-modal-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const saveKeyBtn = document.getElementById('save-key-btn');
  const apiKeyInput = document.getElementById('api-key-input');

  // 初期化
  apiKeyInput.value = Storage.getApiKey();
  await SpotifyAPI.init();

  // 更新処理
  async function updateApp() {
    Storage.saveRegisteredTracks(registeredTracks);
    const registeredIds = registeredTracks.map(t => t.id);

    // 1. 検索結果更新
    const query = searchInput.value;
    const searchList = await SpotifyAPI.searchTracks(query);
    UI.renderSearchResults(searchResults, searchList, registeredIds, handleAddTrack);

    // 2. 登録楽曲リスト更新
    UI.renderRegisteredTracks(registeredContainer, registeredTracks, handleRemoveTrack);

    // 3. 分析処理
    const analysis = Analyzer.analyze(registeredTracks);
    if (analysis) {
      const apiKey = Storage.getApiKey();
      const aiResult = await AIProvider.generateSummary(analysis, apiKey);
      UI.renderAnalysis(analysis, aiResult);

      // 4. おすすめ曲の生成
      const allCandidates = await SpotifyAPI.getAllCandidates();
      const recommendations = Analyzer.getRecommendations(registeredTracks, allCandidates);
      UI.renderRecommendations(recommendContainer, recommendations);
    } else {
      UI.renderAnalysis(null, null);
      UI.renderRecommendations(recommendContainer, []);
    }
  }

  // イベントハンドラ
  function handleAddTrack(track) {
    if (!registeredTracks.some(t => t.id === track.id)) {
      registeredTracks.push(track);
      updateApp();
    }
  }

  function handleRemoveTrack(trackId) {
    registeredTracks = registeredTracks.filter(t => t.id !== trackId);
    updateApp();
  }

  searchInput.addEventListener('input', async () => {
    const query = searchInput.value;
    const searchList = await SpotifyAPI.searchTracks(query);
    UI.renderSearchResults(searchResults, searchList, registeredTracks.map(t => t.id), handleAddTrack);
  });

  // モーダル制御
  apiKeyBtn.addEventListener('click', () => apiKeyModal.classList.add('active'));
  closeModalBtn.addEventListener('click', () => apiKeyModal.classList.remove('active'));
  saveKeyBtn.addEventListener('click', () => {
    Storage.setApiKey(apiKeyInput.value);
    apiKeyModal.classList.remove('active');
    updateApp();
  });

  // 初回描画
  updateApp();
});
