import { describe, it, expect, beforeEach } from 'vitest';
import { LevelManager } from '../logic/LevelManager';
import levelsData from '../data/levels.json';

describe('LevelManager Progression', () => {
    let levelManager: LevelManager;

    beforeEach(() => {
        levelManager = new LevelManager();
    });

    it('should start at level 0', () => {
        expect(levelManager.getCurrentLevelIndex()).toBe(0);
        expect(levelManager.getCurrentLevelData()?.id).toBe(1);
    });

    it('should progress to next level', () => {
        // Complete level 0
        const level0Words = levelsData.levels[0].words;
        level0Words.forEach(word => levelManager.checkWord(word));

        expect(levelManager.isLevelComplete()).toBe(true);

        const result = levelManager.nextLevel();
        expect(result).toBe(true);
        expect(levelManager.getCurrentLevelIndex()).toBe(1);
        expect(levelManager.getCurrentLevelData()?.id).toBe(2);
    });

    it('should return false when no more levels', () => {
        // Go to last level
        const lastIndex = levelsData.levels.length - 1;
        levelManager.loadLevel(lastIndex);

        expect(levelManager.getCurrentLevelIndex()).toBe(lastIndex);

        const result = levelManager.nextLevel();
        expect(result).toBe(false);
        // Should stay on last level or undefined? Implementation stays on current index but returns false.
        // Actually nextLevel calls loadLevel(index+1) only if valid.
        expect(levelManager.getCurrentLevelIndex()).toBe(lastIndex);
    });

    it('should reset found words on next level', () => {
         // Complete level 0
         const level0Words = levelsData.levels[0].words;
         level0Words.forEach(word => levelManager.checkWord(word));
         expect(levelManager.getFoundWords().length).toBeGreaterThan(0);

         levelManager.nextLevel();
         expect(levelManager.getFoundWords().length).toBe(0);
    });
});
