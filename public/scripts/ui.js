export function createUI({ onTrackSelect, onPlay, onPause, onStop, onSeek }) {
  const trackList = document.getElementById('track-list');
  const btnPlayPause = document.getElementById('btn-play-pause');
  const btnStop = document.getElementById('btn-stop');
  const progress = document.getElementById('progress');
  const timeCurrent = document.getElementById('time-current');
  const timeTotal = document.getElementById('time-total');
  const errorMessage = document.getElementById('error-message');

  let isPlaying = false;

  btnPlayPause.addEventListener('click', () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  });
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
        const nameSpan = document.createElement('span');
        nameSpan.textContent = track.name;
        li.appendChild(nameSpan);

        if (track.youtube) {
          const link = document.createElement('a');
          link.href = track.youtube;
          link.target = '_blank';
          link.rel = 'noopener';
          link.className = 'youtube-link';
          link.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M23.5 6.2c-.3-1-1-1.8-2-2.1C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.5.6c-1 .3-1.8 1.1-2 2.1C0 8.1 0 12 0 12s0 3.9.5 5.8c.3 1 1 1.8 2 2.1 1.9.6 9.5.6 9.5.6s7.6 0 9.5-.6c1-.3 1.8-1.1 2-2.1.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.5 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>';
          link.addEventListener('click', (e) => e.stopPropagation());
          li.appendChild(link);
        }

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
      isPlaying = true;
      btnPlayPause.textContent = '';
      btnPlayPause.setAttribute('aria-label', 'Pause');
      btnPlayPause.classList.remove('btn-play');
      btnPlayPause.classList.add('btn-pause');
    },

    showPaused() {
      isPlaying = false;
      btnPlayPause.textContent = '';
      btnPlayPause.setAttribute('aria-label', 'Play');
      btnPlayPause.classList.remove('btn-pause');
      btnPlayPause.classList.add('btn-play');
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
