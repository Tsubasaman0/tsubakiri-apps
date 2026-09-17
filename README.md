# tsubakiri-apps

家電量販店で携帯売り場の責任者をしながら、育休1年の間に作って公開したアプリ集。
実装は生成AI(主にClaude)に任せ、私は「何を作るか決める・動かして確かめる・直させる」を担当。コードは少し書ける程度。

## 作ったもの

| 名前 | 一言 | 公開URL |
|---|---|---|
| AWS道場 | 資格の勉強を続く仕組みにした自分専用の稽古場。問題180問、翌日復習、寝る前の音声 | https://aws-dojo.kachikan-shindan.workers.dev |
| Claude Code案内サイト | AIコーディングツールを初めて使う人向けの案内。有料版(note)もある | https://cc-guide.kachikan-shindan.workers.dev |
| 育休のお金シミュレーター | 育休中にもらえるお金・減るお金をざっくり計算 | https://ikukyu-money.kachikan-shindan.workers.dev |
| 心の職業診断 | 6軸18問、主軸×副軸で見る診断 | https://kokoro-no-shokugyo.kachikan-shindan.workers.dev |
| ゴリラファミリーダンジョン | 家族で遊べるローグライク風ゲーム | https://gorilla-family-dungeon.kachikan-shindan.workers.dev |
| ツバキリ商会(基地サイト) | 作ったもの一覧、月次の売上と経費を公開 | https://tsubakiri.com |
| PDF→Markdown | オフラインで完結する変換ツール | ローカル実行 |
| FC風RPG(試作) | Canvas+素のJSの試作 | ローカル実行 |
| スクショ自動記録 | 画面を自動でめくって撮る | ローカル実行 |

このリポジトリに入れていないもの: 家族用の家計簿アプリ「うちのこと」(iOS・LINE連携、家族のデータを扱うため非公開)、実践帳(自分専用)、取引データを扱うツール。

## どのアプリも同じ作り方

1. **聞く** — 使う人の困りごとを聞く。最初の一言の奥にある本当の要望を、質問して出す
2. **決める** — 何を先に作り、何を後回しにするかを決めて、仕様を文章にまとめる
3. **段階に分けて作らせる** — 一度に全部作らない。段階ごとにAIに実装させ、段階ごとに自分で使って確かめる
4. **数字で確かめる** — 動いたら、元のデータと突き合わせて数字が合うかを見る。合わなければ直させる
5. **使ってもらい、直し続ける** — 使う人の端末で動かしてもらう。使い始めてから出た不具合と要望を、次の仕事にする

各アプリのREADMEに「困りごと・決めたこと・確かめたこと・AIとの分担」を書いている。

## データ分析・機械学習の練習(2025年10月〜、ChatGPT/Codexと)

別リポジトリ [20251026STRAT-PYTHON](https://github.com/Tsubasaman0/20251026STRAT-PYTHON/tree/main/portfolio)。実装はAI、データの設計と比べ方は自分。

- [SIM申込件数の需要予測](https://github.com/Tsubasaman0/20251026STRAT-PYTHON/tree/main/portfolio/demand_forecast_SIM_applications) — 売り場の感覚(3月が最多・土日が多い)を数値にした擬似データで、季節性を入れた線形回帰が「前月と同じ」よりMAEをほぼ半分に
- [携帯ショップの問い合わせ分類](https://github.com/Tsubasaman0/20251026STRAT-PYTHON/tree/main/portfolio/mobile_shop_nlp_text_classifier) — 店頭の質問を自分でラベル付け、確信度が低ければ人に戻すAPI(FastAPI+Docker)

## 自分で書いたコード(AI未使用)

- Rubyのブラックジャック(2020年): https://qiita.com/tsubasaman/items/76fcdc20555e677c0a04
- paizaスキルチェック Bランク(Python 2問満点、Ruby 1問60点。60点の原因は自分で読み直して特定)

## リンク

- サイト: https://tsubakiri.com
- X: [@tsubakirigosan](https://x.com/tsubakirigosan)
- note: https://note.com/prime_duck982
