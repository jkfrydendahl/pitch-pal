export default function handler(req, res) {
  const raw = process.env.TRACKS_JSON;

  if (!raw) {
    return res.status(200).json([]);
  }

  try {
    const tracks = JSON.parse(raw);
    const resolved = tracks.map((track) => ({
      ...track,
      url: toProxyUrl(track.url),
    }));
    return res.status(200).json(resolved);
  } catch {
    return res.status(500).json({ error: 'Invalid TRACKS_JSON configuration' });
  }
}

function toProxyUrl(url) {
  // If it's a Vercel Blob URL, route through our proxy
  if (url.includes('.blob.vercel-storage.com') || url.includes('.public.blob')) {
    return `/api/audio?url=${encodeURIComponent(url)}`;
  }
  return url;
}
