export function createPlayer() {
  const audio = new Audio();
  let playing = false;

  return {
    load(url) {
      audio.src = url;
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
    isPlaying() {
      return playing;
    },
    getCurrentTime() {
      return audio.currentTime;
    },
  };
}
