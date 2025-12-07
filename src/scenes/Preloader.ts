import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader');
    }

    preload() {
        // Here we would load images, audio, etc.
        // For now, we will generate textures in the create method of GameScene or here.
        // Let's create some placeholder graphics to use as textures.

        const graphics = this.make.graphics({ x: 0, y: 0 });

        // Background texture
        graphics.fillStyle(0xd4af37, 1); // Gold/Tea colorish
        graphics.fillRect(0, 0, 32, 32);
        graphics.generateTexture('background', 32, 32);
        graphics.clear();

        // Saucer texture (Circle)
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(60, 60, 60);
        graphics.generateTexture('saucer', 120, 120);
        graphics.clear();

        // Tea glass texture (Simple rect for now)
        graphics.fillStyle(0xaa0000, 0.5);
        graphics.fillRect(0, 0, 40, 60);
        graphics.generateTexture('glass', 40, 60);
        graphics.clear();

        // Letter tile texture (Circle)
        graphics.fillStyle(0xf0e68c, 1); // Khaki
        graphics.fillCircle(20, 20, 20);
        graphics.generateTexture('letter_bg', 40, 40);
        graphics.clear();

        // Qandon (Sugar bowl)
        graphics.fillStyle(0xffffff, 1);
        graphics.fillEllipse(30, 30, 60, 40);
        graphics.generateTexture('qandon', 60, 40);
        graphics.clear();

        // Slot background
        graphics.lineStyle(2, 0xffffff, 1);
        graphics.strokeRect(0, 0, 40, 40);
        graphics.generateTexture('slot_bg', 40, 40);
        graphics.clear();
    }

    create() {
        this.scene.start('game');
    }
}
