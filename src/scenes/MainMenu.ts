import Phaser from 'phaser';

export default class MainMenu extends Phaser.Scene {
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
        const titleText = this.add.text(width / 2, height * 0.3, 'قهوه‌خانه قرقیزخان', {
            fontFamily: 'Vazirmatn',
            fontSize: '48px',
            color: '#ffffff',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Start Button Container
        const buttonY = height * 0.6;
        const button = this.add.container(width / 2, buttonY);

        // Button Background
        const btnBg = this.add.rectangle(0, 0, 200, 60, 0xef5350)
            .setInteractive({ useHandCursor: true });

        // Button Text
        const btnText = this.add.text(0, 0, 'شروع بازی', {
            fontFamily: 'Vazirmatn',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        button.add([btnBg, btnText]);

        // Interaction
        btnBg.on('pointerdown', () => {
            this.scene.start('game');
        });

        // Hover effects
        btnBg.on('pointerover', () => {
            btnBg.setFillStyle(0xff7043);
        });

        btnBg.on('pointerout', () => {
            btnBg.setFillStyle(0xef5350);
        });

        // Keyboard Interaction
        if (this.input.keyboard) {
            const enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
            enterKey.on('down', () => {
                this.scene.start('game');
            });

            // Space key as alternative
            const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
            spaceKey.on('down', () => {
                this.scene.start('game');
            });
        }
    }
}
