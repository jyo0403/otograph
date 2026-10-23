/**
 * analyzer.js - 楽曲データの分析 & おすすめ選定モジュール（村上担当）
 */
export const Analyzer = {
  analyze(registeredTracks) {
    if (!registeredTracks || registeredTracks.length === 0) {
      return null;
    }

    const genreCounts = {};
    const eraCounts = {};
    const artistCounts = {};

    registeredTracks.forEach(track => {
      // ジャンル集計
      genreCounts[track.genre] = (genreCounts[track.genre] || 0) + 1;
      
      // 年代集計 (例: 2019 -> "2010年代")
      const era = `${Math.floor(track.year / 10) * 10}年代`;
      eraCounts[era] = (eraCounts[era] || 0) + 1;

      // アーティスト集計
      artistCounts[track.artist] = (artistCounts[track.artist] || 0) + 1;
    });

    const total = registeredTracks.length;

    const topGenres = Object.entries(genreCounts)
      .map(([name, count]) => ({ name, ratio: Math.round((count / total) * 100) }))
      .sort((a, b) => b.ratio - a.ratio);

    const topEras = Object.entries(eraCounts)
      .map(([name, count]) => ({ name, ratio: Math.round((count / total) * 100) }))
      .sort((a, b) => b.ratio - a.ratio);

    const topArtists = Object.entries(artistCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);

    return {
      totalCount: total,
      topGenres,
      topEras,
      topArtists
    };
  },

  getRecommendations(registeredTracks, allCandidates) {
    if (!registeredTracks || registeredTracks.length === 0) return [];

    const regIds = new Set(registeredTracks.map(t => t.id));
    const analysis = this.analyze(registeredTracks);
    const topGenreNames = analysis.topGenres.map(g => g.name);
    const topErasNames = analysis.topEras.map(e => e.name);

    const candidates = allCandidates.filter(t => !regIds.has(t.id));

    const scored = candidates.map(track => {
      let score = 0;
      let reasons = [];

      // ジャンル一致判定
      if (topGenreNames.includes(track.genre)) {
        score += 40;
        reasons.push(`あなたが大好きな「${track.genre}」の楽曲`);
      }

      // 同一アーティスト判定
      if (analysis.topArtists.includes(track.artist)) {
        score += 50;
        reasons.push(`登録曲にある「${track.artist}」の別楽曲`);
      }

      // 年代一致判定
      const trackEra = `${Math.floor(track.year / 10) * 10}年代`;
      if (topErasNames.includes(trackEra)) {
        score += 20;
        reasons.push(`よく聴く${trackEra}のリリース曲`);
      }

      const reasonText = reasons.length > 0 
        ? reasons.join(' / ') + ' に基づきマッチしました。'
        : 'あなたの好みの傾向に近いポップ感を持った一曲です。';

      return {
        ...track,
        matchScore: Math.min(score + 30, 98), // 30〜98%スコア
        reason: reasonText
      };
    });

    return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 4);
  }
};
