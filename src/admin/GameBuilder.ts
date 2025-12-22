import { LevelData as GameLevelData } from '../logic/LevelManager';

// Temporary interface until we fully merge or we can use Partial<GameLevelData>
export interface LevelDataBuilder {
    letters: string[];
    words: string[];
    extras: string[];
}

export class GameBuilder {
    private container: HTMLElement;
    private applyCallback: ((data: LevelDataBuilder) => void) | null = null;

    private lettersInput!: HTMLInputElement;
    private wordsInput!: HTMLInputElement;
    private extrasInput!: HTMLInputElement;

    constructor(parent: HTMLElement) {
        this.container = document.createElement('div');
        this.container.className = 'game-builder';
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.gap = '10px';
        parent.appendChild(this.container);

        this.render();
    }

    private render() {
        this.createInputGroup('Letters (comma separated)', 'builder-letters');
        this.createInputGroup('Target Words (comma separated)', 'builder-words');
        this.createInputGroup('Extra Words (comma separated)', 'builder-extras');

        const btn = document.createElement('button');
        btn.id = 'builder-apply-btn';
        btn.textContent = 'Apply Changes';

        // Button styling
        btn.style.marginTop = '10px';
        btn.style.padding = '10px 15px';
        btn.style.backgroundColor = '#4CAF50';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.style.width = '100%';
        btn.style.fontWeight = 'bold';
        btn.style.fontSize = '14px';
        btn.setAttribute('aria-label', 'Apply changes to level');

        // Hover effects
        btn.addEventListener('mouseenter', () => btn.style.backgroundColor = '#45a049');
        btn.addEventListener('mouseleave', () => btn.style.backgroundColor = '#4CAF50');

        // Focus styles for accessibility
        btn.addEventListener('focus', () => {
            btn.style.outline = '2px solid white';
            btn.style.outlineOffset = '2px';
        });
        btn.addEventListener('blur', () => btn.style.outline = 'none');

        btn.onclick = () => this.handleApply(btn);
        this.container.appendChild(btn);
    }

    private createInputGroup(labelText: string, id: string) {
        const group = document.createElement('div');
        const label = document.createElement('label');
        label.textContent = labelText;
        label.htmlFor = id;
        label.style.display = 'block';

        const input = document.createElement('input');
        input.id = id;
        input.type = 'text';
        input.style.width = '100%';
        input.style.padding = '8px';
        input.style.marginBottom = '5px';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '4px';
        input.style.boxSizing = 'border-box';
        input.style.backgroundColor = '#333';
        input.style.color = 'white';

        // Accessibility: Visual focus indicator
        input.addEventListener('focus', () => {
            input.style.outline = '2px solid #4CAF50';
            input.style.borderColor = '#4CAF50';
        });
        input.addEventListener('blur', () => {
            input.style.outline = 'none';
            input.style.borderColor = '#ccc';
        });

        if (id === 'builder-letters') this.lettersInput = input;
        if (id === 'builder-words') this.wordsInput = input;
        if (id === 'builder-extras') this.extrasInput = input;

        group.appendChild(label);
        group.appendChild(input);
        this.container.appendChild(group);
    }

    public setLetters(val: string) {
        if (this.lettersInput) {
            this.lettersInput.value = val;
        }
    }

    public getLetters(): string[] {
        return this.lettersInput.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
    }

    public onApply(callback: (data: LevelDataBuilder) => void) {
        this.applyCallback = callback;
    }

    private handleApply(btn?: HTMLButtonElement) {
        const letters = this.lettersInput.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
        const words = this.wordsInput.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
        const extras = this.extrasInput.value.split(',').map(s => s.trim()).filter(s => s.length > 0);

        const data: LevelDataBuilder = {
            letters,
            words,
            extras
        };

        if (this.applyCallback) {
            this.applyCallback(data);
        }

        // Feedback animation
        if (btn) {
            const originalText = btn.textContent;
            // Don't capture background color as it might be the hover state

            btn.textContent = 'Applied! ✓';
            btn.style.backgroundColor = '#2E7D32'; // Darker green
            btn.setAttribute('aria-label', 'Changes applied successfully');

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '#4CAF50'; // Restore default color
                btn.setAttribute('aria-label', 'Apply changes to level');
            }, 1000);
        }
    }
}
