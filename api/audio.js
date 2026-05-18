import { head } from '@vercel/blob';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const metadata = await head(url, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // metadata.downloadUrl is a signed URL that grants temporary access
    res.setHeader('Cache-Control', 'private, no-store');
    return res.redirect(307, metadata.downloadUrl);
  } catch (error) {
    return res.status(404).json({ error: 'Audio file not found' });
  }
}
