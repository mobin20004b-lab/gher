import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
    private saucer!: Phaser.GameObjects.Image;
    private letters: Phaser.GameObjects.Container[] = [];
    private currentWord: string = '';
    private currentWordSlots: Phaser.GameObjects.Container[] = [];
    private scoreText!: Phaser.GameObjects.Text;
    private score: number = 0;

    // Qandon related
    private qandon!: Phaser.GameObjects.Image;
    private qandonCountText!: Phaser.GameObjects.Text;
    private qandonCount: number = 0;

    // Interaction
    private isDragging: boolean = false;
    private selectedLetters: Phaser.GameObjects.Container[] = [];
    private lineGraphics!: Phaser.GameObjects.Graphics;
    private wordPreviewText!: Phaser.GameObjects.Text;

    // Mock data for a level
    private levelData: { letters: string[], words: string[], extras: string[] } = {
        letters: ['س', 'ل', 'ا', 'م'], // Salaam
        words: ['سلام'], // Target words
        extras: ['لمس', 'سام'] // Valid extra words for Qandon
    };

    constructor() {
        super('game');
    }

    public updateLevelData(data: { letters: string[], words: string[], extras: string[] }) {
        this.levelData = data;
        this.scene.restart();
    }

    create() {
        const { width, height } = this.scale;
        const centerX = width / 2;

        // --- Background ---
        this.add.tileSprite(0, 0, width, height, 'background').setOrigin(0, 0);

        // --- HUD ---
        // Score
        this.add.image(70, 40, 'panel_hud');
        this.scoreText = this.add.text(70, 40, '0', {
            fontFamily: 'Arial', fontSize: '24px', color: '#ffd700', rtl: true
        }).setOrigin(0.5);
        this.add.text(70, 15, 'سکه', { fontFamily: 'Arial', fontSize: '12px', color: '#aaaaaa' }).setOrigin(0.5);

        // Qandon (Sugar bowl)
        this.qandon = this.add.image(width - 50, 40, 'qandon').setScale(0.8);
        this.qandonCountText = this.add.text(width - 50, 45, '0', {
            fontFamily: 'Arial', fontSize: '16px', color: '#000000'
        }).setOrigin(0.5);

        // --- Character ---
        const char = this.add.image(centerX, 120, 'character');

        // --- Target Slots ---
        this.createTargetSlots(this.levelData.words[0].length);

        // --- Saucer & Letters Area ---
        const saucerY = height - 150;
        this.saucer = this.add.image(centerX, saucerY, 'saucer');

        // Shuffle Button (Center of saucer)
        const shuffleBtn = this.add.image(centerX, saucerY, 'btn_shuffle').setInteractive();
        shuffleBtn.on('pointerdown', () => this.shuffleLetters());

        // Line Graphics
        this.lineGraphics = this.add.graphics();

        // Word Preview (floating above saucer)
        this.wordPreviewText = this.add.text(centerX, saucerY - 140, '', {
            fontFamily: 'Arial', fontSize: '32px', color: '#ffffff',
            backgroundColor: '#00000088', padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setVisible(false);

        // --- Letters ---
        this.createLetters(centerX, saucerY);

        // --- Global Input Handling ---
        this.input.on('pointerup', this.handlePointerUp, this);
        this.input.on('pointermove', this.handlePointerMove, this);
    }

    private createTargetSlots(length: number) {
        const { width, height } = this.scale;
        const startX = width / 2 - ((length - 1) * 28); // tighter spacing
        const y = height / 2 - 20;

        // Clear existing
        this.currentWordSlots.forEach(s => s.destroy());
        this.currentWordSlots = [];

        for(let i = 0; i < length; i++) {
            const container = this.add.container(startX + i * 60, y);

            // Background
            const bg = this.add.image(0, 0, 'slot_bg'); // Empty slot

            // Text
            const text = this.add.text(0, 0, '', {
                fontFamily: 'Arial', fontSize: '30px', color: '#5d4037', fontStyle: 'bold'
            }).setOrigin(0.5);

            container.add([bg, text]);
            this.currentWordSlots.push(container);
        }
    }

    private createLetters(centerX: number, centerY: number) {
        // Clear if existing
        this.letters.forEach(l => l.destroy());
        this.letters = [];

        this.levelData.letters.forEach((char, index) => {
            const container = this.add.container(0, 0);

            // Background
            const bg = this.add.image(0, 0, 'letter_bg');

            // Text
            const text = this.add.text(0, 0, char, {
                fontFamily: 'Arial', fontSize: '32px', color: '#5d4037', fontStyle: 'bold'
            }).setOrigin(0.5);

            container.add([bg, text]);
            container.setSize(60, 60);

            // Store original texture key for restoration
            container.setData('defaultTexture', 'letter_bg');

            // Interaction for starting drag
            container.setInteractive(new Phaser.Geom.Circle(0, 0, 30), Phaser.Geom.Circle.Contains);
            container.on('pointerdown', () => this.handleLetterDown(container, char));

            // Enable input for hit testing during drag
            this.input.enableDebug(container); // optional

            this.letters.push(container);
        });

        this.shuffleLetters();
    }

    private shuffleLetters() {
        const { width, height } = this.scale;
        const centerX = width / 2;
        const centerY = height - 150;
        const radius = 80;

        const shuffled = Phaser.Utils.Array.Shuffle([...this.letters]);

        shuffled.forEach((letter, index) => {
             const angle = (index / shuffled.length) * Math.PI * 2 - (Math.PI / 2); // Start top
             const x = centerX + Math.cos(angle) * radius;
             const y = centerY + Math.sin(angle) * radius;

             this.tweens.add({
                 targets: letter,
                 x: x,
                 y: y,
                 duration: 400,
                 ease: 'Back.out'
             });

             // Reset state
             const bg = letter.first as Phaser.GameObjects.Image;
             bg.setTexture('letter_bg');
             letter.setScale(1);
        });
    }

    // --- Interaction Logic ---

    private handleLetterDown(container: Phaser.GameObjects.Container, char: string) {
        if (this.isDragging) return;

        this.isDragging = true;
        this.selectLetter(container, char);
    }

    private handlePointerMove(pointer: Phaser.Input.Pointer) {
        if (!this.isDragging) return;

        // Draw line
        this.updateLine(pointer);

        // Check collision with other letters
        // We do a manual distance check or physics overlap. Simple distance check is fine.
        this.letters.forEach(letter => {
            if (this.selectedLetters.includes(letter)) return;

            // Simple circular hit test
            const dx = pointer.x - letter.x;
            const dy = pointer.y - letter.y;
            if (dx*dx + dy*dy < 30*30) { // Radius 30
                // Add to selection
                const textObj = letter.list[1] as Phaser.GameObjects.Text;
                this.selectLetter(letter, textObj.text);
            }
        });
    }

    private handlePointerUp() {
        if (!this.isDragging) return;

        this.isDragging = false;
        this.lineGraphics.clear();
        this.wordPreviewText.setVisible(false);

        // Check Word
        this.checkWord();

        // Reset Selection Visuals
        this.selectedLetters.forEach(letter => {
            const bg = letter.first as Phaser.GameObjects.Image;
            bg.setTexture('letter_bg');
            this.tweens.add({
                targets: letter,
                scale: 1,
                duration: 200
            });
        });
        this.selectedLetters = [];
        this.currentWord = '';
    }

    private selectLetter(container: Phaser.GameObjects.Container, char: string) {
        this.selectedLetters.push(container);
        this.currentWord += char;

        // Visual feedback
        const bg = container.first as Phaser.GameObjects.Image;
        bg.setTexture('letter_bg_active');

        this.tweens.add({
            targets: container,
            scale: 1.2,
            duration: 100,
            yoyo: true,
            repeat: 0
        });

        // Update Preview
        this.wordPreviewText.setText(this.currentWord);
        this.wordPreviewText.setVisible(true);
    }

    private updateLine(pointer: Phaser.Input.Pointer) {
        this.lineGraphics.clear();
        if (this.selectedLetters.length === 0) return;

        this.lineGraphics.lineStyle(10, 0xff6f00, 0.5);
        this.lineGraphics.beginPath();

        const first = this.selectedLetters[0];
        this.lineGraphics.moveTo(first.x, first.y);

        for (let i = 1; i < this.selectedLetters.length; i++) {
            const letter = this.selectedLetters[i];
            this.lineGraphics.lineTo(letter.x, letter.y);
        }

        // Line to pointer
        this.lineGraphics.lineTo(pointer.x, pointer.y);
        this.lineGraphics.strokePath();
    }

    private checkWord() {
         const word = this.currentWord;

         if (this.levelData.words.includes(word)) {
             // Target Word Found
             this.handleSuccess(true);
         } else if (this.levelData.extras.includes(word)) {
             // Extra Word Found
             this.handleSuccess(false);
         } else {
             // Invalid
             if (word.length > 0) {
                // Shake effect on the preview or letters?
                // Just shake camera slightly
                this.cameras.main.shake(100, 0.005);
             }
         }
    }

    private handleSuccess(isTarget: boolean) {
        if (isTarget) {
            this.score += 10;
            this.scoreText.setText(`${this.score}`);

            // Update Slots
            // Assuming the word matches the first slot for this simplified demo
            // In a real game we find *which* word it is.
            if (this.currentWord === this.levelData.words[0]) {
                for(let i = 0; i < this.currentWord.length; i++) {
                    const slot = this.currentWordSlots[i];
                    const bg = slot.list[0] as Phaser.GameObjects.Image;
                    const text = slot.list[1] as Phaser.GameObjects.Text;

                    bg.setTexture('slot_filled');
                    text.setText(this.currentWord[i]);

                    // Pop animation
                    slot.setScale(0);
                    this.tweens.add({
                        targets: slot,
                        scale: 1,
                        duration: 300,
                        delay: i * 50,
                        ease: 'Back.out'
                    });
                }
            }

            // Celebration
            this.createFloatingText(this.scale.width/2, this.scale.height/2, 'عالی!', 0x00ff00);

            // Next Level (Reset for demo)
            this.time.delayedCall(2000, () => {
                this.resetLevel();
            });

        } else {
            // Qandon
            this.qandonCount++;
            this.qandonCountText.setText(this.qandonCount.toString());

            // Fly animation
            const flyText = this.add.text(this.scale.width/2, this.scale.height - 150, this.currentWord, {
                 fontFamily: 'Arial', fontSize: '24px', color: '#ffeb3b', rtl: true
            }).setOrigin(0.5);

            this.tweens.add({
                targets: flyText,
                x: this.qandon.x,
                y: this.qandon.y,
                scale: 0.2,
                alpha: 0,
                duration: 800,
                onComplete: () => flyText.destroy()
            });
        }
    }

    private createFloatingText(x: number, y: number, message: string, color: number) {
        const text = this.add.text(x, y, message, {
            fontFamily: 'Arial', fontSize: '40px', color: '#' + color.toString(16), stroke: '#000000', strokeThickness: 4, rtl: true
        }).setOrigin(0.5);

        this.tweens.add({
            targets: text,
            y: y - 50,
            alpha: 0,
            duration: 1000,
            onComplete: () => text.destroy()
        });
    }

    private resetLevel() {
        // Clear slots
        this.currentWordSlots.forEach(slot => {
            (slot.list[0] as Phaser.GameObjects.Image).setTexture('slot_bg');
            (slot.list[1] as Phaser.GameObjects.Text).setText('');
        });
        this.shuffleLetters();
    }
}
