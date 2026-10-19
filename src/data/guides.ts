import type { ExamCode, L10n } from '../types';

const L = (ja: string, en: string): L10n => ({ ja, en });

export type DomainGuide = {
  id: number;
  /** この分野で問われる知識 */
  knows: L10n[];
  /** 典型的な落とし穴(誤答の型) */
  traps?: L10n[];
};

export type ExamGuide = {
  code: ExamCode;
  tagline: L10n;
  audience: L10n;
  notFor: L10n;
  experience: L10n[];
  /** 出題の特徴 */
  format: L10n[];
  domains: DomainGuide[];
  /** 学習の進め方 */
  plan: L10n[];
  /** 正解を選ぶときの定石(ガイドの重点とサンプル問題の解説から) */
  heuristics: L10n[];
  /** ガイドが勧める実践課題 */
  handsOn?: L10n[];
};

export const GUIDES: Record<ExamCode, ExamGuide> = {
  'CCAO-F': {
    code: 'CCAO-F',
    tagline: L('Claudeを業務で使いこなす人のための、プロンプト・出力の検証・責任ある利用の試験', 'For professionals who use Claude at work: prompting, verifying output, and responsible use'),
    audience: L(
      '運用、マーケティング、プロジェクト管理、教育、広報などで Claude を生産性ツールとして使う人。社内で AI 活用の業務を保守する人や、導入・業務再設計を支援するコンサルタントも対象です。',
      'People who use Claude as a productivity tool in operations, marketing, project management, education or communications, including staff who maintain AI-enabled workflows and consultants who support adoption.',
    ),
    notFor: L(
      'API で開発する人やエージェントを設計する人は対象外です。そうした作業は Architect / Developer の認定の領域で、アソシエイトは「複雑・技術的な作業をエスカレーションできること」が求められます。',
      'Not for people who build against APIs or design agents. That scope belongs to the Architect and Developer credentials; Associates are expected to escalate complex or technical work.',
    ),
    experience: [
      L('業務での Claude の日常的な利用経験', 'Regular hands-on use of Claude in a professional setting'),
      L('構造的な問題解決・ワークフロー設計・デジタルツールの基礎理解', 'Foundational understanding of structured problem-solving, workflow design and digital tools'),
      L('幻覚・文脈の制約・データの機微性など、AI の限界の実務的な理解', 'Practical understanding of AI limitations: hallucination, context constraints, data sensitivity'),
      L('ソフトウェア開発や API の経験は不要(前提条件なし)', 'No software development or API experience is required (no prerequisites)'),
    ],
    format: [
      L('60問。単一選択と複数選択(「N個選べ」と問題文に明記)', '60 items; single- and multiple-response (each item states how many to select)'),
      L('業務の場面を設定した判断問題が中心。「最も適切な対応」を選ぶ形式', 'Mostly workplace judgment questions asking for the most appropriate action'),
      L('最大の配点は「出力の評価と検証」(21%)。次いで「ワークフロー統合」(16%)と「ガバナンス」(15%)', 'Heaviest domain is Output Evaluation & Validation (21%), then Workflow Integration (16%) and Governance (15%)'),
      L('受験料は最も安い($99)。Anthropic の案内では、この認定は Claude Partner Network のティア要件には算入されない', 'Lowest fee ($99). Per Anthropic\'s certification page, it does not count toward Claude Partner Network tier eligibility'),
    ],
    domains: [
      {
        id: 1,
        knows: [
          L('読み手・目的・形式・長さ・制約を明示したプロンプトを書く', 'Write prompts that state audience, purpose, format, length and constraints'),
          L('複雑な依頼を段階に分け、各結果を次に引き継ぐ(タスク分解)', 'Decompose complex requests into stages and carry each result forward'),
          L('出力を見て不足した文脈やフィードバックを足して反復する', 'Iterate: add missing context and targeted feedback'),
          L('作業の種類(分析・調査・下書き・ブレスト)で依頼の仕方を変える', 'Adapt prompting to the task type (analysis, research, drafting, brainstorming)'),
        ],
        traps: [
          L('大文字や「完璧に」などの強調だけで品質が上がると考える', 'Believing emphatic wording alone raises quality'),
          L('先入観を避けるため背景を伏せる、1回で全部を頼む', 'Withholding context to "avoid bias", or asking for everything in one pass'),
        ],
      },
      {
        id: 2,
        knows: [
          L('正確さ・網羅性の評価。幻覚、矛盾、偏りの見つけ方', 'Evaluate accuracy and completeness; spot hallucinations, inconsistencies and bias'),
          L('一次情報での事実確認(根拠の引用を求め、原本で確認する)', 'Fact-check against primary sources (ask for quoted evidence, then verify)'),
          L('人のレビューや追加の検証が必要な場面の見極め(対外的・法務・数値)', 'Know when human review is needed (external, legal, numeric content)'),
          L('読み手に合わせた編集と、出力形式の選択(Artifacts・インライン・表などの構造化)', 'Adapt outputs for the audience and choose formats (Artifacts, inline, tables)'),
        ],
        traps: [
          L('流暢さ・自信のある口調・リンクの有無・「同じ答えが繰り返された」を正確さの根拠にする', 'Treating fluency, confidence, links or repeated answers as proof of accuracy'),
          L('Claude に「合っていますか?」と聞いて「はい」で済ませる(自己確認は独立した検証ではない)', 'Asking Claude "is it correct?" and accepting yes (not independent verification)'),
        ],
      },
      {
        id: 3,
        knows: [
          L('機能の使い分け: チャット、Projects、リサーチモード、Artifacts', 'Choose among features: chat, Projects, research mode, Artifacts'),
          L('モデル階層の違い(Haiku / Sonnet / Opus)と、速度・コスト・品質の兼ね合い', 'Model tiers (Haiku / Sonnet / Opus) and speed-cost-quality trade-offs'),
          L('長い会話の文脈の限界。いつ要約して新しいチャットにするか、何を保存するか', 'Context limits in long chats: when to summarize, restart or persist'),
        ],
        traps: [
          L('常に最上位モデル、または常に最小モデルを選ぶ', 'Always picking the top model, or always the smallest'),
          L('簡単な質問まで Artifacts やリサーチモードで処理する', 'Using Artifacts or research mode for trivial questions'),
        ],
      },
      {
        id: 4,
        knows: [
          L('要件の整理、調査、計画づくり、プロセス改善に Claude を使う', 'Use Claude for requirements, research, planning and process optimization'),
          L('試作と反復(例: Artifacts で試作してフィードバックを得る)', 'Prototype and iterate (e.g., in Artifacts) to gather feedback'),
          L('既存の業務に組み込む: 現行プロセスの把握、小さな試行、測定、レビューを残す', 'Integrate into existing workflows: map, pilot small, measure, keep review'),
          L('価値と限界の両方を、測定結果とともに関係者へ伝える', 'Communicate value and limits to stakeholders with measured evidence'),
          L('基幹システム連携など技術的な実装は、要件を整理して Architect / Developer へエスカレーション', 'Escalate technical integrations to Architect/Developer roles with clear requirements'),
        ],
        traps: [
          L('全業務を一気に置き換える、成功例だけを報告する', 'Replacing everything at once; reporting only successes'),
        ],
      },
      {
        id: 5,
        knows: [
          L('Projects のカスタム指示とナレッジ(役割・トーン・禁止事項・出力形式)', 'Project instructions and knowledge (role, tone, prohibitions, output format)'),
          L('ナレッジの選別と保守: 関連・最新・正確な資料だけ。旧版は差し替える', 'Curate and maintain knowledge: relevant, current, accurate; replace old versions'),
          L('コネクタ(Google Drive、Gmail など)は承認された方法で、必要最小限を接続', 'Connectors (Google Drive, Gmail): approved methods, least access'),
          L('システム指示は構造化し、矛盾させず、機密や個人データを直接書かない', 'Structure instructions, avoid conflicts, never embed confidential or personal data'),
        ],
        traps: [
          L('「多いほど良い」と資料を無差別に追加、新旧の版を併存させる', 'Uploading everything; keeping old and new versions side by side'),
        ],
      },
      {
        id: 6,
        knows: [
          L('適切な用途と不適切な用途(最終診断・解雇・融資の最終判断などを AI だけに任せない)', 'Appropriate vs inappropriate uses (no sole-AI decisions on diagnosis, dismissal, lending)'),
          L('データの機微性・規制・プライバシー: 識別子の削除や匿名化、承認された環境の利用', 'Data sensitivity, regulation, privacy: remove or anonymize identifiers; use approved tools'),
          L('組織の AI 方針に従い、方針にない用途は法務・セキュリティ・ガバナンス担当に相談', 'Follow AI policy; consult legal/security/governance for uncovered uses'),
          L('倫理: 偏り・公平性・透明性(AI 利用の開示、人が責任を負う)', 'Ethics: bias, fairness, transparency (disclose AI use; humans stay accountable)'),
        ],
        traps: [
          L('「Claude に保持しないよう頼む」で方針の統制を満たしたとみなす', 'Treating "ask Claude not to retain it" as satisfying a data policy'),
          L('個人アカウントでこっそり試す、方針にないから許可と解釈する', 'Quietly trying on a personal account; reading silence as permission'),
        ],
      },
      {
        id: 7,
        knows: [
          L('期待外れの出力の診断: 目的・文脈・制約・形式・資料が足りていたか', 'Diagnose weak output: purpose, context, constraints, format, materials'),
          L('1つずつ要素を変えて再試行する(何が効いたかを分かるようにする)', 'Change one factor at a time so you can see what helped'),
          L('長さ・構成の指定、要件の番号付き整理、繰り返す指示の Project への組み込み、テンプレート化', 'Specify length/structure, number requirements, codify recurring feedback, reuse templates'),
        ],
        traps: [
          L('原因を調べずモデルを替える、全部を一度に変える', 'Switching models without diagnosing; changing everything at once'),
        ],
      },
    ],
    plan: [
      L('ガイドの7分野を読み、各目標を自己評価する(配点の大きい分野 2・4・6 を優先)', 'Read the seven domains and self-assess each objective; prioritize domains 2, 4 and 6'),
      L('普段の業務で実際に試す: Project を作って指示とナレッジを設定し、出力を検証する', 'Practice on real work: build a Project with instructions and knowledge, and verify outputs'),
      L('ドメイン別練習で弱点を洗い出し、解説を読んで「なぜ他が誤りか」まで確認する', 'Use domain practice to find weak spots; read why each wrong option is wrong'),
      L('模擬試験を2〜3回。間違い・フラグ・ブックマークを復習モードで潰す', 'Take 2–3 mock exams, then clear misses, flags and bookmarks in review mode'),
    ],
    heuristics: [
      L('出力の正しさは「自己申告」でなく「一次情報での確認」で担保する', 'Correctness comes from primary-source checks, not self-reported confidence'),
      L('品質が悪いときの最初の一手は、文脈・基準・例を足して1要素ずつ反復すること', 'First fix for poor output: add context, criteria, examples; iterate one factor at a time'),
      L('機微データは「最小化・匿名化 + 承認された環境」。「保持しないで」と頼むだけは不十分', 'Sensitive data: minimize/anonymize in an approved environment; asking not to retain is not enough'),
      L('高リスクな判断は人が最終責任を持つ。AI は下書きと整理の支援', 'Humans own high-stakes decisions; AI drafts and organizes'),
      L('モデルはタスクに合わせる(単純・大量は軽量、複雑な推論は高性能)。極端な選択肢は誤り', 'Match model to task; "always the biggest/smallest" is usually wrong'),
      L('技術的・基幹システムの実装は自分で作らず、要件を整理してエスカレーション', 'Technical or core-system implementation is escalated with clear requirements'),
    ],
  },

  'CCDV-F': {
    code: 'CCDV-F',
    tagline: L('Claude API・Agent SDK・Claude Code・MCP で、動くアプリを作って出荷できるかを問う試験', 'Builds and ships Claude-powered apps: API, Agent SDK, Claude Code and MCP'),
    audience: L(
      'AI/MLエンジニア、テックリード、シニアソフトウェアエンジニアなど。ビジネス要件を技術要件に落とし、API 連携・エージェント/ツール構築・プロンプトと文脈の設計・評価・セキュリティ・モデル選択を担う人。',
      'AI/ML engineers, tech leads and senior software engineers who turn business requirements into working systems: API integration, agents and tools, prompt and context engineering, evaluation, security and model selection.',
    ),
    notFor: L('非技術職、ソフトウェア開発の実務経験がない人、プロンプト作成だけの役割は対象外です。', 'Not for non-technical users, people without hands-on software development, or prompt-writing-only roles.'),
    experience: [
      L('ソフトウェアエンジニアリング 1〜5年', '1–5 years of software engineering'),
      L('Claude または同等の LLM を使った本番に近い経験 6か月以上', '6+ months hands-on with Claude or comparable LLM systems'),
      L('Python / TypeScript、REST API と CLI に習熟', 'Proficient in Python and/or TypeScript; fluent with REST APIs and CLIs'),
      L('LLM の基礎・エージェント・文脈管理・MCP の実務的な理解', 'Working understanding of LLM fundamentals, agents, context management and MCP'),
    ],
    format: [
      L('53問。単一選択と複数選択', '53 items; single- and multiple-response'),
      L('配点は「アプリケーションと統合」が33.1%で突出(全体の3分の1)。次いで「モデル選択と最適化」16.8%、「エージェントとワークフロー」14.7%', 'Applications & Integration is 33.1% (a third of the exam); then Model Selection & Optimization 16.8% and Agents & Workflows 14.7%'),
      L('Claude Code(3.1%)と評価・デバッグ(2.6%)は配点が小さい。優先度は低めでよい', 'Claude Code (3.1%) and Eval/Debugging (2.6%) carry little weight; lower priority'),
      L('ガイドは分野の下に細かいスキル別の配点(例: Claude API の仕組み 6.8%)も公開している', 'The guide also publishes per-skill weights (e.g., Claude API Mechanics 6.8%)'),
    ],
    domains: [
      {
        id: 1,
        knows: [
          L('ワークフローかエージェントかの判断基準。固定手順ならワークフロー(プロンプトチェーン)', 'Workflow vs agent decision criteria; fixed steps favor workflows (prompt chaining)'),
          L('マネージャー/サブエージェントの階層と、サブエージェントの役割(文脈の隔離・並列化・専門化)', 'Manager/subagent hierarchies; subagents for context isolation, parallelism, specialization'),
          L('Agent SDK、独自のエージェントループ、ホスト型(Anthropic)と自前ホストの選択、フックによる決定的な動作', 'Agent SDK, custom loops, hosted vs self-hosted deployment, hooks for deterministic actions'),
          L('ツール利用ループ、メモリ、文脈管理。フレームワーク(Strands、LangGraph、PydanticAI)の利点と抽象化のコスト', 'Tool-use loops, memory, context management; framework benefits vs abstraction cost'),
        ],
        traps: [
          L('手順が決まっているのに自律エージェントや深い階層を選ぶ', 'Choosing autonomy or deep hierarchies when steps are fixed'),
          L('ループの終了を回数や本文の語で判定する(stop_reason で判定する)', 'Ending loops by count or text matching instead of stop_reason'),
        ],
      },
      {
        id: 2,
        knows: [
          L('Messages API: ステートレス(履歴は毎回送る)、ツール、ストリーミング(SSE の delta)、画像、thinking、プロンプトキャッシュ', 'Messages API: stateless history, tools, streaming (SSE deltas), vision, thinking, prompt caching'),
          L('バッチ API(非同期・低コスト・順序保証なし・custom_id で突き合わせ)とリアルタイムの使い分け', 'Batch vs real-time (async, cheaper, unordered; match via custom_id)'),
          L('エラー処理: 429/529 は指数バックオフ + ジッター、400 系は再試行せず修正、公式 SDK の活用', 'Error handling: backoff + jitter for 429/529; fix 400s; use official SDKs'),
          L('ソフトウェア工学の基礎: REST、JSON、非同期処理、バージョン管理、コードレビュー、リファクタリング', 'Engineering basics: REST, JSON, async, version control, code review, refactoring'),
          L('アプリ設計: 指示と入力データの境界(タグ、system と user)、スキーマ設計(enum と required)、セッション衛生', 'App design: content boundaries (tags, system vs user), schema design, session hygiene'),
          L('構成管理: CLAUDE.md、settings.json、モデルバージョンの固定、プロンプトのバージョン管理と回帰テスト', 'Config management: CLAUDE.md, settings.json, model pinning, prompt versioning with regression tests'),
        ],
        traps: [
          L('会話の記憶はサーバー側にあると考える(実際は毎回 messages に含める)', 'Assuming the server remembers the conversation'),
          L('キャッシュの前に変わる内容(タイムスタンプなど)を置く、または質問を先頭に置く', 'Putting changing content (timestamps, the question) before the cached prefix'),
          L('結果がバッチの入力順に返ると考える', 'Assuming batch results come back in input order'),
        ],
      },
      {
        id: 3,
        knows: [
          L('CLAUDE.md の階層(ユーザー / プロジェクト / サブディレクトリ)、settings.json のスコープ(共有と個人)', 'CLAUDE.md hierarchy and settings.json scopes (shared vs personal)'),
          L('ヘッドレスモード(claude -p)と JSON 出力、スラッシュコマンド、Skills、サブエージェント、エージェントメモリ', 'Headless mode (claude -p) with JSON output, slash commands, skills, subagents, agent memory'),
        ],
        traps: [L('CLAUDE.md の記述は強制力のあるルールだと考える(強制は権限とフックの役割)', 'Treating CLAUDE.md as enforced (enforcement is permissions and hooks)')],
      },
      {
        id: 4,
        knows: [
          L('エラーの種類の特定と回復方針、トレース分析で失敗の層を切り分ける(統合層かモデル出力か)', 'Identify error types and recovery; use traces to isolate integration vs model-output faults'),
        ],
      },
      {
        id: 5,
        knows: [
          L('LLM の基礎: トークン、コンテキストウィンドウ、サンプリング、非決定性(temperature 0 でも完全には再現しない)', 'LLM basics: tokens, context windows, sampling, non-determinism'),
          L('thinking / effort は難しい推論に使い、単純な分類には使わない(コストと遅延)', 'Use thinking/effort for hard reasoning, skip it for simple classification'),
          L('Opus / Sonnet / Haiku の使い分け(品質・遅延・コスト)と、リリース間の挙動変化への備え(評価セットで比較して段階移行)', 'Opus/Sonnet/Haiku trade-offs; migrate across releases via evals and gradual rollout'),
          L('トークン予算とコスト管理: usage の記録と集計、プロンプトキャッシュ、バッチ', 'Token budgeting and cost: log usage, prompt caching, batch'),
        ],
        traps: [
          L('max_tokens を「入力と出力の合計の上限」「文脈を広げる設定」と取り違える', 'Mistaking max_tokens for a combined or context-size limit'),
        ],
      },
      {
        id: 6,
        knows: [
          L('文脈エンジニアリング: ツール出力の絞り込み(プルーニング)、圧縮(コンパクション)、サブエージェントによる隔離', 'Context engineering: prune tool output, compaction, isolation via subagents'),
          L('プロンプト設計: 指示の明確さ、few-shot、system と user の役割分担、出力の制約、入力のサニタイズ', 'Prompt design: clarity, few-shot, system vs user, output constraints, input sanitization'),
          L('出力の扱い: スキーマによる構造化出力 + アプリ側の検証、防御的なパース、確信ありげな出力への懐疑(合計の再計算など)', 'Output handling: schema + app-side validation, defensive parsing, skepticism toward confident output'),
        ],
      },
      {
        id: 7,
        knows: [
          L('プロンプトインジェクションの理解と緩和: 信頼できない入力として扱い、最小権限・許可リスト・人の承認で被害範囲を限定', 'Prompt injection: treat as untrusted; least privilege, allowlists, human approval'),
          L('PII の最小化・マスキング、ログと保存データの扱い、認証・認可', 'PII minimization/masking, logging and storage, authentication and authorization'),
          L('フック(PreToolUse など)で破壊的操作を決定的にブロック。ガードレールは多層で', 'Hooks (PreToolUse) to block destructive actions deterministically; layered guardrails'),
          L('秘密情報と API キーの管理(クライアントに埋め込まない、サーバー側で保持して認証とレート制限)', 'Secrets and API keys: server-side, never embedded in clients'),
        ],
        traps: [
          L('「より強いモデル」「プロンプトに悪意ある指示を無視せよと書く」だけで防げると考える', 'Believing a stronger model or a prompt line alone stops injection'),
        ],
      },
      {
        id: 8,
        knows: [
          L('ツール実装: 説明文(目的・使う/使わない場面・引数・戻り値)、エラーは is_error と簡潔な説明で返す', 'Tool implementation: rich descriptions; return errors with is_error and a concise message'),
          L('クライアント側ツールとサーバー側ツールの違い(誰が実行して tool_result を返すか)', 'Client-side vs server-side tools (who executes and returns tool_result)'),
          L('MCP サーバー開発: tools / resources / prompts、トランスポート(ローカルは stdio、共有・リモートは Streamable HTTP)', 'MCP servers: tools/resources/prompts; stdio for local, Streamable HTTP for shared/remote'),
          L('組み込みツール・カスタムツール・Skills・MCP の使い分け(手順の再利用は Skills、外部システム接続は MCP)', 'Choose among built-in tools, custom tools, Skills and MCP'),
        ],
      },
    ],
    plan: [
      L('分野2(33.1%)から始める。API の仕組み、バッチ、キャッシュ、エラー処理、構成管理を手を動かして確認', 'Start with domain 2 (33.1%): API mechanics, batch, caching, error handling, config management — by hand'),
      L('Claude を使う小さなアプリを1つ作る: API 呼び出し、ツール1〜2個、簡単な評価、安全対策(ガイドの推奨)', 'Build one small Claude app with 1–2 tools, a simple eval and basic safety (as the guide recommends)'),
      L('配点の次に大きい分野 5(モデル選択・コスト)・1(エージェント)・6・8 を順に。分野 3・4 は軽く', 'Then domains 5, 1, 6 and 8; skim 3 and 4'),
      L('ドメイン別練習 → 模擬試験(53問/120分)→ 復習モードの順に回す', 'Domain practice → mock exam (53 items / 120 min) → review mode'),
    ],
    heuristics: [
      L('必ず守らせたいことはプロンプトでなく、フック・権限・コードで決定的に強制する', 'Anything that must always happen is enforced by hooks, permissions or code, not prompts'),
      L('緊急でない大量処理はバッチ API。対話的な用途や即時性が必要な用途には使わない', 'Latency-tolerant bulk work → Batch API; never for interactive use'),
      L('信頼できない入力は区切って「データ」と宣言し、副作用のあるツールに最小権限と承認を付ける', 'Delimit untrusted input as data; give side-effecting tools least privilege and approval'),
      L('再利用して独立に保守したい外部システム連携は MCP サーバー', 'Reusable, independently maintained integrations belong in an MCP server'),
      L('構造化出力でも受け取り側で検証する。確信ありげな値は決定的なコードで検算する', 'Validate structured output on receipt; recompute checkable values in code'),
      L('モデル移行は評価セットで比較し、プロンプトを調整し、段階的に切り替える', 'Migrate models via eval comparison, prompt tuning and gradual rollout'),
    ],
  },

  'CCAR-F': {
    code: 'CCAR-F',
    tagline: L('エージェント、ツール/MCP、Claude Code、構造化出力、文脈管理のトレードオフを、本番シナリオで判断する試験', 'Tests production tradeoff judgment across agents, tools/MCP, Claude Code, structured output and context management'),
    audience: L(
      'Claude を使った本番アプリを設計・実装するソリューションアーキテクト。Agent SDK でのマルチエージェント構築、CLAUDE.md・Skills・MCP を使った Claude Code のチーム運用、MCP のツール設計、JSON スキーマによる構造化出力、文脈管理、CI/CD 連携、エスカレーションと信頼性の判断を経験した人。',
      'Solution architects who design production Claude apps: multi-agent systems with the Agent SDK, Claude Code team configuration (CLAUDE.md, Skills, MCP), tool/MCP design, structured output, context management, CI/CD integration, and escalation/reliability decisions.',
    ),
    notFor: L('API や Claude Code の実務経験がない人には難しい試験です(目安は 6か月以上の実務経験)。', 'Hard without hands-on API/Agent SDK/Claude Code/MCP work (about 6+ months recommended).'),
    experience: [
      L('Claude API・Agent SDK・Claude Code・MCP を使った実装経験 6か月以上', '6+ months building with the Claude API, Agent SDK, Claude Code and MCP'),
      L('モデルの能力と限界を本番環境の視点で理解していること', 'Understanding of model capabilities and limits in production'),
    ],
    format: [
      L('60問。単一選択と複数選択', '60 items; single- and multiple-response'),
      L('6つのシナリオから4つがランダムに出題され、各問題はそのシナリオの文脈に紐づく', '4 of 6 scenarios are drawn at random; questions are framed by the scenario'),
      L('シナリオ: ①カスタマーサポート解決エージェント ②Claude Code によるコード生成 ③マルチエージェント・リサーチ ④開発者生産性 ⑤CI での Claude Code ⑥構造化データ抽出', 'Scenarios: support agent, Claude Code code generation, multi-agent research, developer productivity, CI, structured extraction'),
      L('配点: エージェント設計27%、Claude Code構成20%、プロンプトと構造化出力20%、ツール/MCP 18%、文脈管理15%', 'Weights: Agentic 27%, Claude Code 20%, Prompt/Structured Output 20%, Tools/MCP 18%, Context 15%'),
      L('ガイドは分野の下にタスク記述(1.1〜5.6)ごとに「知っていること / できること」を細かく列挙している。出題はこの記述に沿う', 'The guide lists "knowledge of / skills in" for each task statement (1.1–5.6); items follow them'),
    ],
    domains: [
      {
        id: 1,
        knows: [
          L('1.1 エージェントループ: stop_reason が "tool_use" なら実行して結果を履歴に追加、"end_turn" で終了', '1.1 Agentic loop: continue on "tool_use", finish on "end_turn"'),
          L('1.2 コーディネーター/サブエージェント(ハブ&スポーク)。クエリの複雑さで呼ぶサブエージェントを選び、通信はコーディネーター経由', '1.2 Coordinator–subagent (hub-and-spoke); pick subagents by complexity; route via the coordinator'),
          L('1.3 サブエージェントは親の文脈を継承しない。必要な内容はプロンプトに明示、allowedTools に "Task"、1回の応答で複数の Task を出して並列化', '1.3 Subagents inherit nothing; pass context explicitly; allowedTools needs "Task"; parallel Task calls in one response'),
          L('1.4 必須の順序は前提条件ゲート等でプログラム的に強制。人への引き継ぎは顧客ID・根本原因・推奨対応を構造化して渡す', '1.4 Enforce mandatory ordering programmatically; structured handoffs'),
          L('1.5 フックで、ツール結果の正規化(PostToolUse)と、ポリシー違反呼び出しのブロック(実行前の割り込み)', '1.5 Hooks: normalize tool results (PostToolUse); block policy-violating calls before execution'),
          L('1.6 タスク分解: 予測できる作業はプロンプトチェーン、オープンエンドな調査は動的に計画。大きなレビューはファイル別 + 統合の2段', '1.6 Decomposition: prompt chaining vs adaptive plans; per-file passes + integration pass'),
          L('1.7 セッション: --resume <名前> で再開、fork_session で分岐。古い結果は新セッション + 要約', '1.7 Sessions: --resume, fork_session; start fresh with a summary when results are stale'),
        ],
        traps: [
          L('ループ終了を反復回数・本文の語・最初のテキストで判定する', 'Terminating loops by iteration cap, phrases or first text block'),
          L('金銭に関わる順序や上限をプロンプトの強調・few-shot で守らせようとする', 'Using prompt emphasis or few-shot for financial ordering/limits'),
        ],
      },
      {
        id: 2,
        knows: [
          L('2.1 ツールの説明がツール選択の主な手がかり。入力形式・例・境界・使い分けを書く。汎用ツールは目的別に分割', '2.1 Tool descriptions drive selection; write formats, examples, boundaries; split generic tools'),
          L('2.2 MCP のエラー: isError に errorCategory(一時的/検証/業務/権限)と isRetryable、利用者向け説明。アクセス失敗と「該当なし」を区別', '2.2 MCP errors: isError with errorCategory, isRetryable, description; distinguish failures from valid empty results'),
          L('2.3 エージェントに渡すツールは役割に必要な4〜5個に絞る。tool_choice: auto / any / 名前指定の違い', '2.3 Scope tools to 4–5 per role; tool_choice auto vs any vs forced'),
          L('2.4 MCP: 共有は .mcp.json(環境変数展開 ${TOKEN})、個人は ~/.claude.json。標準連携は既存のコミュニティサーバー、全サーバーのツールが同時に使える', '2.4 MCP scoping: .mcp.json with env expansion vs ~/.claude.json; prefer community servers; all servers\' tools available'),
          L('2.5 組み込みツール: Grep は内容検索、Glob はパス一致、Edit は一意な一致が必要(失敗時は Read + Write)。まず Grep で入口を探して Read でたどる', '2.5 Built-ins: Grep (content), Glob (paths), Edit (unique match; fall back to Read+Write)'),
        ],
        traps: [
          L('ツール選択の不調に対して、まずルーティング層・大量の few-shot・モデル変更に走る(最初は説明の改善)', 'Reaching for routers, many few-shots or bigger models before fixing descriptions'),
          L('プロンプト中の語がツールの説明と結びつき、意図しない選択の偏りを生む(キーワード感度)', 'Prompt wording biasing tool selection (keyword sensitivity)'),
        ],
      },
      {
        id: 3,
        knows: [
          L('3.1 CLAUDE.md の階層(ユーザー / プロジェクト / ディレクトリ)、@import、.claude/rules/。新メンバーだけ従わないならユーザー単位の設定を疑う。/memory で読み込みを確認', '3.1 CLAUDE.md hierarchy, @import, .claude/rules/; /memory to inspect'),
          L('3.2 スラッシュコマンド(.claude/commands/ は共有、~/.claude/commands/ は個人)、Skills(context: fork、allowed-tools、argument-hint)', '3.2 Slash commands (project vs user), Skills frontmatter (context: fork, allowed-tools, argument-hint)'),
          L('3.3 パス指定ルール: .claude/rules/ の paths(glob)で、該当ファイルの編集時だけ読み込む。散在するテストファイルなどに有効', '3.3 Path-scoped rules with glob patterns for conventions spread across directories'),
          L('3.4 plan モード(大規模・複数の方式・設計判断)と直接実行(範囲の明確な修正)。調査は Explore サブエージェントで隔離', '3.4 Plan mode vs direct execution; Explore subagent for verbose discovery'),
          L('3.5 反復改善: 散文が解釈揺れしたら入出力の例2〜3個、テスト先行、インタビュー、相互に絡む問題は1回にまとめる', '3.5 Iterative refinement: concrete examples, test-first, interview pattern'),
          L('3.6 CI: -p(非対話)、--output-format json + --json-schema、再実行時は過去の指摘を渡して新規のみ報告、既存テストを文脈に', '3.6 CI: -p, --output-format json + --json-schema, pass prior findings, include existing tests'),
        ],
        traps: [
          L('チーム共有の規約を個人用の ~/.claude に置く、共有スキルを直接書き換える', 'Putting team conventions in user-level config; editing shared skills directly'),
        ],
      },
      {
        id: 4,
        knows: [
          L('4.1 明示的なカテゴリ基準(報告するもの/省くもの)。「慎重に」「確信が高いものだけ」では精度は上がらない。誤検知の多いカテゴリは一時的に無効化。重大度は各レベルにコード例', '4.1 Explicit categorical criteria; "be conservative" fails; temporarily disable noisy categories; severity examples'),
          L('4.2 few-shot は2〜4件の的を絞った例(判断理由つき)。許容パターンと本物の問題を対比し、一般化を促す', '4.2 Few-shot: 2–4 targeted examples with reasoning'),
          L('4.3 ツール利用 + JSON スキーマで構文エラーをなくす。意味上の誤りは防げない。省略され得る項目は nullable、拡張カテゴリは enum + "other" + 詳細、曖昧用に "unclear"', '4.3 Tool use + schemas remove syntax errors, not semantic errors; nullable fields; enum + "other"'),
          L('4.4 検証・再試行: 元文書 + 失敗した抽出 + 具体的な検証エラーで再試行。情報が原本にない場合は再試行しても無意味。stated_total と calculated_total で矛盾を検出、detected_pattern で却下傾向を分析', '4.4 Retry with the error; retries cannot create missing info; stated vs calculated totals; detected_pattern'),
          L('4.5 バッチ API: 50%安、最大24時間、遅延の保証なし。夜間レポートに適し、マージ前の必須チェックには不適。custom_id で失敗分だけ再投入', '4.5 Batch: 50% cheaper, up to 24 h, no SLA; unsuitable for blocking checks; resubmit by custom_id'),
          L('4.6 自己レビューは生成時の推論文脈に引きずられる。独立したインスタンスでレビュー。大きな PR はファイル別 + 統合パス', '4.6 Independent review instances; per-file + integration passes'),
        ],
        traps: [
          L('「JSON のみ」と強調して構文エラーが消えると考える(スキーマ付きのツール利用を使う)', 'Relying on "JSON only" emphasis instead of tool use with schemas'),
          L('必須項目にして欠損値を埋めさせる(作り話の原因)', 'Making fields required, forcing fabricated values'),
        ],
      },
      {
        id: 5,
        knows: [
          L('5.1 長い対話の文脈: 金額・日付・注文番号などは「ケース情報」ブロックに分けて保持、ツール出力は関連項目だけに絞る、重要な要約は先頭に置く(中間は見落とされやすい)', '5.1 Case-facts block; trim tool output; summaries first ("lost in the middle")'),
          L('5.2 エスカレーションの契機: 顧客が人を求める、方針の空白/例外、進展できない。感情や自己申告の確信度は不適切な代理指標。複数候補は追加の識別子を尋ねる', '5.2 Escalate on explicit request, policy gaps, no progress; sentiment/confidence are poor proxies'),
          L('5.3 エラー伝播: 失敗の種類・試した内容・部分結果をコーディネーターへ。一時的な失敗はサブエージェント内で回復。握りつぶしも全体停止も誤り', '5.3 Structured error context; local recovery; no silent suppression or full abort'),
          L('5.4 大規模コードの探索: サブエージェントで冗長な調査を隔離、スクラッチパッド、/compact、クラッシュ復旧用のマニフェスト', '5.4 Subagents, scratchpads, /compact, manifests for crash recovery'),
          L('5.5 人のレビュー: 全体精度(例: 97%)は区分ごとの低さを隠す。高確信の抽出も層化無作為抽出で検証。フィールド単位の確信度を正解付きデータで較正', '5.5 Aggregate accuracy hides segments; stratified sampling; calibrated field-level confidence'),
          L('5.6 出典の保持: 主張と出典の対応(URL・文書名・抜粋)と日付を構造化。矛盾する統計は出典つきで併記し、確立した知見と議論のある知見を分ける', '5.6 Provenance: claim–source mappings, dates; annotate conflicts'),
        ],
        traps: [
          L('要約を重ねて数値や期待が曖昧になる、古いターンを捨てる', 'Progressive summarization blurring facts; dropping old turns'),
        ],
      },
    ],
    plan: [
      L('まずガイドの「タスク記述 1.1〜5.6」を一通り読み、「知っていること/できること」を自分の言葉で説明できるか確認する', 'Read all task statements 1.1–5.6 and check you can explain each "knowledge/skills" bullet'),
      L('ガイドの推奨課題を実際に作る: ツール3〜4個のエージェントとエスカレーション、Claude Code 設定、抽出パイプライン、マルチエージェントのリサーチ', 'Do the guide\'s four exercises hands-on'),
      L('本アプリではシナリオ別(S1〜S6)に解く。1つのシナリオで出る論点がどの分野にまたがるかを意識する', 'Practice by scenario (S1–S6) and notice which domains each scenario spans'),
      L('模擬試験(60問/120分)で4シナリオ分に慣れ、誤答は「なぜ他が誤りか」を言えるまで復習', 'Mock exams (60 items / 120 min); explain why each wrong option is wrong'),
    ],
    heuristics: [
      L('結果に金銭や安全が絡む順序・上限は、プロンプトでなく決定的な仕組み(前提条件ゲート、実行前フック)で守る', 'For financial/safety rules, use deterministic gates and pre-execution hooks, not prompts'),
      L('最初の一手は、最小の労力で最大の効果のもの(ツール説明の改善、明示的な基準、例の追加)。ルーティング層・別モデル・巨大な仕組みは後', 'First step = lowest-effort, highest-leverage; heavy infrastructure comes later'),
      L('サブエージェントは文脈を引き継がない。必要な情報は明示的に渡し、役割に必要なツールだけを持たせる', 'Pass context explicitly; scope tools to the role'),
      L('エラーは「種類・再試行可否・部分結果」を構造化して返し、「失敗」と「該当なし」を区別する', 'Return structured errors; separate failure from valid empty'),
      L('感情・自己申告の確信度・長さといった間接的な指標をトリガーにしない', 'Never trigger on sentiment, self-reported confidence or length'),
      L('原因の切り分けでは、下流が正しく動いていれば上流(分解・指示・渡した文脈)を疑う', 'If downstream agents work correctly, suspect upstream decomposition or context passing'),
    ],
    handsOn: [
      L('演習1: ツール3〜4個(似た2つを含む)、stop_reason ループ、構造化エラー、決定的な上限フック、複数用件の分解', 'Ex.1: multi-tool agent with escalation logic'),
      L('演習2: CLAUDE.md 階層、.claude/rules/ の paths、context: fork のスキル、.mcp.json と ~/.claude.json、plan モードの試し比べ', 'Ex.2: configure Claude Code for a team workflow'),
      L('演習3: nullable と enum+other のスキーマ、検証つき再試行、few-shot、バッチ(custom_id)、確信度による人のレビュー振り分け', 'Ex.3: structured data extraction pipeline'),
      L('演習4: コーディネーター + 2サブエージェント、並列 Task、出典つきの構造化出力、タイムアウトの伝播、矛盾データの併記', 'Ex.4: design and debug a multi-agent research pipeline'),
    ],
  },

  'CCAR-P': {
    code: 'CCAR-P',
    tagline: L('ビジネス課題から Claude ベースのソリューションを設計し、評価・安全性・合意形成まで含めて届ける、上級の試験', 'Senior-level: design, evaluate, govern and deliver Claude-based solutions, including stakeholder communication'),
    audience: L(
      '要件を技術に落とし込む中堅〜上級の技術者(ソリューションアーキテクト、AI/MLエンジニア、テックリード、シニアエンジニア)。モデル選定、プロンプトと文脈の設計、ツール/エージェントのオーケストレーション、セキュリティ・コンプライアンス・ガバナンスの判断、ステークホルダーとの合意形成を担う人。',
      'Mid-to-senior technologists (solution architects, AI/ML engineers, tech leads) who own model selection, prompt/context design, orchestration, security/compliance/governance, and stakeholder alignment.',
    ),
    notFor: L('入門レベルの開発者、Claude アプリのカジュアルな利用者、システム設計の責任を持たない役割は対象外です。', 'Not for entry-level developers, casual users, or roles without system-design responsibility.'),
    experience: [
      L('ソフトウェア設計の基礎(モジュール性・関心の分離・スケーラビリティ)', 'Software engineering fundamentals (modularity, separation of concerns, scalability)'),
      L('システムアーキテクチャまたはプラットフォームエンジニアリング 3年以上', '3+ years in systems or platform architecture'),
      L('Claude または同等の LLM を本番で使った経験 6か月以上', '6+ months with Claude or comparable LLMs in production'),
      L('検討から展開・運用まで、エンドツーエンドで届けた経験(前提条件はなし)', 'End-to-end delivery from discovery to operations (no formal prerequisites)'),
    ],
    format: [
      L('63問。単一選択と複数選択', '63 items; single- and multiple-response'),
      L('7分野がほぼ均等: 統合19%、ソリューション設計17%、評価16%、ガバナンス14%、ステークホルダー14%、モデル/プロンプト13%、開発者生産性7%', 'Seven fairly even domains: Integration 19%, Design 17%, Evaluation 16%, Governance 14%, Stakeholders 14%, Models/Prompting 13%, Dev Productivity 7%'),
      L('技術だけでなく、リスク・コンプライアンス(GDPR / HIPAA / FedRAMP の考え方)・ステークホルダー対応・ライフサイクルの判断も問われる', 'Beyond tech: risk, compliance (GDPR/HIPAA/FedRAMP concepts), stakeholders and lifecycle judgment'),
      L('受験料は最も高い($175)。分野ごとの具体的な目標がガイドに箇条書きで示されている', 'Highest fee ($175); the guide lists objectives per domain as bullets'),
    ],
    domains: [
      {
        id: 1,
        knows: [
          L('ビジネス課題を Claude ベースのソリューションに翻訳する。入力→処理→出力→フィードバックの循環', 'Translate business problems into solutions; input → processing → output → feedback loops'),
          L('パターンの選択: ワークフロー(プロンプトチェーン・ルーティング・並列化・評価者–最適化)/ エージェント / 検索で補強した単一呼び出し。必要最小限の複雑さ', 'Choose pattern: workflow / agent / augmented LLM; minimum necessary complexity'),
          L('マルチエージェントの設計判断(独立・並列・文脈隔離・権限分離なら有利、強い相互依存・小さな問題なら単一が有利)', 'Multi-agent only when independence, parallelism, isolation or permission separation justify it'),
          L('分解(構造に沿った分割 + 統合)、価値の柱(効率・変革・生産性・コスト・性能 SLA)との整合', 'Decomposition with an integration step; align to value pillars (cost, SLA)'),
        ],
        traps: [L('手順が決まっているのに自律エージェントを選ぶ、まず最新・最大のモデルから決める', 'Choosing autonomy for fixed steps; picking the newest model first')],
      },
      {
        id: 2,
        knows: [
          L('トレードオフにもとづくモデル選択(自社データで比較し、基準を満たす最安を選ぶ。公開ベンチマークだけで決めない)', 'Model selection by measured trade-offs on your data, not public leaderboards'),
          L('システムプロンプト・テンプレート・ガードレール設計。指示と信頼できないデータの区切り、出力スキーマ、「不明」カテゴリ', 'System prompts, templates, guardrails; delimiters, output schemas, "unknown" category'),
          L('ゼロショット / few-shot / 思考の連鎖(extended thinking)。根拠は構造化して別フィールドで出力', 'Zero/few-shot, chain-of-thought; structured rationale'),
          L('文脈ウィンドウとトークンの管理(要約 + 固定メモ + 直近は原文)、プロンプトキャッシュ(先頭を固定)、Skills・モジュール化による再利用', 'Context/token management, prompt caching (stable prefix), Skills and modular prompts'),
        ],
        traps: [L('キャッシュ対象の先頭にタイムスタンプやユーザーIDを入れる', 'Putting timestamps/IDs at the head of a cached prompt')],
      },
      {
        id: 3,
        knows: [
          L('ツール/エージェントの設定の肥大化(ツールの絞り込み、動的な検索・読み込み)', 'Capability bloat; scope tools; dynamic tool search/loading'),
          L('認証・認可: エンドユーザーの権限を下流に伝える(委任された認可)。共有の高権限アカウントは混乱した代理人の問題', 'AuthN/AuthZ: propagate end-user identity; shared privileged accounts cause confused-deputy issues'),
          L('精度と遅延のトレードオフ(ストリーミング、キャッシュ、問い合わせごとのモデル選択、評価での裏づけ)', 'Accuracy–latency trade-offs: streaming, caching, per-query model choice, eval-backed'),
          L('大規模なオブザーバビリティ: 相関IDの分散トレース、PII のマスキング、サンプリング評価', 'Observability at scale: correlation-ID tracing, PII masking, sampled evaluation'),
          L('RAG: 構造に沿ったチャンク分割 + メタデータ、ハイブリッド検索(語彙 + ベクトル)、更新の差分反映とブルー/グリーンの索引切替', 'RAG: structure-aware chunking + metadata; hybrid retrieval; incremental updates, blue/green re-index'),
          L('接続方式の選択: MCP(共有・複数クライアント・リモート認証)/ API・CLI(ローカルの開発者環境)/ エージェント間(組織をまたぐ自律連携)', 'Integration choice: MCP vs API/CLI vs agent-to-agent'),
          L('段階的な探索(索引だけ先に渡し、本文は必要時に取得)vs 一体の巨大な文脈', 'Progressive discovery vs monolithic context'),
        ],
        traps: [L('ツールの説明を伸ばす・大きなウィンドウに頼る(絞り込みが正解)', 'Lengthening descriptions or relying on bigger windows instead of scoping tools')],
      },
      {
        id: 4,
        knows: [
          L('評価指標の定義(精度・遅延・コスト・安全・セキュリティ)。高リスク領域では忠実性・重要項目の網羅・誤りの重大度を重視', 'Define metrics; in high-risk domains prioritize faithfulness, critical-item coverage, severity'),
          L('評価データセット: 本番ログの層化サンプル + 専門家の正解事例 + 敵対的ケース。調整用データで評価しない', 'Eval datasets: stratified production samples, expert golden cases, adversarial cases'),
          L('LLM を審査役にする際の偏り(位置・長さ・自己選好)への対処、人手ラベルとの一致の較正', 'LLM-judge biases: position, verbosity, self-preference; calibrate with human labels'),
          L('A/B テスト: ランダム化、事前に決めた主指標とガードレール指標、十分な標本数、途中で止めない', 'A/B tests: randomize, pre-defined metrics, adequate sample, no peeking'),
          L('不具合の診断(検索か生成か、プロンプトかモデル能力か)、トークン・遅延・コストの最適化(バッチ、キャッシュ)、スライス別の監視とドリフト検出', 'Diagnose retrieval vs generation, prompt vs capability; optimize; slice monitoring and drift'),
          L('モデル移行: バージョン固定の評価スイートで新旧を比較し、カナリアで展開', 'Model migration: version-pinned eval comparison and canary rollout'),
        ],
      },
      {
        id: 5,
        knows: [
          L('多層防御(入力の確認・出力の検証・ツール権限の制限・ログと監視)。プロンプトの禁止事項だけに頼らない', 'Defense in depth; do not rely on prompt prohibitions alone'),
          L('間接プロンプトインジェクション: 取得内容を信頼できない入力として扱い、副作用のあるツールは最小権限 + 人の承認', 'Indirect prompt injection: untrusted retrieved content; least privilege and approval'),
          L('人の関与(HITL): リスクと確信度で層に分け、根拠を添え、形だけの承認を監視。結果を評価に戻す', 'HITL tiering by risk/confidence; monitor rubber-stamping'),
          L('規制の考え方: GDPR の削除要請(派生データ・埋め込み・キャッシュまで系譜で追う)、HIPAA(BAA・必要最小限)、FedRAMP(認可の境界を最初に確認)', 'GDPR erasure incl. derived data; HIPAA (BAA, minimum necessary); FedRAMP (authorization boundary first)'),
          L('倫理: 偏りと公平性(代理変数の監査、人の最終判断、異議申し立て)、透明性(AI 利用の開示、出典と限界、変更履歴と監査ログ)、幻覚対策(外部検証・根拠づけ)', 'Ethics: fairness (proxy audits, appeals), transparency, hallucination controls'),
        ],
        traps: [L('個人属性を除けば偏りはなくなる、埋め込みは個人データではない、と考える', 'Assuming removing attributes eliminates bias, or embeddings are not personal data')],
      },
      {
        id: 6,
        knows: [
          L('構造化された要件の聞き出し(対象プロセス・コスト要因・成功指標・制約・意思決定者)', 'Structured discovery: processes, cost drivers, metrics, constraints, decision-makers'),
          L('設計判断とトレードオフを、事業の言葉(収益・コスト・SLA・リスク)で並べて伝える', 'Communicate trade-offs in business terms, side by side with a recommendation'),
          L('SLA/SLO: 「100%正確」は約束できない。測定可能な目標と人へのフォールバック、改善の手順を合意する', 'SLAs/SLOs: no 100% promises; measurable targets and fallbacks'),
          L('フィードバックの循環、設計の文書化(ADR・ランブック)、PoC から運用への引き継ぎ物、モデルの更新・廃止への対応、本番移行の準備の基準', 'Feedback loops, ADRs/runbooks, handoff deliverables, deprecation handling, readiness criteria'),
        ],
        traps: [L('デモ・熱意・最新モデルを「準備完了」の根拠にする', 'Treating demos, enthusiasm or model recency as readiness')],
      },
      {
        id: 7,
        knows: [
          L('チームでの Claude Code 構成: チェックインした CLAUDE.md と共有の設定(権限の許可/拒否)、個人設定は分離', 'Team Claude Code configuration: checked-in CLAUDE.md and shared settings; personal separate'),
          L('必ず守らせたいことはフックで決定的に強制(CLAUDE.md は確率的)', 'Use hooks for must-always behavior'),
          L('運用上の問題の調査: ログ・スタックトレース・再現手順・最近の変更を渡し、再現テストから始め、最小権限の環境で修正', 'Debugging in operations: give evidence, reproduce first, fix under least privilege'),
          L('オンボーディング: サブエージェント・スキル・コマンドをリポジトリで共有、プロジェクト単位の MCP、認証情報は環境変数や保管庫', 'Onboarding: shared assets in repo, project-scoped MCP, secrets via env/vault'),
        ],
      },
    ],
    plan: [
      L('ガイドの7分野の目標を読み、分野ごとに「自分なら何を判断基準にするか」を言語化する(暗記より判断)', 'Read the objectives and articulate decision criteria per domain (judgment over memorization)'),
      L('ガイド推奨: RAG・評価・オブザーバビリティを含む Claude ソリューションを、少なくとも1つ最初から最後まで作って運用する', 'Per the guide: build and operate at least one end-to-end solution including RAG, evaluation and observability'),
      L('モデル選択・統合方式・セキュリティのトレードオフ判断を練習する(この試験の中心)', 'Practice architectural decisions: model selection, integration protocols, security trade-offs'),
      L('ドメイン別練習 → 模擬試験(63問/120分)→ 復習。ステークホルダー対応や SLA の問題は、事業の言葉で説明する習慣をつける', 'Domain practice → mock exam (63 items / 120 min) → review; practice business-language explanations'),
    ],
    heuristics: [
      L('単一の対策では足りない。多層防御(入力・出力・権限・監視)を選ぶ', 'One control is never enough; choose layered controls'),
      L('要件を満たす最小の複雑さを選ぶ(固定手順なら workflow、検索で足りるなら単一呼び出し)', 'Choose the minimum complexity that meets requirements'),
      L('認可は、データを持つ側が呼び出し元の権限で強制する。モデルの判断やプロンプトに任せない', 'Authorization is enforced by the data owner using the caller\'s identity'),
      L('「測定してから決める」(自社データでの評価、スライス別、A/B、カナリア)。公開ベンチマーク・少数の確認・即時切り替えは誤り', 'Measure before deciding; public benchmarks, spot checks and instant cutovers are wrong'),
      L('不確実性は隠さず、制御・残るリスク・合意した許容水準として示す。「ゼロにする」「約束する」は誤り', 'Be transparent about uncertainty; never promise zero risk or 100% accuracy'),
      L('文書削除や規制対応は、元データだけでなく派生データ(チャンク・埋め込み・キャッシュ・ログ)まで', 'Compliance actions cover derived data (chunks, embeddings, caches, logs) too'),
    ],
  },
};

