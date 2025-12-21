import Phaser from 'phaser';

export default class Button extends Phaser.GameObjects.Container {
    private background: Phaser.GameObjects.Rectangle | Phaser.GameObjects.Sprite | Phaser.GameObjects.Image;
    private label: Phaser.GameObjects.Text;
    private onClick: () => void;
    private isFocused: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, text: string, onClick: () => void, width: number = 200, height: number = 60) {
        super(scene, x, y);
        this.onClick = onClick;

        // Background
        // Default to a simple rectangle if no texture is provided (can be enhanced later)
        this.background = scene.add.rectangle(0, 0, width, height, 0xef5350);
        this.background.setInteractive({ useHandCursor: true });
        this.add(this.background);

        // Text
        this.label = scene.add.text(0, 0, text, {
            fontFamily: 'Vazirmatn',
            fontSize: '24px',
            color: '#ffffff'
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
            this.background.setFillStyle(0xff7043);
        } else {
            this.background.setTint(0xdddddd);
        }
    }

    private handlePointerOut() {
        if (this.background instanceof Phaser.GameObjects.Rectangle) {
            this.background.setFillStyle(0xef5350);
        } else {
            this.background.clearTint();
        }
        this.setScale(1);
    }

    // Accessibility / Keyboard support
    public setFocus(focused: boolean) {
        this.isFocused = focused;
        if (this.background instanceof Phaser.GameObjects.Rectangle) {
             this.background.setStrokeStyle(focused ? 4 : 0, 0xffffff);
        }
    }

    public trigger() {
        this.handlePointerDown();
    }
}
