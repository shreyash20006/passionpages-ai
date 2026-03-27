# PassionPages.ai

An AI-powered learning assistant for college students (B.Tech, M.Tech, B.Pharm, D.Pharm). Powered by Gemini AI.

## Architecture

- **Frontend**: React 19 + Vite 6 + Tailwind CSS 4
- **Backend**: Express.js server (`server.ts`) served via `tsx` in development
- **Auth**: Firebase Authentication (client-side) + Firebase Admin (server-side token verification)
- **Database**: Supabase (stores API keys, chat history, saved notes)
- **AI**: Google Gemini 1.5 Flash

## Running the App

```bash
npm run dev
```

The server starts on port 5000. In development, Vite middleware is used for the frontend. In production, the built `dist/` folder is served as static files.

## Required Environment Variables (Secrets)

Set these in the Replit Secrets panel:

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini API key — required for AI features |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |

## Key Files

- `server.ts` — Express server with all API routes and Vite middleware
- `vite.config.ts` — Vite configuration (port 5000, host 0.0.0.0)
- `src/` — React frontend source
- `firebase-applet-config.json` — Firebase client config (public values only)
- `firestore.rules` — Firestore security rules

## API Routes

- `GET /api/health` — Health check
- `GET/POST /api/settings/keys` — User API key management (auth required)
- `GET/POST /api/chat/history` — Chat history (auth required)
- `GET/POST /api/notes` — Saved notes (auth required)
- `DELETE /api/notes/:id` — Delete a note (auth required)
- `POST /api/chat` — Chat with Gemini AI
- `POST /api/upload` — Analyze uploaded study material

## Security

- All user data endpoints are protected by Firebase ID token verification
- Supabase service key is server-side only (never exposed to frontend)
- JSON body size limited to 50MB
