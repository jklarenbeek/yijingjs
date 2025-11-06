import { describe, it, expect } from 'vitest';
import * as Wuxing from '../src/wuxing.js';

describe('Wuxing - Five Elements', () => {
  describe('Element constants', () => {
    it('should have all five elements defined', () => {
      expect(Wuxing.WUXING_EARTH).toBe('earth');
      expect(Wuxing.WUXING_WATER).toBe('water');
      expect(Wuxing.WUXING_WOOD).toBe('wood');
      expect(Wuxing.WUXING_FIRE).toBe('fire');
      expect(Wuxing.WUXING_METAL).toBe('metal');
    });
  });

  describe('wuxing_createsNext', () => {
    it('should follow the generative cycle', () => {
      expect(Wuxing.wuxing_createsNext(Wuxing.WUXING_EARTH)).toBe(Wuxing.WUXING_METAL);
      expect(Wuxing.wuxing_createsNext(Wuxing.WUXING_METAL)).toBe(Wuxing.WUXING_WATER);
      expect(Wuxing.wuxing_createsNext(Wuxing.WUXING_WATER)).toBe(Wuxing.WUXING_WOOD);
      expect(Wuxing.wuxing_createsNext(Wuxing.WUXING_WOOD)).toBe(Wuxing.WUXING_FIRE);
      expect(Wuxing.wuxing_createsNext(Wuxing.WUXING_FIRE)).toBe(Wuxing.WUXING_EARTH);
    });

    it('should complete the cycle', () => {
      let element = Wuxing.WUXING_EARTH;
      for (let i = 0; i < 5; i++) {
        element = Wuxing.wuxing_createsNext(element);
      }
      expect(element).toBe(Wuxing.WUXING_EARTH);
    });
  });

  describe('wuxing_destroysNext', () => {
    it('should follow the destructive cycle', () => {
      expect(Wuxing.wuxing_destroysNext(Wuxing.WUXING_EARTH)).toBe(Wuxing.WUXING_WATER);
      expect(Wuxing.wuxing_destroysNext(Wuxing.WUXING_WATER)).toBe(Wuxing.WUXING_FIRE);
      expect(Wuxing.wuxing_destroysNext(Wuxing.WUXING_FIRE)).toBe(Wuxing.WUXING_METAL);
      expect(Wuxing.wuxing_destroysNext(Wuxing.WUXING_METAL)).toBe(Wuxing.WUXING_WOOD);
      expect(Wuxing.wuxing_destroysNext(Wuxing.WUXING_WOOD)).toBe(Wuxing.WUXING_EARTH);
    });
  });

  describe('wuxing_transitionType', () => {
    it('should return NEUTRAL for same element', () => {
      expect(Wuxing.wuxing_transitionType(Wuxing.WUXING_EARTH, Wuxing.WUXING_EARTH))
        .toBe(Wuxing.WUXING_NEUTRAL);
    });

    it('should return CREATES for generative relationship', () => {
      expect(Wuxing.wuxing_transitionType(Wuxing.WUXING_WOOD, Wuxing.WUXING_FIRE))
        .toBe(Wuxing.WUXING_CREATES);
    });

    it('should return DESTROYS for destructive relationship', () => {
      expect(Wuxing.wuxing_transitionType(Wuxing.WUXING_WATER, Wuxing.WUXING_FIRE))
        .toBe(Wuxing.WUXING_DESTROYS);
    });
  });

  describe('wuxing_toEmojiChar', () => {
    it('should return emoji for each element', () => {
      expect(Wuxing.wuxing_toEmojiChar(Wuxing.WUXING_EARTH)).toBe('⚖️');
      expect(Wuxing.wuxing_toEmojiChar(Wuxing.WUXING_WATER)).toBe('💧');
      expect(Wuxing.wuxing_toEmojiChar(Wuxing.WUXING_WOOD)).toBe('🌱');
      expect(Wuxing.wuxing_toEmojiChar(Wuxing.WUXING_FIRE)).toBe('🔥');
      expect(Wuxing.wuxing_toEmojiChar(Wuxing.WUXING_METAL)).toBe('⚙️');
    });

    it('should throw error for unknown element', () => {
      expect(() => Wuxing.wuxing_toEmojiChar('invalid')).toThrow();
    });
  });
});