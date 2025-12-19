import levelsData from '../data/levels.json';

export interface LevelData {
    id: number;
    letters: string[];
    words: string[];
    extras: string[];
}

export enum WordCheckResult {
    TARGET = 'TARGET',
    EXTRA = 'EXTRA',
    INVALID = 'INVALID',
    ALREADY_FOUND = 'ALREADY_FOUND'
}

export class LevelManager {
    private currentLevelIndex: number = 0;
    private currentLevelData: LevelData | null = null;

    private score: number = 0;
    private qandonCount: number = 0; // Extra words count

    private foundWords: Set<string> = new Set();
    private foundExtras: Set<string> = new Set();

    // Optimization: Sets for O(1) lookups
    private targetWordsSet: Set<string> = new Set();
    private extraWordsSet: Set<string> = new Set();

    constructor() {
        this.loadLevel(0);
    }

    public loadLevel(index: number) {
        if (index < 0 || index >= levelsData.levels.length) {
            console.error('Level index out of bounds');
            return;
        }

        this.currentLevelIndex = index;
        this.currentLevelData = levelsData.levels[index];
        this.resetLevelState();
    }

    // Allows dynamic loading (e.g. from Admin panel)
    public setLevelData(data: LevelData) {
        this.currentLevelData = data;
        this.resetLevelState();
    }

    private resetLevelState() {
        this.foundWords.clear();
        this.foundExtras.clear();

        // Rebuild lookup sets
        if (this.currentLevelData) {
            this.targetWordsSet = new Set(this.currentLevelData.words);
            this.extraWordsSet = new Set(this.currentLevelData.extras);
        } else {
            this.targetWordsSet.clear();
            this.extraWordsSet.clear();
        }

        // We typically don't reset global score between levels in this genre,
        // but for now let's keep score cumulative and just reset word tracking.
    }

    public checkWord(word: string): WordCheckResult {
        if (!this.currentLevelData) return WordCheckResult.INVALID;

        if (this.foundWords.has(word) || this.foundExtras.has(word)) {
            return WordCheckResult.ALREADY_FOUND;
        }

        // Optimized lookup using Set.has() - O(1)
        if (this.targetWordsSet.has(word)) {
            this.foundWords.add(word);
            this.score += 10; // Logic for scoring
            return WordCheckResult.TARGET;
        }

        // Optimized lookup using Set.has() - O(1)
        if (this.extraWordsSet.has(word)) {
            this.foundExtras.add(word);
            this.qandonCount++;
            return WordCheckResult.EXTRA;
        }

        return WordCheckResult.INVALID;
    }

    public getScore(): number {
        return this.score;
    }

    public getQandonCount(): number {
        return this.qandonCount;
    }

    public getCurrentLevelData(): LevelData | null {
        return this.currentLevelData;
    }

    public isLevelComplete(): boolean {
        if (!this.currentLevelData) return false;
        return this.foundWords.size === this.currentLevelData.words.length;
    }

    public getFoundWords(): string[] {
        return Array.from(this.foundWords);
    }
}
