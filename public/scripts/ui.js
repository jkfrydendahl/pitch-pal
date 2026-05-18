export function createUI({ onTrackSelect, onPlay, onPause, onStop, onSeek }) {
  const trackList = document.getElementById('track-list');
  const btnPlay = document.getElementById('btn-play');
  const btnPause = document.getElementById('btn-pause');
  const btnStop = document.getElementById('btn-stop');
  const progress = document.getElementById('progress');
  const timeCurrent = document.getElementById('time-current');
  const timeTotal = document.getElementById('time-total');
  const errorMessage = document.getElementById('error-message');

  btnPlay.addEventListener('click', () => onPlay());
  btnPause.addEventListener('click', () => onPause());
  btnStop.addEventListener('click', () => onStop());
  progress.addEventListener('input', () => onSeek(Number(progress.value)));

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  }

  return {
    renderTracks(tracks) {
      trackList.innerHTML = '';
      tracks.forEach((track, idx) => {
        const li = document.createElement('li');
        li.textContent = `${track.name} (${track.duration})`;
        li.addEventListener('click', () => onTrackSelect(idx));
        trackList.appendChild(li);
      });
    },

    updateProgress(currentTime, duration) {
      progress.max = String(duration);
      progress.value = String(currentTime);
      timeCurrent.textContent = formatTime(currentTime);
      timeTotal.textContent = formatTime(duration);
    },

    showPlaying() {
      btnPlay.hidden = true;
      btnPause.hidden = false;
    },

    showPaused() {
      btnPlay.hidden = false;
      btnPause.hidden = true;
    },

    showError(message) {
      errorMessage.textContent = message;
      errorMessage.hidden = false;
    },

    hideError() {
      errorMessage.hidden = true;
    },

    highlightTrack(idx) {
      const items = trackList.querySelectorAll('li');
      items.forEach((li, i) => li.classList.toggle('active', i === idx));
    },
  };
}
