# PitchPal 🎵

A simple PWA for playing vocal exercise audio files. Select a track, play/pause/stop, and pick up where you left off.

## Features

- Play/pause/stop audio controls
- Multiple track selection with position memory
- Progress bar with seek
- Installable PWA (add to home screen)
- Dark theme
- Hosted on Vercel

## Setup

```bash
npm install
```

## Development

```bash
npm test            # Run tests
npm run test:watch  # Watch mode
```

## Deployment

Hosted on Vercel. Track URLs are configured via the `TRACKS_JSON` environment variable in the Vercel dashboard.

Audio files are stored in Vercel Blob (public access).

### TRACKS_JSON format

```json
[
  { "name": "All Exercises", "url": "https://your-store.public.blob.vercel-storage.com/file.mp3" },
  { "name": "Warm Up Only", "url": "https://your-store.public.blob.vercel-storage.com/warmup.mp3" }
]
```

## Architecture

- `public/` - Static PWA (HTML, CSS, JS modules)
- `api/tracks.js` - Vercel serverless function (reads `TRACKS_JSON` env var)
- `tests/` - Vitest unit tests