import { describe, it, expect } from 'vitest';
import * as Bagua from '../src/bagua.js';
import * as Wuxing from '../src/wuxing.js';

describe('Bagua - Eight Trigrams', () => {
  describe('bagua_toWuxing', () => {
    it('should map trigrams to correct elements', () => {
      expect(Bagua.bagua_toWuxing(0)).toBe(Wuxing.WUXING_EARTH); // Kun
      expect(Bagua.bagua_toWuxing(1)).toBe(Wuxing.WUXING_EARTH); // Gen
      expect(Bagua.bagua_toWuxing(2)).toBe(Wuxing.WUXING_WATER); // Kan
      expect(Bagua.bagua_toWuxing(3)).toBe(Wuxing.WUXING_WOOD);  // Xun
      expect(Bagua.bagua_toWuxing(4)).toBe(Wuxing.WUXING_WOOD);  // Zhen
      expect(Bagua.bagua_toWuxing(5)).toBe(Wuxing.WUXING_FIRE);  // Li
      expect(Bagua.bagua_toWuxing(6)).toBe(Wuxing.WUXING_METAL); // Dui
      expect(Bagua.bagua_toWuxing(7)).toBe(Wuxing.WUXING_METAL); // Qian
    });

    it('should handle all 8 trigrams', () => {
      for (let i = 0; i < 8; i++) {
        expect(() => Bagua.bagua_toWuxing(i)).not.toThrow();
      }
    });
  });

  describe('bagua_toName', () => {
    it('should return correct names for all trigrams', () => {
      expect(Bagua.bagua_toName(0)).toBe(Bagua.BAGUA_EARTH);
      expect(Bagua.bagua_toName(7)).toBe(Bagua.BAGUA_HEAVEN);
    });
  });

  describe('bagua_reverse', () => {
    it('should reverse line order', () => {
      // 001 (1) should become 100 (4)
      expect(Bagua.bagua_reverse(1)).toBe(4);
      // 010 (2) should stay 010 (2)
      expect(Bagua.bagua_reverse(2)).toBe(2);
      // 111 (7) should stay 111 (7)
      expect(Bagua.bagua_reverse(7)).toBe(7);
    });
  });

  describe('bagua_invert', () => {
    it('should flip all lines', () => {
      expect(Bagua.bagua_invert(0)).toBe(7); // 000 -> 111
      expect(Bagua.bagua_invert(7)).toBe(0); // 111 -> 000
      expect(Bagua.bagua_invert(5)).toBe(2); // 101 -> 010
    });
  });

  describe('bagua_lineCount', () => {
    it('should count yang lines correctly', () => {
      expect(Bagua.bagua_lineCount(0)).toBe(0); // 000
      expect(Bagua.bagua_lineCount(7)).toBe(3); // 111
      expect(Bagua.bagua_lineCount(5)).toBe(2); // 101
    });
  });
});