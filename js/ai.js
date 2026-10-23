/**
 * ai.js - 生成AI言語化モジュール（秋永・村上担当）
 */
export const AIProvider = {
  async generateSummary(analysis, apiKey) {
    if (!analysis) return null;

    const mainGenre = analysis.topGenres[0]?.name || '多様なジャンル';
    const mainEra = analysis.topEras[0]?.name || '様々な年代';
    const topArtist = analysis.topArtists[0] || '注目のアーティスト';

    // APIキーがない場合、または呼び出し失敗時のフォールバック（定型文生成）
    const fallbackData = {
      catchphrase: `「${mainEra}の風を感じる ${mainGenre} の探索者」`,
      description: `あなたは【${mainGenre}】を中心に、${mainEra}の流行サウンドを愛聴するスタイルです。
特に ${topArtist} などの表現力豊かな楽曲に強く惹かれる傾向があり、メロディの美しさと感情の波を大切にしています。`
    };

    if (!apiKey) {
      return fallbackData;
    }

    try {
      const prompt = `以下の音楽分析データに基づき、ユーザーの音楽の好みを表すキャッチコピー（1文、カギカッコ付き）と、2〜3文の説明文（日本語）を作成してください。

データ:
- メインジャンル: ${mainGenre} (${analysis.topGenres[0]?.ratio}%)
- 好みの年代: ${mainEra}
- 代表アーティスト: ${topArtist}

出力フォーマット(JSON形式のみ):
{
  "catchphrase": "キャッチコピー文",
  "description": "説明文"
}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!res.ok) throw new Error('API呼び出しエラー');

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return fallbackData;
    } catch (err) {
      console.warn('AI API Error, fallback used:', err);
      return fallbackData;
    }
  }
};
