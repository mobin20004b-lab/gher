import Phaser from 'phaser';
import Button from '../ui/Button';

export default class MainMenu extends Phaser.Scene {
    private startBtn!: Button;

    constructor() {
        super('main-menu');
    }

    create() {
        const { width, height } = this.scale;

        // Background
        this.add.image(width / 2, height / 2, 'bg_gradient')
            .setDisplaySize(width, height);

        this.add.tileSprite(width / 2, height / 2, width, height, 'bg_pattern')
            .setAlpha(0.1);

        // Title
        this.add.text(width / 2, height * 0.3, 'قهوه‌خانه قرقیزخان', {
            fontFamily: 'Vazirmatn',
            fontSize: '48px',
            color: '#ffffff',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Start Button using Reusable Component
        const buttonY = height * 0.6;
        this.startBtn = new Button(this, width / 2, buttonY, 'شروع بازی', () => {
            this.scene.start('game');
        });

        // Set initial focus for accessibility
        this.startBtn.setFocus(true);

        // Keyboard Interaction
        if (this.input.keyboard) {
            const enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
            enterKey.on('down', () => {
                this.startBtn.trigger();
            });

            // Space key as alternative
            const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
            spaceKey.on('down', () => {
                this.startBtn.trigger();
            });
        }
    }
}
