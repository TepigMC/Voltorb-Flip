var VoltorbFlip;
(function (VoltorbFlip) {
    VoltorbFlip.game;
    VoltorbFlip.board;
    VoltorbFlip.keyManager;
    VoltorbFlip.BOARD_SIZE = 5;
    VoltorbFlip.CARD_SIZE = 24;
    VoltorbFlip.CARD_MARGIN = 8;
    function init() {
        VoltorbFlip.game = new Phaser.Game(256, 192, Phaser.AUTO, 'voltorb-flip-game', { preload: preload, create: create });
    }
    VoltorbFlip.init = init;
    function preload() {
        VoltorbFlip.game.load.baseURL = 'app/';
        VoltorbFlip.game.load.image('background', 'sprites/background.png');
        VoltorbFlip.game.load.spritesheet('cards', 'sprites/cards.png', 24, 24);
        VoltorbFlip.game.load.spritesheet('memos', 'sprites/memos.png', 24, 24);
        VoltorbFlip.game.load.spritesheet('cursor', 'sprites/cursor.png', 28, 28);
        VoltorbFlip.game.load.spritesheet('burst', 'sprites/burst_test.png', 64, 64);
        VoltorbFlip.game.load.spritesheet('explosion', 'sprites/explosion_test.png', 64, 64);
        VoltorbFlip.game.load.spritesheet('memo_toggle_button', 'sprites/memo_toggle_button.png', 56, 64);
        VoltorbFlip.game.load.spritesheet('quit_button', 'sprites/quit_button.png', 60, 26);
        VoltorbFlip.game.load.bitmapFont('board_numbers', 'fonts/board_numbers.png', 'fonts/board_numbers.xml');
        VoltorbFlip.game.stage.smoothed = false;
    }
    VoltorbFlip.preload = preload;
    function create() {
        VoltorbFlip.board = new VoltorbFlip.Board();
        VoltorbFlip.keyManager = new VoltorbFlip.KeyManager();
        VoltorbFlip.keyManager.addKey('SPACEBAR', function () { return VoltorbFlip.board.currentCard().flip(); }, this);
        VoltorbFlip.keyManager.addKey('UP', function () { return VoltorbFlip.board.cursor.moveUp(); }, this);
        VoltorbFlip.keyManager.addKey('DOWN', function () { return VoltorbFlip.board.cursor.moveDown(); }, this);
        VoltorbFlip.keyManager.addKey('LEFT', function () { return VoltorbFlip.board.cursor.moveLeft(); }, this);
        VoltorbFlip.keyManager.addKey('RIGHT', function () { return VoltorbFlip.board.cursor.moveRight(); }, this);
        VoltorbFlip.keyManager.addKey('A', function () { return VoltorbFlip.board.currentCard().toggleMemo(0); }, this);
        VoltorbFlip.keyManager.addKey('S', function () { return VoltorbFlip.board.currentCard().toggleMemo(1); }, this);
        VoltorbFlip.keyManager.addKeys(['D', 'Z'], function () { return VoltorbFlip.board.currentCard().toggleMemo(2); }, this);
        VoltorbFlip.keyManager.addKeys(['F', 'X'], function () { return VoltorbFlip.board.currentCard().toggleMemo(3); }, this);
    }
    VoltorbFlip.create = create;
})(VoltorbFlip || (VoltorbFlip = {}));
window.onload = function () {
    VoltorbFlip.init();
};
//# sourceMappingURL=app.js.map