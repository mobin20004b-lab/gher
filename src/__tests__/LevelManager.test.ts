import { describe, it, expect, beforeEach } from 'vitest';
import { LevelManager, WordCheckResult } from '../logic/LevelManager';

// Mock the JSON data
const mockLevels = {
    levels: [
        {
            id: 1,
            letters: ["a", "b", "c"],
            words: ["ab"],
            extras: ["ba"]
        }
    ]
};

// We need to mock the import of the JSON file
// Since we are using Vitest, we can use vi.mock, but for simplicity in this setup,
// I'll test the public API using the `setLevelData` method if the import is hard to mock in this environment,
// OR I will rely on the real `levels.json` which I created.
// However, LevelManager imports directly from relative path.
// Let's rely on the real file for now, or use setLevelData to inject test data.

describe('LevelManager', () => {
    let manager: LevelManager;

    beforeEach(() => {
        manager = new LevelManager();
        // Inject test data to avoid relying on actual levels.json content for these tests
        manager.setLevelData({
            id: 999,
            letters: ['س', 'ل', 'ا', 'م'],
            words: ['سلام'],
            extras: ['لمس']
        });
    });

    it('should initialize with score 0', () => {
        expect(manager.getScore()).toBe(0);
        expect(manager.getQandonCount()).toBe(0);
    });

    it('should validate a correct target word', () => {
        const result = manager.checkWord('سلام');
        expect(result).toBe(WordCheckResult.TARGET);
        expect(manager.getScore()).toBe(10);
        expect(manager.getFoundWords()).toContain('سلام');
    });

    it('should validate an extra word', () => {
        const result = manager.checkWord('لمس');
        expect(result).toBe(WordCheckResult.EXTRA);
        expect(manager.getQandonCount()).toBe(1);
        expect(manager.getScore()).toBe(0); // Extras might not add to main score, depends on design
    });

    it('should reject invalid words', () => {
        const result = manager.checkWord('xyz');
        expect(result).toBe(WordCheckResult.INVALID);
        expect(manager.getScore()).toBe(0);
    });

    it('should handle already found words', () => {
        manager.checkWord('سلام');
        const result = manager.checkWord('سلام');
        expect(result).toBe(WordCheckResult.ALREADY_FOUND);
        expect(manager.getScore()).toBe(10); // Score shouldn't increase twice
    });

    it('should detect level completion', () => {
        expect(manager.isLevelComplete()).toBe(false);
        manager.checkWord('سلام');
        expect(manager.isLevelComplete()).toBe(true);
    });
});
