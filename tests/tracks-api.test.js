import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import handler from '../api/tracks.js';

function createMockReq() {
  return {};
}

function createMockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) { res.statusCode = code; return res; },
    setHeader(key, value) { res.headers[key] = value; return res; },
    json(data) { res.body = data; return res; },
  };
  return res;
}

describe('api/tracks', () => {
  const originalEnv = process.env.TRACKS_JSON;

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.TRACKS_JSON = originalEnv;
    } else {
      delete process.env.TRACKS_JSON;
    }
  });

  it('returns tracks from TRACKS_JSON env var', () => {
    const tracks = [{ name: 'Warm Up', url: 'https://example.com/warmup.mp3' }];
    process.env.TRACKS_JSON = JSON.stringify(tracks);

    const res = createMockRes();
    handler(createMockReq(), res);

    expect(res.statusCode).toBe(200);
    expect(res.body[0].name).toBe('Warm Up');
    expect(res.body[0].url).toBe('https://example.com/warmup.mp3');
  });

  it('returns Vercel Blob URLs directly', () => {
    const tracks = [{ name: 'Test', url: 'https://abc.public.blob.vercel-storage.com/track.mp3', duration: '1:00' }];
    process.env.TRACKS_JSON = JSON.stringify(tracks);

    const res = createMockRes();
    handler(createMockReq(), res);

    expect(res.statusCode).toBe(200);
    expect(res.body[0].url).toBe('https://abc.public.blob.vercel-storage.com/track.mp3');
  });

  it('returns empty array when TRACKS_JSON is not set', () => {
    delete process.env.TRACKS_JSON;

    const res = createMockRes();
    handler(createMockReq(), res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns 500 when TRACKS_JSON is invalid JSON', () => {
    process.env.TRACKS_JSON = 'not valid json{';

    const res = createMockRes();
    handler(createMockReq(), res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});
