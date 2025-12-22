import Phaser from 'phaser';

export interface ButtonConfig {
    width?: number;
    height?: number;
    backgroundColor?: number;
    hoverColor?: number;
    textColor?: string;
    fontSize?: string;
    fontFamily?: string;
    texture?: string; // If provided, use an image instead of rectangle
}

export default class Button extends Phaser.GameObjects.Container {
    private background: Phaser.GameObjects.Rectangle | Phaser.GameObjects.Sprite | Phaser.GameObjects.Image;
    private label: Phaser.GameObjects.Text;
    private onClick: () => void;
    private isFocused: boolean = false;
    private config: ButtonConfig;

    constructor(scene: Phaser.Scene, x: number, y: number, text: string, onClick: () => void, config: ButtonConfig = {}) {
        super(scene, x, y);
        this.onClick = onClick;
        this.config = config;

        const width = config.width ?? 200;
        const height = config.height ?? 60;
        const bgColor = config.backgroundColor ?? 0xef5350;

        // Background
        if (config.texture) {
            this.background = scene.add.image(0, 0, config.texture);
            this.background.setDisplaySize(width, height);
        } else {
            this.background = scene.add.rectangle(0, 0, width, height, bgColor);
        }

        this.background.setInteractive({ useHandCursor: true });
        this.add(this.background);

        // Text
        this.label = scene.add.text(0, 0, text, {
            fontFamily: config.fontFamily ?? 'Vazirmatn',
            fontSize: config.fontSize ?? '24px',
            color: config.textColor ?? '#ffffff'
        }).setOrigin(0.5);
        this.add(this.label);

        // Interaction
        this.background.on('pointerdown', this.handlePointerDown, this);
        this.background.on('pointerover', this.handlePointerOver, this);
        this.background.on('pointerout', this.handlePointerOut, this);
        this.background.on('pointerup', this.handlePointerUp, this);

        this.scene.add.existing(this);
    }

    private handlePointerDown() {
        this.scene.tweens.add({
            targets: this,
            scaleX: 0.95,
            scaleY: 0.95,
            duration: 100,
            yoyo: true
        });
        this.onClick();
    }

    private handlePointerUp() {
        // Reset scale just in case
        this.setScale(1);
    }

    private handlePointerOver() {
        if (this.background instanceof Phaser.GameObjects.Rectangle) {
            const hoverColor = this.config.hoverColor ?? 0xff7043; // Default hover for red
            this.background.setFillStyle(hoverColor);
        } else {
            this.background.setTint(0xdddddd);
        }
    }

    private handlePointerOut() {
        if (this.background instanceof Phaser.GameObjects.Rectangle) {
             const bgColor = this.config.backgroundColor ?? 0xef5350;
            this.background.setFillStyle(bgColor);
        } else {
            // Restore focus tint if focused, otherwise clear tint
            if (this.isFocused) {
                this.background.setTint(0xcccccc);
            } else {
                this.background.clearTint();
            }
        }
        this.setScale(1);
    }

    // Accessibility / Keyboard support
    public setFocus(focused: boolean) {
        this.isFocused = focused;
        if (this.background instanceof Phaser.GameObjects.Rectangle) {
             this.background.setStrokeStyle(focused ? 4 : 0, 0xffffff);
        } else {
            if (focused) {
                this.background.setTint(0xcccccc);
            } else {
                this.background.clearTint();
            }
        }
    }

    public trigger() {
        this.handlePointerDown();
    }
}
