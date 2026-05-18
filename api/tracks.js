export default function handler(req, res) {
  const raw = process.env.TRACKS_JSON;

  if (!raw) {
    return res.status(200).json([]);
  }

  try {
    const tracks = JSON.parse(raw);
    const resolved = tracks.map((track) => ({
      ...track,
      url: toDirectUrl(track.url),
    }));
    return res.status(200).json(resolved);
  } catch {
    return res.status(500).json({ error: 'Invalid TRACKS_JSON configuration' });
  }
}

function toDirectUrl(url) {
  // Already a direct URL (not a OneDrive sharing link)
  if (!url.includes('1drv.ms') && !url.includes('onedrive.live.com')) {
    return url;
  }
  // Convert OneDrive share link to direct download URL
  const encoded = Buffer.from(url)
    .toString('base64')
    .replace(/\//g, '_')
    .replace(/\+/g, '-')
    .replace(/=+$/, '');
  return `https://api.onedrive.com/v1.0/shares/u!${encoded}/root/content`;
}
