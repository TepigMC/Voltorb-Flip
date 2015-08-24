namespace VoltorbFlip {
  export var game: Phaser.Game;
  export var board: Board;
  export var keyManager: KeyManager;

  export var BOARD_SIZE = 5;
  export var CARD_SIZE = 24;
  export var CARD_MARGIN = 8;

  export function init() {
    game = new Phaser.Game(256, 192, Phaser.AUTO, 'voltorb-flip-game', { preload: preload, create: create });
  }

  export function preload() {
    game.load.image('background', 'sprites/background.png');
    game.load.spritesheet('cards', 'sprites/cards.png', 24, 24);
    game.load.spritesheet('memos', 'sprites/memos.png', 24, 24);
    game.load.spritesheet('cursor', 'sprites/cursor.png', 28, 28);
    game.load.bitmapFont('board_numbers', 'fonts/board_numbers.png', 'fonts/board_numbers.xml');

    game.stage.smoothed = false;
  }

  export function create() {
    board = new Board();
    keyManager = new KeyManager();

    keyManager.addKey('UP', () => board.cursor.moveUp(), this);
    keyManager.addKey('DOWN', () => board.cursor.moveDown(), this);
    keyManager.addKey('LEFT', () => board.cursor.moveLeft(), this);
    keyManager.addKey('RIGHT', () => board.cursor.moveRight(), this);
    keyManager.addKey('A', () => board.currentCard().toggleMemo(0), this);
    keyManager.addKey('S', () => board.currentCard().toggleMemo(1), this);
    keyManager.addKeys(['D', 'Z'], () => board.currentCard().toggleMemo(2), this);
    keyManager.addKeys(['F', 'X'], () => board.currentCard().toggleMemo(3), this);
    keyManager.addKey('SPACEBAR', () => board.currentCard().flip(), this);
  }
}

window.onload = () => {
  VoltorbFlip.init();
};
