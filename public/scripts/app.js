import { createPlayer } from './player.js';
import { createState } from './state.js';
import { createUI } from './ui.js';

async function resolveAudioUrl(url) {
  if (url.startsWith('/api/audio')) {
    const response = await fetch(url);
    const data = await response.json();
    return data.downloadUrl;
  }
  return url;
}

export async function createApp() {
  const player = createPlayer();
  const state = createState();
  let currentTrackIdx = null;
  let tracks = [];

  const ui = createUI({
    async onTrackSelect(idx) {
      if (currentTrackIdx !== null && currentTrackIdx !== idx) {
        state.savePosition(`track-${currentTrackIdx}`, player.getCurrentTime());
      }
      currentTrackIdx = idx;
      const track = tracks[idx];
      const savedPosition = state.getPosition(`track-${idx}`);

      // Resolve the audio URL (may need signed URL from proxy)
      const audioUrl = await resolveAudioUrl(track.url);
      player.load(audioUrl);
      player.seekTo(savedPosition);
      ui.highlightTrack(idx);
      ui.showPaused();
    },
    onPlay() {
      if (currentTrackIdx === null) return;
      player.play();
      ui.showPlaying();
    },
    onPause() {
      player.pause();
      ui.showPaused();
    },
    onStop() {
      player.stop();
      state.savePosition(`track-${currentTrackIdx}`, 0);
      ui.showPaused();
      ui.updateProgress(0, 0);
    },
    onSeek(time) {
      player.seekTo(time);
    },
  });

  player.onTimeUpdate((currentTime, duration) => {
    ui.updateProgress(currentTime, duration);
  });

  try {
    const response = await fetch('/api/tracks');
    const data = await response.json();
    tracks = data;
    ui.renderTracks(tracks);
  } catch {
    ui.showError('Failed to load tracks. Please check your connection and try again.');
  }

  return {
    _testSetCurrentTime(time) {
      player._testSetCurrentTime(time);
    },
    _testGetSavedPosition(trackId) {
      return state.getPosition(trackId);
    },
  };
}
