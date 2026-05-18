const STORAGE_KEY = 'pitchpal-positions';

export function createState(storage = globalThis.localStorage) {
  function loadPositions() {
    const raw = storage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  }

  function persistPositions(positions) {
    storage.setItem(STORAGE_KEY, JSON.stringify(positions));
  }

  return {
    savePosition(trackId, time) {
      const positions = loadPositions();
      positions[trackId] = time;
      persistPositions(positions);
    },
    getPosition(trackId) {
      const positions = loadPositions();
      return positions[trackId] || 0;
    },
  };
}
