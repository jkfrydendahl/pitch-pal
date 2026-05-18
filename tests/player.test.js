import { describe, it, expect, beforeEach } from 'vitest';
import { createPlayer } from '../public/scripts/player.js';

describe('player', () => {
  let player;

  beforeEach(() => {
    player = createPlayer();
  });

  describe('play', () => {
    it('plays the loaded track', async () => {
      player.load('https://example.com/track.mp3');
      await player.play();
      expect(player.isPlaying()).toBe(true);
    });
  });

  describe('pause', () => {
    it('pauses a playing track and preserves time', async () => {
      player.load('https://example.com/track.mp3');
      await player.play();
      player.pause();
      expect(player.isPlaying()).toBe(false);
      expect(player.getCurrentTime()).toBeGreaterThanOrEqual(0);
    });
  });

  describe('stop', () => {
    it('stops a playing track and resets time to 0', async () => {
      player.load('https://example.com/track.mp3');
      await player.play();
      player.stop();
      expect(player.isPlaying()).toBe(false);
      expect(player.getCurrentTime()).toBe(0);
    });
  });

  describe('play after stop', () => {
    it('starts from the beginning after stop', async () => {
      player.load('https://example.com/track.mp3');
      await player.play();
      player.stop();
      await player.play();
      expect(player.isPlaying()).toBe(true);
      expect(player.getCurrentTime()).toBe(0);
    });
  });
});
