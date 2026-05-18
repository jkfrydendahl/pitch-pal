export function createPlayer() {
  const audio = new Audio();
  let playing = false;
  let timeUpdateCallback = null;

  audio.addEventListener('timeupdate', () => {
    if (timeUpdateCallback) {
      timeUpdateCallback(audio.currentTime, audio.duration || 0);
    }
  });

  audio.addEventListener('loadedmetadata', () => {
    if (timeUpdateCallback) {
      timeUpdateCallback(audio.currentTime, audio.duration || 0);
    }
  });

  return {
    load(url) {
      audio.src = url;
      audio.load();
    },
    async play() {
      await audio.play();
      playing = true;
    },
    pause() {
      audio.pause();
      playing = false;
    },
    stop() {
      audio.pause();
      audio.currentTime = 0;
      playing = false;
    },
    seekTo(time) {
      audio.currentTime = time;
    },
    isPlaying() {
      return playing;
    },
    getCurrentTime() {
      return audio.currentTime;
    },
    onTimeUpdate(callback) {
      timeUpdateCallback = callback;
    },
    _testSetCurrentTime(time) {
      audio.currentTime = time;
    },
  };
}
