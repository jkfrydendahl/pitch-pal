export default function handler(req, res) {
  const raw = process.env.TRACKS_JSON;

  if (!raw) {
    return res.status(200).json([]);
  }

  try {
    const tracks = JSON.parse(raw);
    return res.status(200).json(tracks);
  } catch {
    return res.status(500).json({ error: 'Invalid TRACKS_JSON configuration' });
  }
}
