import { getDownloadUrl } from '@vercel/blob';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const downloadUrl = await getDownloadUrl(url);
    return res.status(200).json({ downloadUrl });
  } catch (error) {
    return res.status(404).json({ error: 'Audio file not found' });
  }
}
