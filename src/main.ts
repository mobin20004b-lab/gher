import Phaser from 'phaser';
import Preloader from './scenes/Preloader';
import GameScene from './scenes/GameScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 360, // Mobile portrait width
    height: 640,
    parent: 'app',
    backgroundColor: '#3b3b3b', // Fallback color
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    scene: [Preloader, GameScene]
};

export default new Phaser.Game(config);