export type LogisticsItem = { title: L10n; body: L10n };

/** 全試験に共通の受験情報(試験ガイド v1.0 に基づく)。変更される可能性があるため公式で確認すること */
export const LOGISTICS: LogisticsItem[] = [
  { title: L('申し込み', 'Registration'), body: L('Anthropic Partner Academy で試験ページを確認し、ガイドと規約・試験ポリシーを読んで登録・決済。続けて Pearson VUE のアカウントを作り、日時を選びます。', 'Register via the Anthropic Partner Academy, review the exam guide and policies, then create a Pearson VUE account and schedule.') },
  { title: L('受験方法', 'Delivery'), body: L('オンライン監督(OnVUE)または Pearson VUE のテストセンター。ガイドに前提条件はありません。', 'Online proctored (OnVUE) or a Pearson VUE test center. No prerequisites.') },
  { title: L('合否と結果', 'Scoring'), body: L('100〜1,000 の換算スコアで 720 以上が合格(基準参照型)。結果は合否・換算スコア・分野別の正答率で通知され、判定は総合スコアで決まります。', 'Scaled score 100–1,000; 720 to pass (criterion-referenced). You get pass/fail, score and percent-correct per domain; the decision is on the total.') },
  { title: L('有効期間と更新', 'Validity & renewal'), body: L('認定の有効期間は12か月。期限内なら、Partner Academy の無料の非監督アセスメントで更新できます。失効すると全額で再受験が必要です。', 'Valid for 12 months; renew on time with a free non-proctored assessment; otherwise retake the full exam.') },
  { title: L('再受験', 'Retakes'), body: L('不合格の場合の待機期間は1回目後14日、2回目後30日、3回目後90日。12か月で最大4回まで。受験のたびに受験料がかかります。', 'Waiting periods: 14 days after the 1st failed attempt, 30 after the 2nd, 90 after the 3rd; max 4 attempts per rolling 12 months; fee each time.') },
  { title: L('変更・キャンセル', 'Cancel / reschedule'), body: L('試験ガイドは「予約の24時間前まで」としていますが、Pearson VUE の Anthropic ページは「48時間前まで」と案内しています。期限を過ぎると受験料は戻りません。厳しいほうに合わせて余裕をもって操作してください。', 'The exam guide says 24 hours before; the Pearson VUE Anthropic page says 48 hours. Fees are forfeited after the deadline — assume the stricter one.') },
  { title: L('本人確認と規則', 'ID & conduct'), body: L('登録名と一致する有効な顔写真つき公的身分証が必要です。メモ・スマホ・別モニターなどは持ち込み不可で、試験内容の記録や口外は禁止(NDA)。違反すると結果の無効化や資格の取り消しがあります。', 'Valid government photo ID matching your registration; no notes, phones or second monitors; exam content is confidential (NDA). Violations can void results or revoke the credential.') },
  { title: L('試験時間の目安', 'Pacing'), body: L('120分で53〜63問なので、1問あたり約2分。迷う問題はフラグを付けて先へ進み、最後に戻りましょう。ガイドには誤答の減点に関する記載がなく、判定は総合スコアです。', '120 minutes for 53–63 items ≈ 2 minutes each. Flag and move on, then return. The guide mentions no penalty for wrong answers; the decision is on the total score.') },
];
