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
        // Restart the scene to apply changes
        this.scene.restart();
    }

    create() {
        const { width, height } = this.scale;

        // Background
        this.add.tileSprite(0, 0, width, height, 'background').setOrigin(0, 0).setTint(0x555555);

        // Character Placeholder (Gherghhiz Khan)
        this.add.text(width / 2, 80, '(قرقیزخان)', {
            fontFamily: 'Arial', fontSize: '32px', color: '#ffffff', rtl: true
        }).setOrigin(0.5);

        // Score
        this.scoreText = this.add.text(20, 20, 'سکه: 0', {
            fontFamily: 'Arial', fontSize: '24px', color: '#ffd700', rtl: true
        });

        // Qandon (Sugar bowl)
        this.qandon = this.add.image(width - 40, height - 50, 'qandon');
        this.qandonCountText = this.add.text(width - 40, height - 50, '0', {
            fontFamily: 'Arial', fontSize: '16px', color: '#000000'
        }).setOrigin(0.5);

        // Target Slots for the word
        this.createTargetSlots(this.levelData.words[0].length);

        // Saucer
        this.saucer = this.add.image(width / 2, height - 150, 'saucer');

        // Shuffle Button
        const shuffleBtn = this.add.text(width / 2, height - 30, 'هم‌زدن', {
            fontFamily: 'Arial', fontSize: '20px', color: '#ffffff', backgroundColor: '#333333', padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive();

        shuffleBtn.on('pointerdown', () => this.shuffleLetters());

        // Setup Letters
        this.createLetters();
    }

    private createTargetSlots(length: number) {
        const { width, height } = this.scale;
        const startX = width / 2 - ((length - 1) * 25);
        const y = height / 2 - 50;

        // Clear existing
        this.currentWordSlots.forEach(s => s.destroy());
        this.currentWordSlots = [];

        for(let i = 0; i < length; i++) {
            const container = this.add.container(startX + i * 50, y);
            const bg = this.add.image(0, 0, 'slot_bg');
            const text = this.add.text(0, 0, '', {
                fontFamily: 'Arial', fontSize: '30px', color: '#ffffff'
            }).setOrigin(0.5);

            container.add([bg, text]);
            this.currentWordSlots.push(container);
        }
    }

    private createLetters() {
        const { width, height } = this.scale;
        const centerX = width / 2;
        const centerY = height - 150;
        const radius = 40;

        // Clear if existing
        this.letters.forEach(l => l.destroy());
        this.letters = [];

        this.levelData.letters.forEach((char, index) => {
            const container = this.add.container(0, 0); // Position set in shuffle
            const bg = this.add.image(0, 0, 'letter_bg');
            const text = this.add.text(0, 0, char, {
                fontFamily: 'Arial', fontSize: '24px', color: '#000000'
            }).setOrigin(0.5);

            container.add([bg, text]);
            container.setSize(40, 40);

            // Interaction
            container.setInteractive(new Phaser.Geom.Circle(0, 0, 20), Phaser.Geom.Circle.Contains);

            // Dragging (Just visual for now, snaps back)
            this.input.setDraggable(container);

            container.on('pointerdown', () => {
                this.handleLetterClick(container, char);
            });

            this.letters.push(container);
        });

        this.shuffleLetters();

        this.input.on('drag', (pointer: any, gameObject: any, dragX: number, dragY: number) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', (pointer: any, gameObject: any) => {
             // Snap back to saucer position
             const originX = gameObject.getData('originX');
             const originY = gameObject.getData('originY');

             this.tweens.add({
                targets: gameObject,
                x: originX,
                y: originY,
                duration: 200,
                ease: 'Back.out'
             });
        });
    }

    private shuffleLetters() {
        const { width, height } = this.scale;
        const centerX = width / 2;
        const centerY = height - 150;
        const radius = 40;

        // Shuffle the letters array randomly
        const shuffled = Phaser.Utils.Array.Shuffle([...this.letters]);

        shuffled.forEach((letter, index) => {
             const angle = (index / shuffled.length) * Math.PI * 2;
             const x = centerX + Math.cos(angle) * radius;
             const y = centerY + Math.sin(angle) * radius;

             this.tweens.add({
                 targets: letter,
                 x: x,
                 y: y,
                 duration: 300,
                 ease: 'Back.out'
             });

             // Reset visual state
             (letter.first as Phaser.GameObjects.Image).clearTint();
        });

        // Reset word
        this.currentWord = '';
        this.updateWordDisplay();
    }

    private handleLetterClick(letterContainer: Phaser.GameObjects.Container, char: string) {
        const bg = letterContainer.first as Phaser.GameObjects.Image;

        // Check if already selected (simple toggle for now, or just append)
        // For this prototype, we just append. If full, we verify.

        if (this.currentWord.length < this.currentWordSlots.length) {
            bg.setTint(0x00ff00);
            this.currentWord += char;
            this.updateWordDisplay();

            // Check word if full or partial check?
            // Usually games check when word is valid or user submits.
            // Here we check if it matches target length or is a valid short word?
            // Let's check on every input if it matches ANY valid word (target or extra)

            this.checkWord();
        }
    }

    private updateWordDisplay() {
        // Clear all slots
        this.currentWordSlots.forEach(slot => {
             (slot.list[1] as Phaser.GameObjects.Text).setText('');
        });

        // Fill slots (RTL handling - actually for Persian we type normally but display might need care)
        // Since we append char by char, index 0 is first char.
        for(let i = 0; i < this.currentWord.length; i++) {
            if (this.currentWordSlots[i]) {
                (this.currentWordSlots[i].list[1] as Phaser.GameObjects.Text).setText(this.currentWord[i]);
            }
        }
    }

    private checkWord() {
         const word = this.currentWord;

         if (this.levelData.words.includes(word)) {
             // Target Word Found
             this.handleSuccess(true);
         } else if (this.levelData.extras.includes(word)) {
             // Extra Word Found (Qandon)
             this.handleSuccess(false);
         } else if (word.length >= this.currentWordSlots.length) {
             // Wrong word and full
             this.cameras.main.shake(200, 0.01);
             this.time.delayedCall(500, () => {
                 this.shuffleLetters(); // Reset
             });
         }
    }

    private handleSuccess(isTarget: boolean) {
        if (isTarget) {
            this.score += 10;
            this.scoreText.setText(`سکه: ${this.score}`);

            // Win animation
            const winText = this.add.text(this.scale.width/2, this.scale.height/2, 'باریکلا!', {
                 fontFamily: 'Arial', fontSize: '40px', color: '#00ff00', rtl: true
            }).setOrigin(0.5);

            this.tweens.add({
                targets: winText,
                y: winText.y - 50,
                alpha: 0,
                duration: 1000,
                onComplete: () => winText.destroy()
            });

            // "Next Level" (Reset for demo)
            this.time.delayedCall(1500, () => {
                this.shuffleLetters();
            });

        } else {
            // Qandon
            this.qandonCount++;
            this.qandonCountText.setText(this.qandonCount.toString());

            const extraText = this.add.text(this.scale.width/2, this.scale.height/2, 'نوش جان!', {
                 fontFamily: 'Arial', fontSize: '30px', color: '#ffff00', rtl: true
            }).setOrigin(0.5);

             this.tweens.add({
                targets: extraText,
                x: this.qandon.x,
                y: this.qandon.y,
                scale: 0.2,
                alpha: 0,
                duration: 800,
                onComplete: () => extraText.destroy()
            });

            // Reset but keep playing
             this.time.delayedCall(500, () => {
                this.shuffleLetters();
            });
        }
    }
}
