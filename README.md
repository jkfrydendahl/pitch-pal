# PitchPal 🎵

A simple PWA for playing vocal exercise audio files. Select a track, play/pause/stop, and pick up where you left off.

## Features

- Play/pause/stop audio controls
- Multiple track selection with position memory
- Progress bar with seek
- Installable PWA (add to home screen)
- Hosted on Vercel

## Setup

```bash
npm install
```

## Development

```bash
npm test          # Run tests
npm run test:watch  # Watch mode
```

## Deployment

Hosted on Vercel. Track URLs are configured via the `TRACKS_JSON` environment variable in the Vercel dashboard.

### TRACKS_JSON format

```json
[
  { "name": "Warm Up Scales", "url": "https://your-onedrive-link/warmup.mp3", "duration": "3:45" },
  { "name": "Lip Trills", "url": "https://your-onedrive-link/liptrills.mp3", "duration": "5:00" }
]
```

## Architecture

- `public/` — Static PWA (HTML, CSS, JS modules)
- `api/tracks.js` — Vercel serverless function (reads env var)
- `tests/` — Vitest unit tests