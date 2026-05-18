import { head } from '@vercel/blob';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    // Verify the blob exists and get metadata
    const metadata = await head(url);

    // Fetch the actual blob content with the server-side token
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch audio' });
    }

    // Stream the audio back with correct headers
    res.setHeader('Content-Type', metadata.contentType || 'audio/mpeg');
    res.setHeader('Content-Length', metadata.size);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=86400');

    const buffer = Buffer.from(await response.arrayBuffer());
    return res.status(200).send(buffer);
  } catch (error) {
    return res.status(404).json({ error: 'Audio file not found' });
  }
}
