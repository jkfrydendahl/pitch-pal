/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { createState } from '../public/scripts/state.js';

function createMockStorage() {
  const store = {};
  return {
    getItem(key) { return store[key] ?? null; },
    setItem(key, value) { store[key] = String(value); },
    removeItem(key) { delete store[key]; },
    clear() { Object.keys(store).forEach(k => delete store[k]); },
  };
}

describe('state', () => {
  let state;
  let storage;

  beforeEach(() => {
    storage = createMockStorage();
    state = createState(storage);
  });

  describe('position memory', () => {
    it('saves and retrieves position for a track', () => {
      state.savePosition('track-0', 30);
      expect(state.getPosition('track-0')).toBe(30);
    });

    it('returns 0 for a track with no saved position', () => {
      expect(state.getPosition('track-unknown')).toBe(0);
    });

    it('persists positions across instances (localStorage)', () => {
      state.savePosition('track-0', 45);
      const state2 = createState(storage);
      expect(state2.getPosition('track-0')).toBe(45);
    });
  });
});
