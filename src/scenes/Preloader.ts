import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader');
    }

    preload() {
        const graphics = this.make.graphics({ x: 0, y: 0 });

        // --- Background Gradient ---
        graphics.clear();
        graphics.fillGradientStyle(0x5d4037, 0x5d4037, 0x3e2723, 0x3e2723, 1);
        graphics.fillRect(0, 0, 1, 512);
        graphics.generateTexture('bg_gradient', 1, 512);

        // --- Background Pattern (Faint Diamonds) ---
        // Optimization: Generate a small tileable texture instead of a full-screen one.
        // The pattern repeats every 40px. An "X" in a 40x40 box tiles to form the diamond grid.
        graphics.clear();
        graphics.lineStyle(1, 0xffffff, 0.05);
        graphics.beginPath();

        // Diagonal 1: y = x (Top-Left to Bottom-Right)
        graphics.moveTo(0, 0);
        graphics.lineTo(40, 40);

        // Diagonal 2: y = -x + 40 (Bottom-Left to Top-Right)
        graphics.moveTo(0, 40);
        graphics.lineTo(40, 0);

        graphics.strokePath();
        graphics.generateTexture('bg_pattern', 40, 40);

        // --- Saucer (Tray) ---
        graphics.clear();
        // Outer rim
        graphics.fillStyle(0x8d6e63, 1);
        graphics.fillCircle(120, 120, 120);
        // Inner rim
        graphics.fillStyle(0x6d4c41, 1);
        graphics.fillCircle(120, 120, 110);
        // Wood grain details (rings)
        graphics.lineStyle(2, 0x5d4037, 0.5);
        graphics.strokeCircle(120, 120, 100);
        graphics.strokeCircle(120, 120, 80);
        graphics.strokeCircle(120, 120, 60);
        // Center
        graphics.fillStyle(0x795548, 1);
        graphics.fillCircle(120, 120, 40);

        graphics.generateTexture('saucer', 240, 240);

        // --- Letter Tile (Cookie) ---
        graphics.clear();
        const tileSize = 60;
        const radius = 28;

        // Shadow (offset)
        graphics.fillStyle(0x000000, 0.3);
        graphics.fillCircle(30 + 3, 30 + 3, radius);

        // Main body
        graphics.fillStyle(0xffecb3, 1); // Light cookie color
        graphics.fillCircle(30, 30, radius);

        // Highlight (Bevel)
        graphics.lineStyle(2, 0xffffff, 0.5);
        graphics.strokeCircle(30, 30, radius - 2);

        graphics.generateTexture('letter_bg', 64, 64);

        // --- Letter Selected (Active) ---
        graphics.clear();
        graphics.fillStyle(0xffca28, 1); // Darker/Golden cookie
        graphics.fillCircle(30, 30, radius);
        graphics.lineStyle(3, 0xff6f00, 1);
        graphics.strokeCircle(30, 30, radius);
        graphics.generateTexture('letter_bg_active', 64, 64);

        // --- Slot Background ---
        graphics.clear();
        graphics.fillStyle(0x000000, 0.3);
        graphics.fillRoundedRect(0, 0, 50, 50, 10);
        graphics.lineStyle(2, 0x8d6e63, 0.8);
        graphics.strokeRoundedRect(0, 0, 50, 50, 10);
        graphics.generateTexture('slot_bg', 52, 52);

        // --- Slot Filled ---
        graphics.clear();
        graphics.fillStyle(0xffecb3, 1);
        graphics.fillRoundedRect(0, 0, 50, 50, 10);
        graphics.generateTexture('slot_filled', 52, 52);

        // --- Qandon (Sugar Bowl) ---
        graphics.clear();
        // Bowl body
        graphics.fillStyle(0xe0f7fa, 0.9); // Glass/Porcelain
        graphics.fillEllipse(40, 40, 80, 60);
        // Lid
        graphics.fillStyle(0xb2ebf2, 1);
        graphics.fillEllipse(40, 25, 60, 20);
        // Knob
        graphics.fillStyle(0x00bcd4, 1);
        graphics.fillCircle(40, 15, 8);
        graphics.generateTexture('qandon', 80, 80);

        // --- Shuffle Button ---
        graphics.clear();
        graphics.fillStyle(0xef5350, 1); // Red button
        graphics.fillCircle(30, 30, 30);
        graphics.lineStyle(3, 0xffffff, 1);
        graphics.strokeCircle(30, 30, 25);
        // Arrows icon
        graphics.lineStyle(3, 0xffffff, 1);
        graphics.beginPath();
        graphics.arc(30, 30, 15, Phaser.Math.DegToRad(45), Phaser.Math.DegToRad(315), false);
        graphics.strokePath();
        // Arrowhead
        graphics.fillStyle(0xffffff, 1);
        graphics.fillTriangle(45, 30, 40, 20, 50, 20); // Rough approximation
        graphics.generateTexture('btn_shuffle', 60, 60);

        // --- Character (Simple Avatar) ---
        graphics.clear();
        // Head
        graphics.fillStyle(0xffccbc, 1); // Skin
        graphics.fillCircle(50, 50, 40);
        // Hat (Fez/Turban style)
        graphics.fillStyle(0xd32f2f, 1);
        graphics.fillRoundedRect(20, 10, 60, 30, 5);
        // Eyes
        graphics.fillStyle(0x000000, 1);
        graphics.fillCircle(35, 45, 4);
        graphics.fillCircle(65, 45, 4);
        // Mustache
        graphics.fillStyle(0x3e2723, 1);
        graphics.fillEllipse(50, 65, 40, 10);
        graphics.generateTexture('character', 100, 100);

        // --- Panel/HUD Background ---
        graphics.clear();
        graphics.fillStyle(0x000000, 0.5);
        graphics.fillRoundedRect(0, 0, 120, 40, 20);
        graphics.generateTexture('panel_hud', 120, 40);

        graphics.destroy();
    }

    create() {
        this.scene.start('game');
    }
}
