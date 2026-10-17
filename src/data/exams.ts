import type { Exam, ExamCode } from '../types';

export const EXAMS: Exam[] = [
  {
    code: 'CCAO-F',
    name: { ja: 'Claude 認定アソシエイト – 基礎', en: 'Claude Certified Associate – Foundations' },
    items: 60,
    minutes: 120,
    passScore: 720,
    feeUsd: 99,
    domains: [
      { id: 1, name: { ja: 'プロンプトとタスク実行', en: 'Prompting and Task Execution' }, weight: 14 },
      { id: 2, name: { ja: '出力の評価と検証', en: 'Output Evaluation and Validation' }, weight: 21 },
      { id: 3, name: { ja: 'プロダクトとモデルの選択', en: 'Product and Model Selection' }, weight: 12 },
      { id: 4, name: { ja: 'ワークフロー統合とソリューション設計', en: 'Workflow Integration and Solution Design' }, weight: 16 },
      { id: 5, name: { ja: '構成とナレッジ管理', en: 'Configuration and Knowledge Management' }, weight: 12 },
      { id: 6, name: { ja: 'ガバナンス・リスク・責任ある利用', en: 'Governance, Risk, and Responsible Use' }, weight: 15 },
      { id: 7, name: { ja: 'トラブルシューティングと最適化', en: 'Troubleshooting and Optimization' }, weight: 10 },
    ],
  },
  {
    code: 'CCDV-F',
    name: { ja: 'Claude 認定デベロッパー – 基礎', en: 'Claude Certified Developer – Foundations' },
    items: 53,
    minutes: 120,
    passScore: 720,
    feeUsd: 125,
    domains: [
      { id: 1, name: { ja: 'エージェントとワークフロー', en: 'Agents and Workflows' }, weight: 14.7 },
      { id: 2, name: { ja: 'アプリケーションと統合', en: 'Applications and Integration' }, weight: 33.1 },
      { id: 3, name: { ja: 'Claude Code', en: 'Claude Code' }, weight: 3.1 },
      { id: 4, name: { ja: '評価・テスト・デバッグ', en: 'Eval, Testing, and Debugging' }, weight: 2.6 },
      { id: 5, name: { ja: 'モデル選択と最適化', en: 'Model Selection and Optimization' }, weight: 16.8 },
      { id: 6, name: { ja: 'プロンプトとコンテキストエンジニアリング', en: 'Prompt and Context Engineering' }, weight: 11.0 },
      { id: 7, name: { ja: 'セキュリティと安全性', en: 'Security and Safety' }, weight: 8.1 },
      { id: 8, name: { ja: 'ツールとMCP', en: 'Tools and MCPs' }, weight: 10.6 },
    ],
  },
  {
    code: 'CCAR-F',
    name: { ja: 'Claude 認定アーキテクト – 基礎', en: 'Claude Certified Architect – Foundations' },
    items: 60,
    minutes: 120,
    passScore: 720,
    feeUsd: 125,
    domains: [
      { id: 1, name: { ja: 'エージェント・アーキテクチャとオーケストレーション', en: 'Agentic Architecture & Orchestration' }, weight: 27 },
      { id: 2, name: { ja: 'ツール設計とMCP統合', en: 'Tool Design & MCP Integration' }, weight: 18 },
      { id: 3, name: { ja: 'Claude Codeの構成とワークフロー', en: 'Claude Code Configuration & Workflows' }, weight: 20 },
      { id: 4, name: { ja: 'プロンプトエンジニアリングと構造化出力', en: 'Prompt Engineering & Structured Output' }, weight: 20 },
      { id: 5, name: { ja: 'コンテキスト管理と信頼性', en: 'Context Management & Reliability' }, weight: 15 },
    ],
    scenarios: {
      pick: 4,
      list: [
        { id: 'S1', title: { ja: 'カスタマーサポート解決エージェント', en: 'Customer Support Resolution Agent' }, description: { ja: 'Claude Agent SDKで返品・請求・アカウント問い合わせを扱うエージェントを構築。MCPツール(get_customer, lookup_order, process_refund, escalate_to_human)を使用し、初回解決率80%以上とエスカレーション判断の両立を目指す。', en: 'You are building a customer support resolution agent with the Claude Agent SDK. It handles returns, billing disputes and account issues through custom MCP tools (get_customer, lookup_order, process_refund, escalate_to_human). Target: 80%+ first-contact resolution while knowing when to escalate.' } },
        { id: 'S2', title: { ja: 'Claude Codeによるコード生成', en: 'Code Generation with Claude Code' }, description: { ja: 'チームがコード生成・デバッグ・リファクタ・ドキュメント作成にClaude Codeを使う。カスタムスラッシュコマンド、CLAUDE.md、plan modeと直接実行の使い分けを開発ワークフローに組み込む。', en: 'Your team uses Claude Code for code generation, refactoring, debugging and documentation. You integrate it into the development workflow with custom slash commands, CLAUDE.md configuration, and a sense of when to use plan mode vs direct execution.' } },
        { id: 'S3', title: { ja: 'マルチエージェント・リサーチシステム', en: 'Multi-Agent Research System' }, description: { ja: 'コーディネーターがWeb検索・文書分析・統合・レポート生成のサブエージェントに委任し、出典付きの包括的レポートを生成するシステムをAgent SDKで構築する。', en: 'You are building a multi-agent research system with the Claude Agent SDK. A coordinator delegates to subagents that search the web, analyze documents, synthesize findings and generate reports, producing comprehensive cited reports.' } },
        { id: 'S4', title: { ja: 'Claudeによる開発者生産性向上', en: 'Developer Productivity with Claude' }, description: { ja: 'Agent SDKで、未知のコードベース探索・レガシー理解・ボイラープレート生成・反復作業の自動化を支援するツールを構築。組み込みツール(Read, Write, Bash, Grep, Glob)とMCPサーバーを統合する。', en: 'You are building developer productivity tools with the Claude Agent SDK to explore unfamiliar codebases, understand legacy systems, generate boilerplate and automate repetitive tasks, using built-in tools (Read, Write, Bash, Grep, Glob) and MCP servers.' } },
        { id: 'S5', title: { ja: '継続的インテグレーションでのClaude Code', en: 'Claude Code for Continuous Integration' }, description: { ja: 'CI/CDパイプラインにClaude Codeを組み込み、自動コードレビュー・テスト生成・PRフィードバックを提供。実用的な指摘を行い誤検知を最小化するプロンプトを設計する。', en: 'You are integrating Claude Code into a CI/CD pipeline for automated code review, test generation and pull request feedback. You must design prompts that give actionable feedback and minimize false positives.' } },
        { id: 'S6', title: { ja: '構造化データ抽出', en: 'Structured Data Extraction' }, description: { ja: '非構造化文書から情報を抽出し、JSONスキーマで検証して高精度を維持。エッジケースを適切に扱い、下流システムと統合する。', en: 'You are building a structured data extraction system that extracts information from unstructured documents, validates output with JSON schemas, maintains high accuracy, handles edge cases gracefully and integrates with downstream systems.' } },
      ],
    },
  },
  {
    code: 'CCAR-P',
    name: { ja: 'Claude 認定アーキテクト – プロフェッショナル', en: 'Claude Certified Architect – Professional' },
    items: 63,
    minutes: 120,
    passScore: 720,
    feeUsd: 175,
    domains: [
      { id: 1, name: { ja: 'ソリューション設計とアーキテクチャ', en: 'Solution Design & Architecture' }, weight: 17 },
      { id: 2, name: { ja: 'Claudeモデル・プロンプト・コンテキストエンジニアリング', en: 'Claude Models, Prompting & Context Engineering' }, weight: 13 },
      { id: 3, name: { ja: '統合', en: 'Integration' }, weight: 19 },
      { id: 4, name: { ja: '評価・テスト・最適化', en: 'Evaluation, Testing & Optimization' }, weight: 16 },
      { id: 5, name: { ja: 'ガバナンス・安全性・リスク管理', en: 'Governance, Safety & Risk Management' }, weight: 14 },
      { id: 6, name: { ja: 'ステークホルダーコミュニケーションとライフサイクル管理', en: 'Stakeholder Communication & Lifecycle Management' }, weight: 14 },
      { id: 7, name: { ja: '開発者生産性と運用基盤', en: 'Developer Productivity & Operational Enablement' }, weight: 7 },
    ],
  },
];

export const EXAM_BY_CODE = Object.fromEntries(EXAMS.map((e) => [e.code, e])) as Record<ExamCode, Exam>;
