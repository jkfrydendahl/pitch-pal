/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createApp } from '../public/scripts/app.js';

describe('app integration', () => {
  let container;

  beforeEach(() => {
    // Provide localStorage for state module
    const store = {};
    vi.stubGlobal('localStorage', {
      getItem: (key) => store[key] ?? null,
      setItem: (key, value) => { store[key] = String(value); },
      removeItem: (key) => { delete store[key]; },
      clear: () => { Object.keys(store).forEach(k => delete store[k]); },
    });

    container = document.createElement('div');
    container.innerHTML = `
      <ul id="track-list"></ul>
      <button id="btn-play-pause">▶</button>
      <button id="btn-stop">Stop</button>
      <input id="progress" type="range" min="0" max="100" value="0">
      <span id="time-current">0:00</span>
      <span id="time-total">0:00</span>
      <div id="error-message" hidden></div>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.unstubAllGlobals();
  });

  it('switches tracks and saves position of previous track', async () => {
    const tracks = [
      { name: 'Track A', url: 'http://a.mp3', duration: '2:00' },
      { name: 'Track B', url: 'http://b.mp3', duration: '3:00' },
    ];

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(tracks),
    });
    vi.stubGlobal('fetch', fetchMock);

    const app = await createApp();

    // Select track A
    document.querySelectorAll('#track-list li')[0].click();
    // Simulate some playback time
    app._testSetCurrentTime(30);
    // Switch to track B
    document.querySelectorAll('#track-list li')[1].click();

    // Track A's position should have been saved
    expect(app._testGetSavedPosition('track-0')).toBe(30);

    vi.unstubAllGlobals();
  });

  it('shows error when fetch fails', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('Network error'));
    vi.stubGlobal('fetch', fetchMock);

    await createApp();

    const errorEl = document.getElementById('error-message');
    expect(errorEl.hidden).toBe(false);
    expect(errorEl.textContent).toContain('Failed to load tracks');

    vi.unstubAllGlobals();
  });
});
