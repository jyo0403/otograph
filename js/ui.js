/**
 * ui.js - 画面描画 & インタラクションモジュール（秋永担当）
 */
export const UI = {
  renderSearchResults(container, tracks, registeredIds, onAdd) {
    container.innerHTML = '';
    if (tracks.length === 0) {
      container.innerHTML = '<p class="track-meta">該当する楽曲が見つかりませんでした。</p>';
      return;
    }

    tracks.forEach(track => {
      const isAdded = registeredIds.includes(track.id);
      const card = document.createElement('div');
      card.className = 'track-card';
      card.innerHTML = `
        <img src="${track.cover}" class="track-cover" alt="cover">
        <div class="track-info">
          <div class="track-title">${track.title}</div>
          <div class="track-meta">${track.artist} • ${track.year}</div>
        </div>
        <span class="badge">${track.genre}</span>
        <button class="btn-add" ${isAdded ? 'disabled style="opacity:0.3;"' : ''}>
          ${isAdded ? '✓' : '＋'}
        </button>
      `;

      if (!isAdded) {
        card.querySelector('.btn-add').addEventListener('click', () => onAdd(track));
      }
      container.appendChild(card);
    });
  },

  renderRegisteredTracks(container, tracks, onRemove) {
    container.innerHTML = '';
    if (tracks.length === 0) {
      container.innerHTML = '<p class="track-meta">楽曲がまだ登録されていません。左の検索から追加してください。</p>';
      return;
    }

    tracks.forEach(track => {
      const card = document.createElement('div');
      card.className = 'track-card';
      card.innerHTML = `
        <img src="${track.cover}" class="track-cover" alt="cover">
        <div class="track-info">
          <div class="track-title">${track.title}</div>
          <div class="track-meta">${track.artist}</div>
        </div>
        <span class="badge">${track.genre}</span>
        <button class="btn-remove">✕</button>
      `;
      card.querySelector('.btn-remove').addEventListener('click', () => onRemove(track.id));
      container.appendChild(card);
    });
  },

  renderAnalysis(analysis, aiResult) {
    const aiBox = document.getElementById('ai-result-box');
    const genreContainer = document.getElementById('genre-bars');
    const eraContainer = document.getElementById('era-bars');

    if (!analysis) {
      aiBox.innerHTML = '<p class="track-meta">楽曲を登録すると、好みの分析結果とAIキャッチコピーが表示されます。</p>';
      genreContainer.innerHTML = '';
      eraContainer.innerHTML = '';
      return;
    }

    // AI言語化の表示
    if (aiResult) {
      aiBox.innerHTML = `
        <div class="ai-catchphrase">${aiResult.catchphrase}</div>
        <div class="ai-description">${aiResult.description}</div>
      `;
    }

    // ジャンルバー描画
    genreContainer.innerHTML = analysis.topGenres.slice(0, 3).map(g => `
      <div class="bar-item">
        <div class="bar-label"><span>${g.name}</span><span>${g.ratio}%</span></div>
        <div class="bar-bg"><div class="bar-fill" style="width: ${g.ratio}%;"></div></div>
      </div>
    `).join('');

    // 年代バー描画
    eraContainer.innerHTML = analysis.topEras.slice(0, 3).map(e => `
      <div class="bar-item">
        <div class="bar-label"><span>${e.name}</span><span>${e.ratio}%</span></div>
        <div class="bar-bg"><div class="bar-fill" style="width: ${e.ratio}%;"></div></div>
      </div>
    `).join('');
  },

  renderRecommendations(container, recommendations) {
    container.innerHTML = '';
    if (recommendations.length === 0) {
      container.innerHTML = '<p class="track-meta">楽曲を登録すると、おすすめ曲が表示されます。</p>';
      return;
    }

    recommendations.forEach(rec => {
      const card = document.createElement('div');
      card.className = 'recommend-card';
      card.innerHTML = `
        <div class="track-card" style="background:transparent; padding:0;">
          <img src="${rec.cover}" class="track-cover" alt="cover">
          <div class="track-info">
            <div class="track-title">${rec.title}</div>
            <div class="track-meta">${rec.artist} • ${rec.year}</div>
          </div>
          <span class="badge" style="background:rgba(236,72,153,0.2); color:#f472b6;">マッチ度 ${rec.matchScore}%</span>
        </div>
        <div class="reason-box">💡 <b>選出理由:</b> ${rec.reason}</div>
      `;
      container.appendChild(card);
    });
  }
};
