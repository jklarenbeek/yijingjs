import { describe, it, expect } from 'vitest';
import * as Yijing from '../src/yijing.js';

describe('Yijing - 64 Hexagrams', () => {
  describe('Basic structure', () => {
    it('should extract upper trigram correctly', () => {
      expect(Yijing.yijing_upper(0b111000)).toBe(0b000);
      expect(Yijing.yijing_upper(0b000111)).toBe(0b111);
    });

    it('should extract lower trigram correctly', () => {
      expect(Yijing.yijing_lower(0b111000)).toBe(0b111);
      expect(Yijing.yijing_lower(0b000111)).toBe(0b000);
    });
  });

  describe('yijing_lineCount', () => {
    it('should count yang lines', () => {
      expect(Yijing.yijing_lineCount(0)).toBe(0);
      expect(Yijing.yijing_lineCount(63)).toBe(6);
      expect(Yijing.yijing_lineCount(21)).toBe(3); // 010101
    });
  });

  describe('yijing_invert', () => {
    it('should flip all lines', () => {
      expect(Yijing.yijing_invert(0)).toBe(63);
      expect(Yijing.yijing_invert(63)).toBe(0);
    });

    it('should be reversible', () => {
      for (let i = 0; i < 64; i++) {
        expect(Yijing.yijing_invert(Yijing.yijing_invert(i))).toBe(i);
      }
    });
  });

  describe('yijing_opposite', () => {
    it('should swap trigrams', () => {
      const hex = 0b111000; // upper=000, lower=111
      const opp = Yijing.yijing_opposite(hex);
      //TODO: expect(Yijing.yijing_upper(opp)).toBe(0b111);
      //TODO: expect(Yijing.yijing_lower(opp)).toBe(0b000);
    });

    it('should be reversible', () => {
      for (let i = 0; i < 64; i++) {
        expect(Yijing.yijing_opposite(Yijing.yijing_opposite(i))).toBe(i);
      }
    });
  });

  describe('yijing_neighbors', () => {
    it('should return 6 neighbors', () => {
      const neighbors = Yijing.yijing_neighbors(0);
      expect(neighbors).toHaveLength(6);
    });

    it('should differ by exactly one bit', () => {
      const hex = 21; // arbitrary hexagram
      const neighbors = Yijing.yijing_neighbors(hex);

      neighbors.forEach(neighbor => {
        const distance = Yijing.yijing_distance(hex, neighbor);
        expect(distance).toBe(1);
      });
    });

    it('should produce unique neighbors', () => {
      const neighbors = Yijing.yijing_neighbors(21);
      const unique = new Set(neighbors);
      expect(unique.size).toBe(6);
    });
  });

  describe('yijing_isBalanced', () => {
    it('should identify balanced hexagrams', () => {
      expect(Yijing.yijing_isBalanced(21)).toBe(true); // 010101
      expect(Yijing.yijing_isBalanced(42)).toBe(true); // 101010
      expect(Yijing.yijing_isBalanced(0)).toBe(false);
      expect(Yijing.yijing_isBalanced(63)).toBe(false);
    });
  });

  describe('yijing_symmetryGroups', () => {
    it('should categorize all 64 hexagrams', () => {
      const groups = Yijing.yijing_symmetryGroups();
      const total = groups.breath.length
        + groups.mothers.length
        + groups.directions.length
        + groups.beginning.length
        + groups.principles.length
        + groups.titans.length
        + groups.gigantes.length;

      expect(total).toBe(64);
    });

    it('should have correct group sizes', () => {
      const groups = Yijing.yijing_symmetryGroups();
      expect(groups.breath.length).toBe(2);
      expect(groups.mothers.length).toBe(6);
      expect(groups.directions.length).toBe(12);
      expect(groups.beginning.length).toBe(2);
      expect(groups.principles.length).toBe(6);
      expect(groups.titans.length).toBe(12);
      expect(groups.gigantes.length).toBe(24);
    });

    it('should not have duplicates across groups', () => {
      const groups = Yijing.yijing_symmetryGroups();
      const allHexagrams = [
        ...groups.breath,
        ...groups.mothers,
        ...groups.directions,
        ...groups.beginning,
        ...groups.principles,
        ...groups.titans,
        ...groups.gigantes
      ];

      const unique = new Set(allHexagrams);
      expect(unique.size).toBe(64);
    });
  });

  describe('yijing_isRoot', () => {
    it('should identify the 4 root hexagrams', () => {
      expect(Yijing.yijing_isRoot(0)).toBe(true);
      expect(Yijing.yijing_isRoot(21)).toBe(true);
      expect(Yijing.yijing_isRoot(42)).toBe(true);
      expect(Yijing.yijing_isRoot(63)).toBe(true);

      expect(Yijing.yijing_isRoot(1)).toBe(false);
      expect(Yijing.yijing_isRoot(20)).toBe(false);
    });
  });

  describe('yijing_center', () => {
    it('should extract nuclear hexagram', () => {
      // Test that center operation eventually reaches a root
      for (let i = 0; i < 64; i++) {
        let hex = i;
        let iterations = 0;
        const maxIterations = 10;

        while (!Yijing.yijing_isRoot(hex) && iterations < maxIterations) {
          hex = Yijing.yijing_center(hex);
          iterations++;
        }

        expect(iterations).toBeLessThan(maxIterations);
        expect(Yijing.yijing_isRoot(hex)).toBe(true);
      }
    });
  });

  describe('yijing_entropy', () => {
    it('should return 0 for pure hexagrams', () => {
      expect(Yijing.yijing_entropy(0)).toBe(0);
      expect(Yijing.yijing_entropy(63)).toBe(0);
    });

    it('should return maximum for balanced hexagrams', () => {
      const entropy21 = Yijing.yijing_entropy(21);
      const entropy42 = Yijing.yijing_entropy(42);

      expect(entropy21).toBeGreaterThan(0.99);
      expect(entropy42).toBeGreaterThan(0.99);
    });

    it('should be between 0 and 1', () => {
      for (let i = 0; i < 64; i++) {
        const entropy = Yijing.yijing_entropy(i);
        expect(entropy).toBeGreaterThanOrEqual(0);
        expect(entropy).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('yijing_balance', () => {
    it('should return 0 for pure yin', () => {
      expect(Yijing.yijing_balance(0)).toBe(0);
    });

    it('should return 1 for pure yang', () => {
      expect(Yijing.yijing_balance(63)).toBe(1);
    });

    it('should return 0.5 for balanced hexagrams', () => {
      expect(Yijing.yijing_balance(21)).toBe(0.5);
      expect(Yijing.yijing_balance(42)).toBe(0.5);
    });
  });
});