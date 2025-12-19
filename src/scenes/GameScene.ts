import Phaser from 'phaser';
import { LevelManager, WordCheckResult, LevelData } from '../logic/LevelManager';

export default class GameScene extends Phaser.Scene {
    private saucer!: Phaser.GameObjects.Image;
    private shuffleBtn!: Phaser.GameObjects.Image;
    private letters: Phaser.GameObjects.Container[] = [];
    private currentWord: string = '';
    private currentWordSlots: Phaser.GameObjects.Container[] = [];
    private scoreText!: Phaser.GameObjects.Text;
    private scoreBg!: Phaser.GameObjects.Image;
    private scoreLabel!: Phaser.GameObjects.Text;

    // Qandon related
    private qandon!: Phaser.GameObjects.Image;
    private qandonCountText!: Phaser.GameObjects.Text;

    // Character
    private character!: Phaser.GameObjects.Image;

    // Background
    private bgGradient!: Phaser.GameObjects.Image;
    private bgPattern!: Phaser.GameObjects.TileSprite;

    // Interaction
    private isDragging: boolean = false;
    private selectedLetters: Phaser.GameObjects.Container[] = [];
    private selectedLettersSet: Set<Phaser.GameObjects.Container> = new Set(); // Optimization: O(1) lookup
    private lineGraphics!: Phaser.GameObjects.Graphics;
    private wordPreviewText!: Phaser.GameObjects.Text;

    // Logic
    private levelManager!: LevelManager;

    // Particles
    private particleEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;

    constructor() {
        super('game');
    }

    init(data: any) {
        // If we have existing level data passed (e.g. from Admin update), use it.
        // Otherwise, initialize new LevelManager if it doesn't exist.

        if (!this.levelManager) {
            this.levelManager = new LevelManager();
        }

        // If data is passed in restart/start, use it to set level
        if (data && data.levelData) {
            this.levelManager.setLevelData(data.levelData);
        } else if (data && data.reset) {
            // Just reloading current level
            this.levelManager.loadLevel(this.levelManager.getCurrentLevelIndex());
        }
    }

    public updateLevelData(data: { letters: string[], words: string[], extras: string[] }) {
        const levelData: LevelData = {
            id: 999, // Custom ID for admin/dynamic levels
            letters: data.letters,
            words: data.words,
            extras: data.extras
        };
        // Restart scene with new data
        this.scene.restart({ levelData: levelData });
    }

