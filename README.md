# OtoGraph (オトグラフ)
> 好きな楽曲の分析・推薦 Web アプリケーション

![OtoGraph Banner](https://via.placeholder.com/800x200/1e1e2e/ffffff?text=OtoGraph+-+Music+Preference+Analyzer)

## 📌 作品概要
**OtoGraph** は、ユーザーが自分の好きな曲を登録し、その楽曲群の特徴（ジャンル・アーティスト・年代など）を分析することで、個人の好みに最適化された楽曲推薦と、音楽的アイデンティティを表すキャッチコピーの言語化を提供する Web アプリケーションです。

## ✨ 主な機能
1. **楽曲検索・登録機能**: 曲名やアーティスト名から好きな楽曲を検索・登録
2. **音楽の好みの分析機能**: 登録楽曲のジャンル比率、年代分布、トップアーティストを可視化
3. **分析結果の言語化 (AI機能)**: 生成AI APIを利用し、好みを表すキャッチコピーと解説文を自動生成（※オフライン・定型文モード対応）
4. **おすすめ楽曲の提示＆理由明示**: 分析結果に基づく推薦ロジックと、「なぜおすすめなのか」の理由を表示
5. **プレイリスト統合閲覧**: 登録楽曲とお気に入りおすすめ曲をまとめた一覧表示

## 🛠 使用技術・動作環境
- **フロントエンド**: HTML5, CSS3, JavaScript (ES6+ Vanilla JS)
- **外部 API**: Gemini API (生成AI言語化) / Spotify Web API (楽曲情報取得 ※モックデータ拡張対応)
- **デザイン**: Modern Dark UI (レスポンシブ対応)

## 👥 チーム役割分担 (Team 2)
- **室岡**: 全体進行、プログラム管理、アプリ構成設計、画面デザイン (`index.html`, `style.css`, `main.js`)
- **高橋**: 楽曲検索・登録機能、Spotify API連携 (`js/spotify.js`, `data/mock-tracks.json`)
- **村上**: 楽曲の分析アルゴリズム、おすすめ楽曲の選定処理 (`js/analyzer.js`)
- **秋永**: 分析結果表示、推薦理由表示、UIインタラクション (`js/ui.js`, `js/ai.js`, `css/components.css`)

## 🚀 使い方
1. 本リポジトリをクローンまたはダウンロードします。
```bash
git clone https://github.com/your-team/otograph.git
cd otograph
```
2. `index.html` をブラウザで開く（Webサーバー不要のスタンドアロン動作対応）。
3. 画面上の **「APIキー設定」** から Gemini API キーを設定すると、より高度なAI言語化機能が利用できます（未設定でも自動定型文モードで動作します）。
