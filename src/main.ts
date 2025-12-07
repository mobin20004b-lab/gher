import Phaser from 'phaser';
import Preloader from './scenes/Preloader';
import GameScene from './scenes/GameScene';
import { AdminManager } from './admin/AdminManager';

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

const game = new Phaser.Game(config);

const adminManager = new AdminManager();
adminManager.setOnLevelDataChange((data) => {
    const gameScene = game.scene.getScene('game') as GameScene;
    if (gameScene) {
        gameScene.updateLevelData(data);
    }
});

export default game;
