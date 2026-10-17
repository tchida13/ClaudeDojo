# ClaudeDojo

Unofficial practice app for the Claude certification exams (CCAO-F, CCDV-F, CCAR-F, CCAR-P).
All questions are original (ja/en) and unrelated to real exam items. Not affiliated with Anthropic.

- Mock exam (blueprint-weighted, timer, estimated scaled score), practice by domain, review of missed/bookmarked questions
- No accounts: history is stored in the browser; export/import JSON/CSV, optional Google Drive save/load

## Develop
```
npm install
npm run dev
npm test
npm run validate:questions
```

## Google Drive (optional)
Create a Google Cloud OAuth client (Web application), add your site origin to Authorized JavaScript origins,
and set `VITE_GOOGLE_CLIENT_ID` (locally in `.env.local`; on GitHub as repository variable `GOOGLE_CLIENT_ID`).
Scope used: `drive.file` (only files created by this app).

## Deploy
Push to `main`; GitHub Actions builds and publishes to GitHub Pages (Settings → Pages → Source: GitHub Actions).
