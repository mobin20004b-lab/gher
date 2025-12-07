import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { GameBuilder } from '../GameBuilder';

describe('GameBuilder', () => {
    let container: HTMLDivElement;
    let gameBuilder: GameBuilder;

    beforeEach(() => {
        container = document.createElement('div');
        gameBuilder = new GameBuilder(container);
    });

    it('should create input fields for level data', () => {
        const lettersInput = container.querySelector('#builder-letters') as HTMLInputElement;
        const wordsInput = container.querySelector('#builder-words') as HTMLInputElement;
        const extrasInput = container.querySelector('#builder-extras') as HTMLInputElement;

        expect(lettersInput).not.toBeNull();
        expect(wordsInput).not.toBeNull();
        expect(extrasInput).not.toBeNull();
    });

    it('should validate inputs', () => {
        const lettersInput = container.querySelector('#builder-letters') as HTMLInputElement;

        // This is a simplified test. In a real app we'd trigger events.
        gameBuilder.setLetters('a,b,c');
        expect(gameBuilder.getLetters()).toEqual(['a', 'b', 'c']);
    });

    it('should have an apply button', () => {
        const btn = container.querySelector('#builder-apply-btn');
        expect(btn).not.toBeNull();
    });

    it('should invoke callback on apply', () => {
        let callbackCalled = false;
        let data: any = null;

        gameBuilder.onApply((levelData) => {
            callbackCalled = true;
            data = levelData;
        });

        const lettersInput = container.querySelector('#builder-letters') as HTMLInputElement;
        lettersInput.value = 'a,b,c';
        lettersInput.dispatchEvent(new Event('input')); // If we were using framework binding, but here we just read value on click

        const wordsInput = container.querySelector('#builder-words') as HTMLInputElement;
        wordsInput.value = 'abc';

        const extrasInput = container.querySelector('#builder-extras') as HTMLInputElement;
        extrasInput.value = 'ab,bc';

        const btn = container.querySelector('#builder-apply-btn') as HTMLButtonElement;
        btn.click();

        expect(callbackCalled).toBe(true);
        expect(data).toEqual({
            letters: ['a', 'b', 'c'],
            words: ['abc'],
            extras: ['ab', 'bc']
        });
    });
});