    create() {
        const { width, height } = this.scale;

        // --- Background ---
        this.bgGradient = this.add.image(0, 0, 'bg_gradient').setOrigin(0, 0);
        this.bgGradient.setDisplaySize(width, height);

        this.bgPattern = this.add.tileSprite(0, 0, width, height, 'bg_pattern').setOrigin(0, 0);

        // --- HUD ---
        this.scoreBg = this.add.image(0, 0, 'panel_hud');
        this.scoreText = this.add.text(0, 0, this.levelManager.getScore().toString(), {
            fontFamily: 'Vazirmatn', fontSize: '24px', color: '#ffd700', rtl: true
        }).setOrigin(0.5);
        this.scoreLabel = this.add.text(0, 0, 'سکه', { fontFamily: 'Vazirmatn', fontSize: '12px', color: '#aaaaaa' }).setOrigin(0.5);

        // Qandon (Sugar bowl)
        this.qandon = this.add.image(0, 0, 'qandon').setScale(0.8);
        this.qandonCountText = this.add.text(0, 0, this.levelManager.getQandonCount().toString(), {
            fontFamily: 'Vazirmatn', fontSize: '16px', color: '#000000'
        }).setOrigin(0.5);

        // --- Character ---
        this.character = this.add.image(0, 0, 'character');

        // --- Saucer & Letters Area ---
        this.saucer = this.add.image(0, 0, 'saucer');

        // Shuffle Button (Center of saucer)
        this.shuffleBtn = this.add.image(0, 0, 'btn_shuffle').setInteractive();
        this.shuffleBtn.on('pointerdown', () => this.shuffleLetters());

        // Line Graphics
        this.lineGraphics = this.add.graphics();

        // Word Preview (floating above saucer)
        this.wordPreviewText = this.add.text(0, 0, '', {
            fontFamily: 'Vazirmatn', fontSize: '32px', color: '#ffffff',
            backgroundColor: '#00000088', padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setVisible(false);

        // --- Global Input Handling ---
        this.input.on('pointerup', this.handlePointerUp, this);
        this.input.on('pointermove', this.handlePointerMove, this);

        // --- Layout ---
        this.updateLayout();

        // --- Particles ---
        this.particleEmitter = this.add.particles(0, 0, 'particle', {
            lifespan: 800,
            speed: { min: 150, max: 350 },
            scale: { start: 0.6, end: 0 },
            gravityY: 150,
            emitting: false,
            blendMode: Phaser.BlendModes.ADD
        });

        // Listen for resize
        this.scale.on('resize', this.resize, this);
    }

    private resize(gameSize: Phaser.Structs.Size) {
        const width = gameSize.width;
        const height = gameSize.height;

        this.cameras.main.setViewport(0, 0, width, height);

        // Update background sizes
        this.bgGradient.setDisplaySize(width, height);
        this.bgPattern.setSize(width, height);

        this.updateLayout();
    }

    private updateLayout() {
        const { width, height } = this.scale;
        const isLandscape = width > height;

        // Position HUD
        if (isLandscape) {
            this.scoreBg.setPosition(80, 40);
            this.scoreText.setPosition(80, 40);
            this.scoreLabel.setPosition(80, 15);

            this.qandon.setPosition(width - 60, 50);
            this.qandonCountText.setPosition(width - 60, 55);
        } else {
            this.scoreBg.setPosition(70, 40);
            this.scoreText.setPosition(70, 40);
            this.scoreLabel.setPosition(70, 15);

            this.qandon.setPosition(width - 50, 40);
            this.qandonCountText.setPosition(width - 50, 45);
        }

        if (isLandscape) {
            const saucerX = width * 0.75;
            const saucerY = height * 0.6;
            this.saucer.setPosition(saucerX, saucerY);
            this.shuffleBtn.setPosition(saucerX, saucerY);
            this.wordPreviewText.setPosition(saucerX, saucerY - 140);

            this.character.setPosition(width * 0.25, height * 0.3);

            this.positionTargetSlots(width * 0.25, height * 0.6);
            this.repositionLetters(saucerX, saucerY);

        } else {
            const centerX = width / 2;
            const saucerY = height - 150;

            this.character.setPosition(centerX, 120);

            this.saucer.setPosition(centerX, saucerY);
            this.shuffleBtn.setPosition(centerX, saucerY);
            this.wordPreviewText.setPosition(centerX, saucerY - 140);

            this.positionTargetSlots(centerX, height / 2 - 20);
            this.repositionLetters(centerX, saucerY);
        }
    }

    private positionTargetSlots(centerX: number, centerY: number) {
        const levelData = this.levelManager.getCurrentLevelData();
        if (!levelData) return;

        const length = levelData.words[0].length;

        if (this.currentWordSlots.length === 0) {
            this.createTargetSlots(length, centerX, centerY);
        } else {
             const startX = centerX - ((length - 1) * 28);
             this.currentWordSlots.forEach((container, i) => {
                 container.setPosition(startX + i * 60, centerY);
             });
        }
    }

    private createTargetSlots(length: number, centerX: number, centerY: number) {
        const startX = centerX - ((length - 1) * 28);

        this.currentWordSlots.forEach(s => s.destroy());
        this.currentWordSlots = [];

        for(let i = 0; i < length; i++) {
            const container = this.add.container(startX + i * 60, centerY);

            const bg = this.add.image(0, 0, 'slot_bg');
            const text = this.add.text(0, 0, '', {
                fontFamily: 'Vazirmatn', fontSize: '30px', color: '#5d4037', fontStyle: 'bold'
            }).setOrigin(0.5);

            container.add([bg, text]);
            this.currentWordSlots.push(container);
        }
    }

    private repositionLetters(centerX: number, centerY: number) {
        if (this.letters.length === 0) {
            this.createLetters(centerX, centerY);
        } else {
             const radius = 80;
             this.letters.forEach((letter, index) => {
                 const angle = (index / this.letters.length) * Math.PI * 2 - (Math.PI / 2);
                 const x = centerX + Math.cos(angle) * radius;
                 const y = centerY + Math.sin(angle) * radius;
                 letter.setPosition(x, y);
             });
        }
    }

    private createLetters(centerX: number, centerY: number) {
        this.letters.forEach(l => l.destroy());
        this.letters = [];

        const levelData = this.levelManager.getCurrentLevelData();
        if (!levelData) return;

        levelData.letters.forEach((char, index) => {
            const container = this.add.container(0, 0);

            const bg = this.add.image(0, 0, 'letter_bg');

            const text = this.add.text(0, 0, char, {
                fontFamily: 'Vazirmatn', fontSize: '32px', color: '#5d4037', fontStyle: 'bold'
            }).setOrigin(0.5);

            container.add([bg, text]);
            container.setSize(60, 60);
            container.setData('defaultTexture', 'letter_bg');

            container.setInteractive(new Phaser.Geom.Circle(0, 0, 30), Phaser.Geom.Circle.Contains);
            container.on('pointerdown', () => this.handleLetterDown(container, char));

            this.letters.push(container);
        });

        this.shuffleLetters();
    }

    private shuffleLetters() {
        const { width, height } = this.scale;
        const isLandscape = width > height;

        let centerX, centerY;
        if (isLandscape) {
             centerX = width * 0.75;
             centerY = height * 0.6;
        } else {
             centerX = width / 2;
             centerY = height - 150;
        }

        const radius = 80;

        const shuffled = Phaser.Utils.Array.Shuffle([...this.letters]);

        shuffled.forEach((letter, index) => {
             const angle = (index / shuffled.length) * Math.PI * 2 - (Math.PI / 2);
             const x = centerX + Math.cos(angle) * radius;
             const y = centerY + Math.sin(angle) * radius;

             this.tweens.add({
                 targets: letter,
                 x: x,
                 y: y,
                 duration: 400,
                 ease: 'Back.out'
             });

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

        this.updateLine(pointer);

        this.letters.forEach(letter => {
            // Optimization: O(1) lookup instead of O(N) Array.includes()
            if (this.selectedLettersSet.has(letter)) return;

            const dx = pointer.x - letter.x;
            const dy = pointer.y - letter.y;
            // Squared distance check is already optimal
            if (dx*dx + dy*dy < 30*30) {
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

        this.checkWord();

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
        this.selectedLettersSet.clear(); // Clear the set
        this.currentWord = '';
    }

    private selectLetter(container: Phaser.GameObjects.Container, char: string) {
        this.selectedLetters.push(container);
        this.selectedLettersSet.add(container); // Add to set
        this.currentWord += char;

        const bg = container.first as Phaser.GameObjects.Image;
        bg.setTexture('letter_bg_active');

        this.tweens.add({
            targets: container,
            scale: 1.2,
            duration: 100,
            yoyo: true,
            repeat: 0
        });

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

        this.lineGraphics.lineTo(pointer.x, pointer.y);
        this.lineGraphics.strokePath();
    }

    private checkWord() {
         const word = this.currentWord;
         const result = this.levelManager.checkWord(word);

         switch (result) {
            case WordCheckResult.TARGET:
                this.handleSuccess(true);
                break;
            case WordCheckResult.EXTRA:
                this.handleSuccess(false);
                break;
            case WordCheckResult.ALREADY_FOUND:
                this.cameras.main.shake(100, 0.005);
                this.createFloatingText(this.saucer.x, this.saucer.y, 'قبلا پیدا شده', 0xffffff);
                break;
            case WordCheckResult.INVALID:
            default:
                if (word.length > 0) {
                    this.cameras.main.shake(100, 0.005);
                }
                break;
         }
    }

    private handleSuccess(isTarget: boolean) {
        if (isTarget) {
            this.scoreText.setText(`${this.levelManager.getScore()}`);

            // Burst particles at the target word location
            // We can approximate the center of the target word slots
            if (this.currentWordSlots.length > 0) {
                const firstSlot = this.currentWordSlots[0];
                const lastSlot = this.currentWordSlots[this.currentWordSlots.length - 1];
                const centerX = (firstSlot.x + lastSlot.x) / 2;
                const centerY = firstSlot.y;

                this.particleEmitter.explode(20, centerX, centerY);
            }

            const words = this.levelManager.getCurrentLevelData()?.words || [];
            if (words[0] === this.currentWord) {
                for(let i = 0; i < this.currentWord.length; i++) {
                    if (i < this.currentWordSlots.length) {
                        const slot = this.currentWordSlots[i];
                        const bg = slot.list[0] as Phaser.GameObjects.Image;
                        const text = slot.list[1] as Phaser.GameObjects.Text;

                        bg.setTexture('slot_filled');
                        text.setText(this.currentWord[i]);

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
            }

            this.createFloatingText(this.scale.width/2, this.scale.height/2, 'عالی!', 0x00ff00);

            if (this.levelManager.isLevelComplete()) {
                this.time.delayedCall(1000, () => {
                    this.createFloatingText(this.scale.width / 2, this.scale.height / 2, 'مرحله تمام شد!', 0x00ff00);
                });

                this.time.delayedCall(3000, () => {
                    if (this.levelManager.nextLevel()) {
                        this.scene.restart({ reset: true });
                    } else {
                        this.createFloatingText(this.scale.width / 2, this.scale.height / 2, 'پایان بازی!', 0xffd700);
                        this.time.delayedCall(3000, () => {
                            this.levelManager.loadLevel(0);
                            this.scene.restart({ reset: true });
                        });
                    }
                });
            }

        } else {
            // Qandon
            this.qandonCountText.setText(this.levelManager.getQandonCount().toString());

            // Burst particles at the Qandon
            this.particleEmitter.explode(10, this.qandon.x, this.qandon.y);

            const flyText = this.add.text(this.saucer.x, this.saucer.y, this.currentWord, {
                 fontFamily: 'Vazirmatn', fontSize: '24px', color: '#ffeb3b', rtl: true
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
            fontFamily: 'Vazirmatn', fontSize: '40px', color: '#' + color.toString(16), stroke: '#000000', strokeThickness: 4, rtl: true
        }).setOrigin(0.5);

        this.tweens.add({
            targets: text,
            y: y - 50,
            alpha: 0,
            duration: 1000,
            onComplete: () => text.destroy()
        });
    }

    private resetLevelVisuals() {
        // Clear slots
        this.currentWordSlots.forEach(slot => {
            (slot.list[0] as Phaser.GameObjects.Image).setTexture('slot_bg');
            (slot.list[1] as Phaser.GameObjects.Text).setText('');
        });
        this.shuffleLetters();
    }
}
