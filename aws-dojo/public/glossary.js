// AWS 認定クラウドプラクティショナー (CLF-C02) 用語帳 65語
// domain: 1=クラウドの概念 / 2=セキュリティとコンプライアンス / 3=クラウドの技術とサービス / 4=請求・料金・サポート
// 方針: 略語は「答えに直結する文字」だけ覚える(key_letter を太字にして key_meaning を添える)
// file:// でも読めるよう、JSON ではなくグローバル変数として定義する
window.AWS_GLOSSARY = [

  /* ===== 分野1 クラウドの概念(8語) ===== */
  {
    "name": "リージョン / アベイラビリティゾーン(AZ)",
    "domain": 1,
    "expand": "Availability Zone",
    "key_letter": "A",
    "key_meaning": "Availability=可用性。分けて置けば片方が落ちても続く",
    "role": "リージョンは地域、AZはその中の別の建物群",
    "cues": ["複数のAZに分散", "1か所の障害に備える", "データを置く国を選ぶ", "高可用性"],
    "confuse": "エッジロケーション(配信の出先)。本体を置く場所ではない",
    "link": "Cloudflareは勝手に世界配信→AWSは置く地域を自分で選ぶ"
  },
  {
    "name": "エッジロケーション",
    "domain": 1,
    "expand": "Edge Location",
    "key_letter": "E",
    "key_meaning": "Edge=端っこ。利用者の近くでコピーを配る出先",
    "role": "利用者の近くでデータを配る出先。CloudFrontが使う",
    "cues": ["利用者の近くから配信", "遅延を下げる", "キャッシュ"],
    "confuse": "AZは主なシステムを置く拠点。エッジは利用者の近くで配信や一部の処理を行う",
    "link": "CloudflareのCDNで自分のサイトが速かったのと同じ仕組み"
  },
  {
    "name": "スケーラビリティ / 弾力性",
    "domain": 1,
    "expand": "Scalability / Elasticity",
    "key_letter": "E",
    "key_meaning": "Elastic=伸び縮み。増やすだけでなく自動で減らせる",
    "role": "スケーラビリティは増やせる力、弾力性は自動で増減",
    "cues": ["需要に応じて自動的に", "必要な分だけに戻す", "急なアクセス増に耐える"],
    "confuse": "高可用性(落ちない話)。伸び縮みの話とは別",
    "link": "falの画像生成は使った分だけ課金→使わない時は勝手に0に戻る"
  },
  {
    "name": "疎結合",
    "domain": 1,
    "expand": "Loose Coupling",
    "key_letter": "",
    "key_meaning": "Loose=ゆるい、Coupling=つなぎ。部品どうしをゆるくつないで、1つ壊れても他が止まらないようにする",
    "role": "部品どうしの依存を減らし、変更や障害の影響を抑える",
    "cues": ["障害の影響を他に広げない", "部品ごとに増減できる", "間にキューやイベントを挟む"],
    "confuse": "処理待ちを蓄えるならSQS、一斉配信ならSNS、条件別の振り分けならEventBridge",
    "link": "むすびのボットと本体を分けてある→片方を直しても全体は止まらない"
  },
  {
    "name": "AWS Well-Architected フレームワーク",
    "domain": 1,
    "expand": "Well-Architected Framework",
    "key_letter": "",
    "key_meaning": "Well=よく、Architected=設計された、Framework=枠組み(考え方の型)。「良い設計か」を6つの柱で点検する指針",
    "role": "設計の良し悪しを6つの柱で見直す指針",
    "cues": ["6つの柱: 運用上の優秀性・セキュリティ・信頼性", "パフォーマンス効率・コスト最適化・持続可能性", "ベストプラクティスに沿っているか", "設計を見直したい"],
    "confuse": "Trusted Advisor(実際の設定を自動で点検する道具)。こちらは考え方",
    "link": "Codexと相互レビューしてから公開する流れ＝設計の見直しそのもの"
  },
  {
    "name": "クラウドの6つの利点",
    "domain": 1,
    "expand": "Six Advantages of Cloud Computing",
    "key_letter": "",
    "key_meaning": "Advantage=利点。AWSが言う「クラウドに移すと良いこと6つ」。試験は名前を言えれば足りる",
    "role": "AWSに移す理由を6つに整理した言い方",
    "cues": ["固定費を変動費に", "規模の経済", "容量の推測が不要", "スピードと俊敏性の向上", "データセンターの運用・保守への支出削減／数分で世界展開"],
    "confuse": "Well-Architectedの6つの柱(設計の指針)と数が同じで紛らわしい",
    "link": "初期費用ゼロでアプリを10本以上公開＝固定費を変動費に変えた例"
  },
  {
    "name": "移行の7つのR",
    "domain": 1,
    "expand": "Rehost / Replatform / Repurchase / Refactor / Retire / Retain / Relocate",
    "key_letter": "R",
    "key_meaning": "Rは全部が動詞の頭。Rehost=手を入れずそのまま載せ替え",
    "role": "既存システムをどう移すかの7つの選び方",
    "cues": ["そのまま移す", "作り直さずに", "使っていないので廃止", "当面は移さず残す"],
    "confuse": "リプラットフォーム(少しだけ手を入れる)とリファクタリング(作り直す)",
    "link": ""
  },
  {
    "name": "AWS CAF",
    "domain": 1,
    "expand": "Cloud Adoption Framework",
    "key_letter": "A",
    "key_meaning": "Adoption=採用。会社全体でクラウドを取り入れる進め方",
    "role": "組織のクラウド導入を6つの視点で支える指針",
    "cues": ["6つの視点: ビジネス・人材・ガバナンス", "プラットフォーム・セキュリティ・オペレーション", "組織としての移行計画", "人材や体制も含む"],
    "confuse": "Well-Architected(1つのシステムの設計)。CAFは会社全体の話",
    "link": ""
  },

  /* ===== 分野2 セキュリティとコンプライアンス(19語) ===== */
  {
    "name": "責任共有モデル",
    "domain": 2,
    "expand": "Shared Responsibility Model",
    "key_letter": "",
    "key_meaning": "Shared=分け合う、Responsibility=責任。守る仕事をAWSと利用者で分け合う決めごと",
    "role": "AWSは「クラウドの」、利用者は「クラウド内の」責任",
    "cues": ["物理設備はAWS", "EC2のゲストOS更新は利用者", "RDSのOS更新はAWS", "データとアクセス権限の管理は利用者"],
    "confuse": "S3の設備を守るのはAWS、S3に置いたデータを守るのは利用者",
    "link": "Discordボットの許可設定を自分で絞った＝クラウド内は自分の責任"
  },
  {
    "name": "AWS IAM",
    "domain": 2,
    "expand": "Identity and Access Management",
    "key_letter": "I",
    "key_meaning": "Identity=誰か。誰が何をしてよいかを決める係",
    "role": "誰が何をしてよいかを決める仕組み。無料で使える",
    "cues": ["ユーザーとグループ", "アクセス権限を与える", "全リージョン共通"],
    "confuse": "Cognito(アプリを使う一般の利用者の認証)。IAMは中の人と仕組み向け",
    "link": "ボットに読み取り系だけ許した設定＝IAMの考え方そのもの"
  },
  {
    "name": "IAMロール",
    "domain": 2,
    "expand": "Role",
    "key_letter": "R",
    "key_meaning": "Role=役。人ではなく「その場の役割」に権限を渡す",
    "role": "一時的な認証情報で、人やサービスに権限を渡す",
    "cues": ["一時的な認証情報", "EC2からS3にアクセス", "アクセスキーを埋め込まない", "別アカウントに権限を渡す"],
    "confuse": "IAMユーザーは長期の認証情報を持てる。ロールは期限つきの認証情報を発行する",
    "link": "Claude Codeからコマンドを打つ時も、鍵の直書きよりロールが安全"
  },
  {
    "name": "IAMポリシー",
    "domain": 2,
    "expand": "IAM Policy",
    "key_letter": "",
    "key_meaning": "Policy=方針(ルール)。「誰に・何を・許す/拒否する」を書いた文書",
    "role": "誰に何を許すか拒否するかを書いた文書",
    "cues": ["JSONで書く", "明示的な拒否が最優先", "アクセス許可を定義する"],
    "confuse": "許可ポリシーは権限を与える。SCPは権限の上限を定め、単独では許可しない",
    "link": "bot.pyの許可ツール一覧＝読み取りだけ許すポリシーと同じ書き方"
  },
  {
    "name": "AWS IAM Identity Center",
    "domain": 2,
    "expand": "AWS IAM Identity Center",
    "key_letter": "Identity Center",
    "key_meaning": "Identity Center=身元の集約。1回のログインで複数アカウントへ",
    "role": "1回のログインで複数アカウントに入る",
    "cues": ["シングルサインオン(SSO)", "社員が複数のアカウントを使う", "会社のIDと連携させたい", "権限のまとまりを割り当てる"],
    "confuse": "IAMユーザーはアカウントごとに作る。Identity Centerは社員のIDを一元管理する",
    "link": ""
  },
  {
    "name": "最小権限の原則",
    "domain": 2,
    "expand": "Least Privilege",
    "key_letter": "",
    "key_meaning": "Least=最小、Privilege=権限。仕事に要る分だけ許す考え方。Discordボットの権限を絞ったのと同じ",
    "role": "仕事に必要な分だけ許し、それ以上は許さない",
    "cues": ["必要最小限の権限", "何も許さない状態から足す", "権限を絞る"],
    "confuse": "職務の分離(担当を分ける)。最小権限は1人あたりの範囲を狭くする話",
    "link": "ボットにWrite/Bashを入れなかった判断が、そのまま正解になる考え方"
  },
  {
    "name": "ルートユーザー",
    "domain": 2,
    "expand": "Root User",
    "key_letter": "",
    "key_meaning": "Root=根っこ(いちばん元)。アカウントを作った最初の持ち主。何でもできるので普段は使わない",
    "role": "アカウントを作った最初の持ち主。全部できる",
    "cues": ["日常作業には使わない", "MFAで保護", "アクセスキーを作らない", "Organizationsに属さない単独アカウントの閉鎖"],
    "confuse": "日常作業はIAM Identity Centerなどで権限を得て行う。ルートは専用作業だけ",
    "link": "Apple IDと同じで、普段使いせず厳重に守る一番大事な鍵"
  },
  {
    "name": "MFA",
    "domain": 2,
    "expand": "Multi-Factor Authentication",
    "key_letter": "F",
    "key_meaning": "Factor=要素。パスワードに「もう1要素」足す",
    "role": "パスワードに加えて、もう1つの確認を足す",
    "cues": ["パスワードが盗まれても入られない", "ワンタイムコード", "ルートユーザーに必ず設定"],
    "confuse": "パスワードポリシー(強さのルール)。MFAは要素を増やす話",
    "link": "TestFlightで使うApple IDの2ファクタ認証と同じ仕組み"
  },
  {
    "name": "AWS KMS",
    "domain": 2,
    "expand": "Key Management Service",
    "key_letter": "K",
    "key_meaning": "Key=鍵。暗号化の鍵を作って預かる場所",
    "role": "暗号化の鍵を作り、預かり、使わせる仕組み",
    "cues": ["保存データの暗号化", "鍵を自分で管理したい", "他のサービスと連携して暗号化"],
    "confuse": "CloudHSM(専用の機械を借りて鍵を自分だけで持つ)。KMSは共用で手軽",
    "link": "秘密の鍵を別フォルダに隔離した運用＝AWSではKMSに預ける"
  },
  {
    "name": "AWS Secrets Manager",
    "domain": 2,
    "expand": "AWS Secrets Manager",
    "key_letter": "Secrets",
    "key_meaning": "Secrets=秘密。パスワードやAPIキーを預けて自動で入れ替える",
    "role": "パスワードやAPIキーを預かり更新する",
    "cues": ["データベースのパスワードを安全に保管", "APIキーをコードに書きたくない", "認証情報を定期的に自動で入れ替える"],
    "confuse": "KMSは暗号化の鍵を管理する。Secrets Managerはキー自体を保管し自動更新する",
    "link": "APIキーを~/.fal_keyに1行で置いて権限600にした経験→鍵の置き場を分ける発想"
  },
  {
    "name": "AWS WAF / AWS Shield",
    "domain": 2,
    "expand": "Web Application Firewall",
    "key_letter": "W",
    "key_meaning": "Web=Web用。通信の中身を見て怪しいものを弾く",
    "role": "WAFは中身を見て弾き、ShieldはDDoSを防ぐ",
    "cues": ["WAF：SQLインジェクションや不正なWebリクエストを遮断", "Shield：DDoS攻撃から保護", "Shield Standard：標準で自動適用"],
    "confuse": "WAFはWeb通信をルールで検査し、管理済みルールも使える。ShieldはDDoS対策",
    "link": "Cloudflareが勝手にやってくれていた防御＝AWSでは自分で付ける"
  },
  {
    "name": "Amazon GuardDuty",
    "domain": 2,
    "expand": "Amazon GuardDuty",
    "key_letter": "Guard",
    "key_meaning": "Guard=見張り。ログを見て怪しい「動き」を知らせる",
    "role": "ログを見て怪しい動きを見つけ、知らせる",
    "cues": ["脅威の検出", "不審なAPI呼び出し", "マルウェアや不正アクセスの兆候", "ログを分析して"],
    "confuse": "Inspector(弱点の検査)、Macie(個人情報の発見)。GuardDutyは動きを見る",
    "link": ""
  },
  {
    "name": "Amazon Inspector",
    "domain": 2,
    "expand": "Inspector(検査官)",
    "key_letter": "I",
    "key_meaning": "Inspect=検査する。ソフトの弱点を自動で探す",
    "role": "EC2やコンテナの弱点(脆弱性)を自動で検査",
    "cues": ["脆弱性スキャン", "パッチ未適用を見つける", "コンテナイメージの検査"],
    "confuse": "GuardDuty(怪しい動きの検出)。Inspectorは「弱点」そのものを探す",
    "link": "検査係にコードを見せて弱点を指摘してもらう流れと同じ役割"
  },
  {
    "name": "Amazon Macie",
    "domain": 2,
    "expand": "Amazon Macie",
    "key_letter": "",
    "key_meaning": "Macie=意味のない名前(丸のみ)。S3の中の個人情報(名前・カード番号など)を見つける",
    "role": "S3の中から個人情報を見つけて教える",
    "cues": ["機密データの発見", "S3に個人情報が入っていないか", "カード番号やマイナンバー"],
    "confuse": "GuardDutyは動き、Inspectorは弱点、MacieはS3の「中身」",
    "link": "連絡先はsecretaryに置かないと決めた話＝置き場の中身を見張る役"
  },
  {
    "name": "AWS Security Hub CSPM",
    "domain": 2,
    "expand": "Cloud Security Posture Management",
    "key_letter": "P",
    "key_meaning": "Posture=姿勢。今の設定が基準に合っているかを一覧にする",
    "role": "あちこちの警告を1画面に集めて基準と照らす",
    "cues": ["複数のサービスの結果を集約", "1つのダッシュボードで一元管理", "基準への準拠状況"],
    "confuse": "GuardDuty/Inspector/Macieは見つける側。CSPMは集めて基準と照らす側",
    "link": "盤で全プロジェクトの状態を1画面にまとめたのと同じ発想"
  },
  {
    "name": "AWS Organizations / SCP",
    "domain": 2,
    "expand": "Service Control Policy",
    "key_letter": "C",
    "key_meaning": "Control=統制。子アカウントにできる事の上限を決める",
    "role": "複数アカウントをまとめて管理し、上限を決める",
    "cues": ["複数のAWSアカウントを一元管理", "部門ごとにアカウントを分ける", "できる事の上限を決める", "一括請求"],
    "confuse": "IAMの許可ポリシー(権限を与える)。SCPは上限だけ決め、単独では許可しない",
    "link": ""
  },
  {
    "name": "AWS CloudTrail",
    "domain": 2,
    "expand": "AWS CloudTrail",
    "key_letter": "Trail",
    "key_meaning": "Trail=足跡。誰がいつ何をしたかの記録",
    "role": "誰がいつ何をしたかの操作記録を残す",
    "cues": ["監査に使う", "誰がその操作をしたか", "APIの呼び出し履歴"],
    "confuse": "CloudWatchは稼働状況、Configは設定と変化。CloudTrailは人やサービスの操作",
    "link": "作業ログを毎日残す習慣と同じ。後から誰が何をしたか辿れる"
  },
  {
    "name": "AWS Config",
    "domain": 2,
    "expand": "AWS Config",
    "key_letter": "Config",
    "key_meaning": "Config=設定。今の設定と、その変わり方を記録して点検する",
    "role": "設定の履歴を残し、ルール違反を見つける",
    "cues": ["設定の変更履歴", "望ましい設定から外れていないか", "ルールへの準拠を継続的に確認", "変更の前後を比べたい"],
    "confuse": "CloudTrailは誰が操作したか、CloudWatchは稼働状況、Configは設定とその履歴",
    "link": "設定ファイルの変化をgitの履歴で追うのと同じ役割"
  },
  {
    "name": "AWS Artifact",
    "domain": 2,
    "expand": "Artifact(成果物)",
    "key_letter": "A",
    "key_meaning": "Artifact=作られた物。ここでは監査の報告書そのもの",
    "role": "AWSの監査報告書をダウンロードする窓口",
    "cues": ["コンプライアンス報告書", "ISOやSOCの証明が欲しい", "監査人に提出する書類"],
    "confuse": "Security Hub(自分の設定の点検)。ArtifactはAWS側が出す証明書類",
    "link": ""
  },

  /* ===== 分野3 クラウドの技術とサービス(28語) ===== */
  {
    "name": "Amazon EC2",
    "domain": 3,
    "expand": "Elastic Compute Cloud",
    "key_letter": "C",
    "key_meaning": "Compute=計算。AWSで借りる「サーバー1台」",
    "role": "AWSの中に借りるサーバー1台。中身は自由",
    "cues": ["OSに自分で入る", "インスタンスタイプを選ぶ", "パッチは自分で当てる", "既存のアプリをそのまま動かす"],
    "confuse": "Lambda(サーバーを触らない)、Lightsail(定額の簡単版)",
    "link": "Macで動かしているむすびのボットを24時間動かすならEC2に置く"
  },
  {
    "name": "Amazon EBS",
    "domain": 3,
    "expand": "Elastic Block Store",
    "key_letter": "B",
    "key_meaning": "Block=ブロック。EC2に付ける1台ぶんのディスク",
    "role": "EC2に接続し、停止後もデータが残るディスク",
    "cues": ["ブロックストレージ", "インスタンスを停止しても残る", "1台のEC2に接続", "スナップショットで控えを取る"],
    "confuse": "通常は1台に接続するが複数接続の例外もある。終了時は設定により削除される",
    "link": "iCloudの巻き戻りで消えた経験→EBSはスナップショットで戻せる"
  },
  {
    "name": "Amazon S3",
    "domain": 3,
    "expand": "Simple Storage Service",
    "key_letter": "Storage",
    "key_meaning": "Storage=倉庫。Sが3つ並ぶからS3。ファイルを置く倉庫",
    "role": "ファイルを置く倉庫。URLで取れる。量は無制限",
    "cues": ["容量は無制限", "静的なWebサイトの公開", "画像や動画の保管", "耐久性が非常に高い"],
    "confuse": "EBS(サーバーに付けるディスク)。S3はサーバーなしで直接置ける",
    "link": "Cloudflareに置いた静的サイト＝AWSならS3とCloudFront"
  },
  {
    "name": "Amazon S3 Glacier",
    "domain": 3,
    "expand": "Glacier(氷河)",
    "key_letter": "G",
    "key_meaning": "Glacier=氷河。長期保管向けで、取り出す速さに応じて種類を選ぶ",
    "role": "めったに見ないファイルを長期保管する棚",
    "cues": ["長期保管", "ほとんど取り出さない", "即時取得ならInstant Retrieval", "最低保管単価ならDeep Archive"],
    "confuse": "Instant Retrievalは即時、Flexibleは分〜時間、Deep Archiveは最低保管単価",
    "link": "終わった案件のスクショや素材の置き場＝安く寝かせておく棚"
  },
  {
    "name": "Amazon EFS",
    "domain": 3,
    "expand": "Elastic File System",
    "key_letter": "F",
    "key_meaning": "File=ファイル。複数のサーバーから同時に使える置き場",
    "role": "複数のサーバーで同時に使える共有の置き場",
    "cues": ["複数のEC2から同時にアクセス", "共有ファイルシステム", "Linux向け"],
    "confuse": "EBSは通常1台に接続するディスク。共有はEFS(Linux)かFSx for Windows File Server",
    "link": "iCloudでMacとiPhoneが同じフォルダを見るのと同じ形"
  },
  {
    "name": "Amazon RDS",
    "domain": 3,
    "expand": "Relational Database Service",
    "key_letter": "R",
    "key_meaning": "Relational=表の関係。いわゆる普通のSQLデータベース",
    "role": "面倒をAWSが見てくれる普通のデータベース",
    "cues": ["MySQLやPostgreSQL", "バックアップやパッチをAWSが行う", "マネージド", "マルチAZで待機を用意"],
    "confuse": "DynamoDB(表の関係がないNoSQL)、EC2に自分で入れる方式(全部自分で面倒を見る)",
    "link": ""
  },
  {
    "name": "Amazon Aurora",
    "domain": 3,
    "expand": "Amazon Aurora",
    "key_letter": "",
    "key_meaning": "Aurora=オーロラ(意味のない名前、丸のみ)。MySQL/PostgreSQL互換のAWS製データベース",
    "role": "RDSで使えるAWS製のデータベースエンジン",
    "cues": ["MySQL/PostgreSQLと互換", "もっと高い性能が必要", "複数のAZに自動で複製"],
    "confuse": "MySQL/PostgreSQL互換で高性能・高可用性を狙う。費用は構成と利用量で変わる",
    "link": ""
  },
  {
    "name": "Amazon DynamoDB",
    "domain": 3,
    "expand": "Amazon DynamoDB",
    "key_letter": "",
    "key_meaning": "Dynamo=発電機(勢いよく動く)、DB=データベース。表の形を決めずに入れられて、とても速い",
    "role": "決まった表の形がない、とても速いデータベース",
    "cues": ["NoSQL", "ミリ秒の応答", "キーと値で持つ", "サーバーレスで自動に拡張"],
    "confuse": "RDS(表と関係を扱うSQL)。大量データの集計はRedshift",
    "link": "アプリの状態をJSONのまま保存しているのと同じ持ち方"
  },
  {
    "name": "Amazon ElastiCache",
    "domain": 3,
    "expand": "Amazon ElastiCache",
    "key_letter": "Cache",
    "key_meaning": "Cache=一時置き。よく読むデータをメモリに置いて即答する",
    "role": "よく読むデータをメモリに置いて速く返す",
    "cues": ["読み取りが多くて遅い", "同じ問い合わせが繰り返される", "ミリ秒未満の応答", "RedisやMemcached"],
    "confuse": "RDSやDynamoDBは本体の保管先。ElastiCacheは手前に写しを置いて速くする",
    "link": ""
  },
  {
    "name": "Amazon Redshift",
    "domain": 3,
    "expand": "Amazon Redshift",
    "key_letter": "",
    "key_meaning": "Redshift=意味のない名前(丸のみ)。大量データを集計する分析用の倉庫(データウェアハウス)",
    "role": "大量のデータをまとめて集計する分析用の倉庫",
    "cues": ["データウェアハウス", "経営分析(BI)", "何年分もの履歴を集計"],
    "confuse": "RDSは日々の読み書き、Redshiftは分析専用、AthenaはS3に直接SQL",
    "link": ""
  },
  {
    "name": "AWS DMS",
    "domain": 3,
    "expand": "AWS Database Migration Service",
    "key_letter": "Migration",
    "key_meaning": "Migration=移行。動かしたままデータベースを移す道具",
    "role": "データベースを動かしたまま移す",
    "cues": ["データベースを移行したい", "移行中も止めたくない", "別のエンジンへ移す", "移行後も変更を複製し続ける"],
    "confuse": "Snow Familyは物理輸送、DataSyncはファイル転送、DMSはデータベースの移行",
    "link": ""
  },
  {
    "name": "AWS Lambda",
    "domain": 3,
    "expand": "AWS Lambda",
    "key_letter": "",
    "key_meaning": "Lambda=意味のない名前(丸のみ)。サーバーを持たず、コードを呼ばれた時だけ動かす",
    "role": "コードだけ置くと、呼ばれた時だけ動く仕組み",
    "cues": ["サーバーを管理せずに", "使った分だけ課金", "イベントで起動する", "短い処理"],
    "confuse": "EC2はOSや実行環境を自分で管理する。Lambdaはサーバー管理なしで関数を実行",
    "link": "falの生成は呼んだ時だけ課金＝呼ばれた時だけ動いて払う形そのもの。9/17に確かめた: Lambda自体が画像加工をするのではなく、自分が用意したプログラムを呼ばれた時に実行する係。家計簿の月末集計なら、EventBridge Schedulerが決めた日時にLambdaを呼び、Lambdaが集計プログラムを走らせる"
  },
  {
    "name": "Amazon ECS / EKS / AWS Fargate",
    "domain": 3,
    "expand": "Elastic Container Service / Elastic Kubernetes Service",
    "key_letter": "K",
    "key_meaning": "K=Kubernetes。Kが付いたらKubernetesを使いたい問題",
    "role": "コンテナを動かす道具。Fargateは土台の管理なし",
    "cues": ["コンテナを動かす", "Kubernetesをそのまま使いたい", "サーバーの管理をしたくない", "Dockerイメージ"],
    "confuse": "ECSはAWS独自、EKSはKubernetes。Fargateはどちらでも使える土台なしの形",
    "link": ""
  },
  {
    "name": "AWS Elastic Beanstalk",
    "domain": 3,
    "expand": "AWS Elastic Beanstalk",
    "key_letter": "Beanstalk",
    "key_meaning": "Beanstalk=豆の木。コードを渡すと動く環境が生える",
    "role": "コードを渡すと必要な物を用意して動かす",
    "cues": ["コードをアップロードするだけ", "環境を自動で構築", "裏のEC2は自分でも触れる"],
    "confuse": "CloudFormation(構成を自分で書く)。Beanstalkは中身をおまかせにする",
    "link": "TestFlightに上げると配信用の環境が整うのと似た手軽さ"
  },
  {
    "name": "AWS CloudFormation",
    "domain": 3,
    "expand": "AWS CloudFormation",
    "key_letter": "Formation",
    "key_meaning": "Formation=編成。構成を決まった形式のテンプレートで定義する",
    "role": "構成をテンプレートに書き、資源をまとめて作る",
    "cues": ["Infrastructure as Code", "同じ環境を何度でも作る", "テンプレートから一括で作成"],
    "confuse": "Beanstalk(アプリを渡すだけ)。CloudFormationは土台そのものを書く",
    "link": "wrangler.tomlに設定を書いて毎回同じ形で公開しているのと同じ考え"
  },
  {
    "name": "Amazon VPC",
    "domain": 3,
    "expand": "Virtual Private Cloud",
    "key_letter": "P",
    "key_meaning": "Private=自分専用。AWSの中に区切った自分だけの区画",
    "role": "AWSの中に区切った自分専用のネットワーク",
    "cues": ["自分専用のネットワーク", "サブネットに分ける", "インターネットから隔離する", "IPアドレスの範囲を決める"],
    "confuse": "パブリックはインターネットGWへの直接経路がある。プライベートはNAT経由で外へ",
    "link": ""
  },
  {
    "name": "セキュリティグループ / ネットワークACL",
    "domain": 3,
    "expand": "Network Access Control List",
    "key_letter": "L",
    "key_meaning": "List=表。番号順に上から見て、許可か拒否かを決める",
    "role": "SGはサーバーの門番、NACLはサブネットの門番",
    "cues": ["ポートを開ける", "許可だけを書く", "拒否も書ける", "ステートフルかステートレスか"],
    "confuse": "SGは戻りの通信を自動で許す。NACLは行きと戻りを両方書く",
    "link": ""
  },
  {
    "name": "Amazon Route 53",
    "domain": 3,
    "expand": "Route 53",
    "key_letter": "53",
    "key_meaning": "53はDNSのポート番号。53と見たらDNSと決めてよい",
    "role": "ドメイン名をIPアドレスに変える係。DNS",
    "cues": ["ドメインの登録", "DNS", "宛先を地域や状態で振り分ける", "ヘルスチェック"],
    "confuse": "CloudFront(配信を速くする)。Route 53は宛先を教えるだけ",
    "link": "独自ドメインをCloudflareでつないだ作業＝AWSならRoute 53"
  },
  {
    "name": "Amazon CloudFront",
    "domain": 3,
    "expand": "Amazon CloudFront",
    "key_letter": "Front",
    "key_meaning": "Front=前線。利用者に一番近い最前線に置いて配る",
    "role": "利用者に一番近い場所から、速く配る係",
    "cues": ["世界中の利用者に速く配信", "CDN", "キャッシュ", "エッジロケーションを使う"],
    "confuse": "S3(置き場)。CloudFrontはその前に立って配る係",
    "link": "CloudflareのCDNでアプリが速く開いたのと同じ役割"
  },
  {
    "name": "Elastic Load Balancing(ELB)",
    "domain": 3,
    "expand": "Elastic Load Balancing",
    "key_letter": "Balancing",
    "key_meaning": "Balancing=バランス(振り分け)。通信を複数の処理先に振り分け、集中を抑える",
    "role": "来た通信を複数のサーバーに振り分ける係",
    "cues": ["トラフィックを分散", "1台落ちても続く", "複数のAZにまたがる", "ヘルスチェック"],
    "confuse": "Auto Scaling(台数を増減)。ELBは配るだけで台数は増やさない",
    "link": "9/17に音声で確かめた: ELBは「仕事量を振り分ける」、Auto Scalingは「台数を増減する」。店で言えば、ELBは客をレジに振り分ける係、Auto Scalingはレジを開ける台数を決める係"
  },
  {
    "name": "Amazon EC2 Auto Scaling",
    "domain": 3,
    "expand": "Auto Scaling(自動増減)",
    "key_letter": "S",
    "key_meaning": "Scaling=増減。混んだら増やし、空いたら減らす",
    "role": "混み具合に応じてサーバーの台数を自動で増減",
    "cues": ["需要に応じて自動的に", "使わない台を減らして節約", "最小と最大の台数を決める"],
    "confuse": "ELBと組で使う。1台を大きくする垂直スケールとは別物",
    "link": "9/17に音声で確かめた: Auto Scalingは台数を増減する係。振り分けるのはELB。混んだらレジを増やし、空いたら閉める"
  },
  {
    "name": "Amazon CloudWatch",
    "domain": 3,
    "expand": "Amazon CloudWatch",
    "key_letter": "Watch",
    "key_meaning": "Watch=見張り。数値とログを見て、限度を超えたら知らせる",
    "role": "数値とログを見張り、異常ならアラームを出す",
    "cues": ["CPU使用率の監視", "しきい値を超えたら通知", "ログの収集", "メトリクス"],
    "confuse": "CloudTrail(誰が操作したか)。CloudWatchは調子を見る",
    "link": "bot.logを見て不具合を直す作業＝CloudWatchがやっていること。9/17に確かめた3つ組: CloudWatchは状態の監視、CloudTrailは操作の記録、IAMはアクセス権限"
  },
  {
    "name": "Amazon SQS / SNS / EventBridge",
    "domain": 3,
    "expand": "Simple Queue Service / Simple Notification Service",
    "key_letter": "Queue",
    "key_meaning": "Queue=キュー(待ち行列)。SQSは処理待ちのメッセージを蓄える",
    "role": "処理待ちの保存、一斉配信、イベント連携を担う",
    "cues": ["SQS：メッセージを蓄えて非同期処理", "SNS：購読先へ一斉配信", "EventBridge：AWSやSaaSのイベントを条件で振り分け", "疎結合にする"],
    "confuse": "SQS標準キューは順序を保証しない。順序保証はFIFO、保存期間にも上限がある",
    "link": "家計簿アプリのLINE通知＝SNSと同じ「一斉に知らせる」役。9/17に確かめた: EventBridge Schedulerは「決めた日時にLambdaを呼ぶ目覚まし」。月末集計の例で理解した"
  },
  {
    "name": "Amazon Bedrock / SageMaker AI",
    "domain": 3,
    "expand": "Amazon Bedrock / Amazon SageMaker AI",
    "key_letter": "Bedrock",
    "key_meaning": "Bedrock=岩盤。基盤モデルを共通のAPIで呼んで使う",
    "role": "生成AIの活用と、機械学習の開発・運用を支える",
    "cues": ["Bedrock：基盤モデルを共通APIで利用", "SageMaker AI：機械学習モデルの開発から運用まで管理", "生成AIをすぐ使いたい"],
    "confuse": "Bedrockは基盤モデル中心の生成AI開発、SageMaker AIは機械学習全般を支援",
    "link": "Claude CodeのAPIで秘書AIを動かす形＝Bedrockに近い"
  },
  {
    "name": "AWS Direct Connect / VPN",
    "domain": 3,
    "expand": "Direct Connect / Virtual Private Network",
    "key_letter": "D",
    "key_meaning": "Direct=直結。専用線で会社とAWSを物理的につなぐ",
    "role": "会社とAWSをつなぐ道。専用線か暗号化の道",
    "cues": ["専用線", "安定した帯域が必要", "インターネット経由で暗号化", "すぐ使い始めたい"],
    "confuse": "VPNは安くすぐ始められる。Direct Connectは高いが安定して速い",
    "link": ""
  },
  {
    "name": "AWS Snow Family",
    "domain": 3,
    "expand": "Snow(雪)",
    "key_letter": "S",
    "key_meaning": "Snowball=雪玉。物理の箱にデータを詰めて郵送する",
    "role": "大量データを箱に入れて郵送で運ぶ仕組み",
    "cues": ["回線が細い、または届かない場所", "大容量のデータ移行", "回線だと何か月もかかる"],
    "confuse": "物理輸送の旧来の選択肢。Snowball Edgeは既存顧客限定、2026年末に終了予定",
    "link": ""
  },
  {
    "name": "Athena / Glue / Quick Sight",
    "domain": 3,
    "expand": "Quick Sight(素早い視界)",
    "key_letter": "Sight",
    "key_meaning": "Sight=視界。Quick Sightはグラフで見せる係",
    "role": "S3のデータを、つないで、聞いて、見せる",
    "cues": ["S3のデータにSQLで問い合わせ", "サーバーなしで分析", "ダッシュボードで見える化", "データの前処理(ETL)"],
    "confuse": "Athena=聞く、Glue=つないで整える、Quick Sight=グラフで見せる(旧QuickSight)",
    "link": ""
  },
  {
    "name": "AWS Trusted Advisor",
    "domain": 3,
    "expand": "Trusted Advisor",
    "key_letter": "A",
    "key_meaning": "Advisor=アドバイザー。今の設定を点検して改善点を出す",
    "role": "今の使い方を点検して、直す所を教えてくれる",
    "cues": ["コストの無駄を見つける", "セキュリティの推奨事項", "使っていないリソース", "サービス制限に近づいている"],
    "confuse": "Well-Architected(設計の考え方)。Trusted Advisorは実際の設定を自動点検",
    "link": "Codexに設定を見てもらって指摘を受ける流れと同じ役割"
  },

  /* ===== 分野4 請求・料金・サポート(10語) ===== */
  {
    "name": "オンデマンド料金",
    "domain": 4,
    "expand": "On-Demand",
    "key_letter": "D",
    "key_meaning": "Demand=要求。欲しい時に使い、使った分だけ払う",
    "role": "契約なしで、使った分だけ払う基準の払い方",
    "cues": ["前払いなし", "いつでも止められる", "短期間で読めない利用", "まず試したい"],
    "confuse": "リザーブド(長く使う約束で安い)、スポット(中断ありで最安)、専有ホスト(物理を丸ごと)",
    "link": "falやClaudeの従量課金と同じ払い方。使った分だけ後から請求"
  },
  {
    "name": "リザーブドインスタンス / Savings Plans",
    "domain": 4,
    "expand": "Reserved Instance",
    "key_letter": "R",
    "key_meaning": "Reserve=予約。1年か3年使うと約束して安くする",
    "role": "1年か3年使うと約束して安くする払い方",
    "cues": ["1年または3年", "長期間ずっと使う", "前払いするほど安い", "費用を下げたい"],
    "confuse": "RIは条件に合う利用への割引で容量予約は種類による。SPは1時間の利用額を約束",
    "link": ""
  },
  {
    "name": "スポットインスタンス",
    "domain": 4,
    "expand": "Spot(その場の空き)",
    "key_letter": "S",
    "key_meaning": "Spot=余剰容量の利用枠。安く借りられるが、中断に備える",
    "role": "余剰の計算資源を割安で借りる。中断がある",
    "cues": ["中断を許容できる", "再実行できる処理", "余剰容量を割安で利用", "バッチ処理や検証"],
    "confuse": "オンデマンドは回収による中断がない。スポットも中断に耐える設計なら本番可",
    "link": ""
  },
  {
    "name": "AWS 無料利用枠",
    "domain": 4,
    "expand": "Free Tier",
    "key_letter": "",
    "key_meaning": "Free=無料、Tier=段階(枠)。新しいアカウントが試せる無料の枠",
    "role": "新しいアカウントが試すための無料の枠",
    "cues": ["無料プランと有料プラン", "新規登録時のクレジット", "サービス別の無料上限", "アカウント作成日で制度が異なる", "有料プランは無料特典を超えた分が課金"],
    "confuse": "2025年7月15日以降の登録は無料/有料を選ぶ。無料は6か月かクレジット切れで終了",
    "link": "無料枠と従量課金だけでアプリを10本以上公開してきたやり方と同じ"
  },
  {
    "name": "AWS Cost Explorer",
    "domain": 4,
    "expand": "Cost Explorer(費用の探索)",
    "key_letter": "E",
    "key_meaning": "Explore=探る。過去の請求をグラフにして掘り下げる",
    "role": "使ったお金をグラフで見て、内訳を掘る道具",
    "cues": ["過去の費用を見える化", "どのサービスにいくら使ったか", "今後の費用を予測する"],
    "confuse": "Budgets(しきい値で知らせる)、Cost and Usage Report(最も詳しい明細)",
    "link": "月次決算ページで自分の支出を眺めているのと同じ使い方"
  },
  {
    "name": "AWS Budgets",
    "domain": 4,
    "expand": "AWS Budgets",
    "key_letter": "Budgets",
    "key_meaning": "Budget=予算。決めた額に近づいたら知らせる",
    "role": "予算を決めて、超えそうになったら知らせる",
    "cues": ["しきい値を超えたら通知", "予算のアラート", "実績と予測の両方を見る"],
    "confuse": "Cost Explorerは分析と予測。Budgetsは通知するだけで、課金は止まらない",
    "link": "使いすぎに気づく通知役。設定額で請求が必ず止まる上限ではない"
  },
  {
    "name": "AWS Pricing Calculator",
    "domain": 4,
    "expand": "Pricing Calculator(料金の計算機)",
    "key_letter": "C",
    "key_meaning": "Calculator=計算機。使う前にいくらかを見積もる",
    "role": "使う前に、いくらかかるかを見積もる道具",
    "cues": ["事前に費用を見積もる", "移行前に比較したい", "まだ使っていない構成"],
    "confuse": "Cost Explorer(実際に使った額)。Calculatorはこれからの見積もり",
    "link": ""
  },
  {
    "name": "コスト配分タグ",
    "domain": 4,
    "expand": "Cost Allocation Tags",
    "key_letter": "",
    "key_meaning": "Cost=費用、Allocation=割り当て、Tag=名札。名札で費用を部門ごとに分ける。請求画面で有効化が要る",
    "role": "タグを付けて請求用に有効化し、費用を分類する",
    "cues": ["部門やプロジェクトごとの費用", "誰がいくら使ったか分けたい", "請求を分類する", "コスト配分タグとして有効化が必要"],
    "confuse": "一括請求(まとめて払う)。タグは1枚の請求の中身を分ける話",
    "link": "アプリごとに経費を分けて台帳に書いているのと同じやり方"
  },
  {
    "name": "AWSサポートプラン(TAM)",
    "domain": 4,
    "expand": "Technical Account Manager",
    "key_letter": "Account",
    "key_meaning": "Account=顧客アカウント。TAMは継続的な技術支援を行う担当者",
    "role": "困った時に助けてもらう契約。上ほど手厚い",
    "cues": ["本番環境が停止している", "24時間365日の対応", "指定のTAMが欲しい", "応答時間を短くしたい"],
    "confuse": "Basicは請求と基本のチェックのみ。技術サポートはBusiness Support+、TAMはEnterprise以上",
    "link": ""
  },
  {
    "name": "一括請求(Consolidated Billing)",
    "domain": 4,
    "expand": "Consolidated Billing",
    "key_letter": "C",
    "key_meaning": "Consolidate=まとめる。複数アカウントの請求を1枚に",
    "role": "複数アカウントの請求を1つにまとめて払う",
    "cues": ["請求書を1枚にしたい", "使用量を合算して割引", "Organizationsの機能"],
    "confuse": "コスト配分タグ(内訳を分ける)。一括請求はまとめる側",
    "link": ""
  }
];
