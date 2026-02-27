# Immersion Hub Frontend

Frontend application for Immersion Hub, built with React + TypeScript + Vite.

## Stack

- React 19
- TypeScript
- Vite 7
- Tailwind CSS 4
- Lucide icons
- Motion (animations)

## Features

- Dashboard-style language learning UI
- Flashcard deck management and review flow
- Study materials by category and language
- Transcription area with local saved records
- Inspiration and tips screens
- UI language toggle (`PT` / `EN`) in the navbar

## Requirements

- Node.js 20+ (recommended)
- npm 10+

## Environment Variables

Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:8080
```

Notes:
- In local development, Vite also proxies `/api` to `http://localhost:8080` (see `vite.config.ts`).
- For production deploy, set `VITE_API_URL` to your backend public URL.

## Run Locally

```bash
npm install
npm run dev
```

Default dev URL: `http://localhost:5173`

## Lint

```bash
npm run lint
```

## Build

```bash
npm run build
```

Build output is generated in `dist/`.

## Preview Production Build

```bash
npm run preview
```

## Deployment Checklist

1. Set `VITE_API_URL` to the production backend URL.
2. Run `npm run lint` and fix blocking issues.
3. Run `npm run build`.
4. Deploy the `dist/` folder to your static host (Vercel, Netlify, S3+CloudFront, Nginx, etc.).
5. Confirm API CORS allows your frontend domain.

## Project Scripts

- `npm run dev` - start local development server
- `npm run lint` - run ESLint
- `npm run build` - type-check and production build
- `npm run preview` - preview built app
