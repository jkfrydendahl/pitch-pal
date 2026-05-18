/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createUI } from '../public/scripts/ui.js';

describe('ui', () => {
  let container;
  let ui;
  let actions;

  beforeEach(() => {
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

    actions = {
      onTrackSelect: null,
      onPlay: null,
      onPause: null,
      onStop: null,
      onSeek: null,
    };

    ui = createUI({
      onTrackSelect: (idx) => actions.onTrackSelect?.(idx),
      onPlay: () => actions.onPlay?.(),
      onPause: () => actions.onPause?.(),
      onStop: () => actions.onStop?.(),
      onSeek: (time) => actions.onSeek?.(time),
    });
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('track list rendering', () => {
    it('renders tracks with name', () => {
      const tracks = [
        { name: 'Warm Up', url: 'http://x.mp3', duration: '3:45' },
        { name: 'Scales', url: 'http://y.mp3', duration: '5:00' },
      ];
      ui.renderTracks(tracks);

      const items = document.querySelectorAll('#track-list li');
      expect(items).toHaveLength(2);
      expect(items[0].textContent).toBe('Warm Up');
      expect(items[1].textContent).toBe('Scales');
    });

    it('emits onTrackSelect when a track is clicked', () => {
      let selectedIdx = null;
      actions.onTrackSelect = (idx) => { selectedIdx = idx; };

      ui.renderTracks([{ name: 'Track', url: 'http://x.mp3', duration: '1:00' }]);
      document.querySelector('#track-list li').click();

      expect(selectedIdx).toBe(0);
    });
  });

  describe('progress updates', () => {
    it('updates progress bar and time display', () => {
      ui.updateProgress(30, 120);

      const progress = document.getElementById('progress');
      expect(Number(progress.value)).toBe(30);
      expect(Number(progress.max)).toBe(120);
      expect(document.getElementById('time-current').textContent).toBe('0:30');
      expect(document.getElementById('time-total').textContent).toBe('2:00');
    });
  });

  describe('seek', () => {
    it('emits onSeek when progress bar is changed', () => {
      let seekTime = null;
      actions.onSeek = (time) => { seekTime = time; };

      const progress = document.getElementById('progress');
      progress.max = '120';
      progress.value = '45';
      progress.dispatchEvent(new Event('input'));

      expect(seekTime).toBe(45);
    });
  });
});
