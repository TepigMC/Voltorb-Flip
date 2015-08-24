var VoltorbFlip;
(function (VoltorbFlip) {
    VoltorbFlip.game;
    VoltorbFlip.board;
    VoltorbFlip.keyManager;
    VoltorbFlip.BOARD_SIZE = 5;
    VoltorbFlip.CARD_SIZE = 24;
    VoltorbFlip.CARD_MARGIN = 8;
    function init() {
        VoltorbFlip.game = new Phaser.Game(256, 192, Phaser.AUTO, 'content', { preload: preload, create: create });
    }
    VoltorbFlip.init = init;
    function preload() {
        VoltorbFlip.game.load.image('background', 'sprites/background.png');
        VoltorbFlip.game.load.spritesheet('cards', 'sprites/cards.png', 24, 24);
        VoltorbFlip.game.load.spritesheet('memos', 'sprites/memos.png', 24, 24);
        VoltorbFlip.game.load.spritesheet('cursor', 'sprites/cursor.png', 28, 28);
        VoltorbFlip.game.load.bitmapFont('board_numbers', 'fonts/board_numbers.png', 'fonts/board_numbers.xml');
        VoltorbFlip.game.stage.smoothed = false;
    }
    VoltorbFlip.preload = preload;
    function create() {
        VoltorbFlip.board = new Board();
        VoltorbFlip.keyManager = new KeyManager();
        VoltorbFlip.keyManager.addKey('UP', function () { return VoltorbFlip.board.cursor.moveUp(); }, this);
        VoltorbFlip.keyManager.addKey('DOWN', function () { return VoltorbFlip.board.cursor.moveDown(); }, this);
        VoltorbFlip.keyManager.addKey('LEFT', function () { return VoltorbFlip.board.cursor.moveLeft(); }, this);
        VoltorbFlip.keyManager.addKey('RIGHT', function () { return VoltorbFlip.board.cursor.moveRight(); }, this);
        VoltorbFlip.keyManager.addKey('A', function () { return VoltorbFlip.board.currentCard().toggleMemo(0); }, this);
        VoltorbFlip.keyManager.addKey('S', function () { return VoltorbFlip.board.currentCard().toggleMemo(1); }, this);
        VoltorbFlip.keyManager.addKeys(['D', 'Z'], function () { return VoltorbFlip.board.currentCard().toggleMemo(2); }, this);
        VoltorbFlip.keyManager.addKeys(['F', 'X'], function () { return VoltorbFlip.board.currentCard().toggleMemo(3); }, this);
        VoltorbFlip.keyManager.addKey('SPACEBAR', function () { return VoltorbFlip.board.currentCard().flip(); }, this);
    }
    VoltorbFlip.create = create;
    var Board = (function () {
        function Board() {
            this.background = VoltorbFlip.game.add.sprite(0, 0, 'background');
            this.cards = this.generateCards(3);
            this.cursor = new Cursor(0, 0);
            this.calculateTotals();
        }
        Board.prototype.currentCard = function () {
            return this.cards[this.cursor.row][this.cursor.col];
        };
        Board.prototype.generateCards = function (value) {
            var cards = [];
            for (var i = 0; i < VoltorbFlip.BOARD_SIZE; i++) {
                var row = [];
                for (var j = 0; j < VoltorbFlip.BOARD_SIZE; j++) {
                    row.push(new Card(i, j, value));
                }
                cards.push(row);
            }
            return cards;
        };
        Board.prototype.calculateTotals = function () {
            var rows = [];
            var cols = [];
            for (var i = 0; i < VoltorbFlip.BOARD_SIZE; i++) {
                var rowCoins = 0, rowVoltorbs = 0;
                var colCoins = 0, colVoltorbs = 0;
                for (var j = 0; j < VoltorbFlip.BOARD_SIZE; j++) {
                    rowCoins += this.cards[i][j].value;
                    colCoins += this.cards[j][i].value;
                    if (this.cards[i][j].value === 0) {
                        rowVoltorbs++;
                    }
                    if (this.cards[j][i].value === 0) {
                        colVoltorbs++;
                    }
                }
                rows.push(new HintText(i, VoltorbFlip.BOARD_SIZE, rowCoins, rowVoltorbs));
                cols.push(new HintText(VoltorbFlip.BOARD_SIZE, i, colCoins, colVoltorbs));
            }
            this.rows = rows;
            this.cols = cols;
        };
        return Board;
    })();
    VoltorbFlip.Board = Board;
    var HintText = (function () {
        function HintText(row, col, coins, voltorbs) {
            this.coins = coins;
            this.voltorbs = voltorbs;
            this.coinText = VoltorbFlip.game.add.bitmapText(Card.position(col) - 3, Card.position(row) - 12, 'board_numbers', ('00' + coins).slice(-2), 32);
            this.voltorbText = VoltorbFlip.game.add.bitmapText(Card.position(col) + 5, Card.position(row) + 1, 'board_numbers', voltorbs.toString(), 32);
        }
        HintText.prototype.setCoins = function (coins) {
            this.coins = coins;
            this.coinText.text = ('00' + coins).slice(-2);
        };
        HintText.prototype.setVoltorbs = function (voltorbs) {
            this.voltorbs = voltorbs;
            this.voltorbText.text = voltorbs.toString();
        };
        return HintText;
    })();
    VoltorbFlip.HintText = HintText;
    var Card = (function () {
        function Card(row, col, value) {
            this.row = row;
            this.col = col;
            this.value = value;
            this.flipped = false;
            this.sprite = VoltorbFlip.game.add.sprite(Card.position(col), Card.position(row), 'cards', 0);
            this.sprite.anchor.setTo(.5);
            this.sprite.inputEnabled = true;
            this.sprite.events.onInputDown.add(this.onClick, this);
            this.memos = [];
            this.memos[0] = new Memo(row, col, 0);
            this.memos[1] = new Memo(row, col, 1);
            this.memos[2] = new Memo(row, col, 2);
            this.memos[3] = new Memo(row, col, 3);
        }
        Card.prototype.flip = function () {
            this.flipped = true;
            this.sprite.frame = this.value + 1;
            this.memos.map(function (memo) { return memo.setVisible(false); });
        };
        Card.prototype.toggleMemo = function (id) {
            if (this.flipped === false) {
                this.memos[id].toggle();
            }
        };
        Card.position = function (pos) {
            return pos * (VoltorbFlip.CARD_SIZE + VoltorbFlip.CARD_MARGIN) + VoltorbFlip.CARD_MARGIN + VoltorbFlip.CARD_SIZE / 2;
        };
        Card.prototype.onClick = function () {
            this.flip();
            VoltorbFlip.board.cursor.move(this.row, this.col);
        };
        return Card;
    })();
    VoltorbFlip.Card = Card;
    var Memo = (function () {
        function Memo(row, col, id) {
            this.id = id;
            this.visible = false;
            this.sprite = VoltorbFlip.game.add.sprite(Card.position(col), Card.position(row), 'memos', id);
            this.sprite.anchor.setTo(.5);
            this.sprite.visible = false;
        }
        Memo.prototype.setVisible = function (visible) {
            this.visible = visible;
            this.sprite.visible = visible;
        };
        Memo.prototype.toggle = function () {
            this.setVisible(!this.visible);
        };
        return Memo;
    })();
    VoltorbFlip.Memo = Memo;
    var Cursor = (function () {
        function Cursor(row, col) {
            this.sprite = VoltorbFlip.game.add.sprite(0, 0, 'cursor', 0);
            this.sprite.anchor.setTo(.5);
            this.move(row, col);
        }
        Cursor.prototype.move = function (row, col) {
            row = (row < 0 ? VoltorbFlip.BOARD_SIZE - 1 : (row >= VoltorbFlip.BOARD_SIZE ? 0 : row));
            col = (col < 0 ? VoltorbFlip.BOARD_SIZE - 1 : (col >= VoltorbFlip.BOARD_SIZE ? 0 : col));
            this.row = row;
            this.col = col;
            this.sprite.x = Card.position(col);
            this.sprite.y = Card.position(row);
        };
        Cursor.prototype.moveUp = function () { this.moveRelative(-1, 0); };
        Cursor.prototype.moveDown = function () { this.moveRelative(1, 0); };
        Cursor.prototype.moveLeft = function () { this.moveRelative(0, -1); };
        Cursor.prototype.moveRight = function () { this.moveRelative(0, 1); };
        Cursor.prototype.moveRelative = function (row, col) {
            this.move(this.row + row, this.col + col);
        };
        return Cursor;
    })();
    VoltorbFlip.Cursor = Cursor;
    var KeyManager = (function () {
        function KeyManager() {
            this.keys = {};
        }
        KeyManager.prototype.addKey = function (keyName, callback, context) {
            var key = VoltorbFlip.game.input.keyboard.addKey(Phaser.Keyboard[keyName]);
            key.onDown.add(callback, context);
            this.keys[keyName] = key;
        };
        KeyManager.prototype.addKeys = function (keyNames, callback, context) {
            for (var _i = 0; _i < keyNames.length; _i++) {
                var keyName = keyNames[_i];
                this.addKey(keyName, callback, context);
            }
        };
        return KeyManager;
    })();
    VoltorbFlip.KeyManager = KeyManager;
})(VoltorbFlip || (VoltorbFlip = {}));
window.onload = function () {
    VoltorbFlip.init();
};
//# sourceMappingURL=app.js.map