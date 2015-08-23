var VoltorbFlip;
(function (VoltorbFlip) {
    VoltorbFlip.game;
    VoltorbFlip.board;
    VoltorbFlip.keys;
    VoltorbFlip.BOARD_SIZE = 5;
    VoltorbFlip.CARD_SIZE = 24;
    VoltorbFlip.CARD_MARGIN = 8;
    VoltorbFlip.ROW = 0;
    VoltorbFlip.COL = 1;
    function init() {
        VoltorbFlip.game = new Phaser.Game(256, 192, Phaser.AUTO, 'content', { preload: preload, create: create });
    }
    VoltorbFlip.init = init;
    function preload() {
        VoltorbFlip.game.load.image('background', 'sprites/background.png');
        VoltorbFlip.game.load.spritesheet('cards', 'sprites/cards.png', 24, 24);
        VoltorbFlip.game.load.spritesheet('cursor', 'sprites/cursor.png', 28, 28);
        VoltorbFlip.game.load.bitmapFont('board_numbers', 'fonts/board_numbers.png', 'fonts/board_numbers.xml');
        VoltorbFlip.game.stage.smoothed = false;
    }
    VoltorbFlip.preload = preload;
    function create() {
        VoltorbFlip.board = new Board();
        VoltorbFlip.keys = [];
        addKey('UP', function () { return VoltorbFlip.board.cursor.moveUp(); }, this);
        addKey('DOWN', function () { return VoltorbFlip.board.cursor.moveDown(); }, this);
        addKey('LEFT', function () { return VoltorbFlip.board.cursor.moveLeft(); }, this);
        addKey('RIGHT', function () { return VoltorbFlip.board.cursor.moveRight(); }, this);
        addKey('SPACEBAR', function () { return VoltorbFlip.board.cursor.flipCard(); }, this);
    }
    VoltorbFlip.create = create;
    function addKey(keyName, callback, context) {
        var key = VoltorbFlip.game.input.keyboard.addKey(Phaser.Keyboard[keyName]);
        key.onDown.add(callback, context);
        VoltorbFlip.keys[keyName] = key;
    }
    VoltorbFlip.addKey = addKey;
    var Board = (function () {
        function Board() {
            this.background = VoltorbFlip.game.add.sprite(0, 0, 'background');
            this.cards = this.generateCards(3);
            this.cursor = new Cursor(0, 0);
            this.calculateTotals();
        }
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
            this.coinText = VoltorbFlip.game.add.bitmapText(cardPos(col) - 3, cardPos(row) - 12, 'board_numbers', ('00' + coins).slice(-2), 32);
            this.voltorbText = VoltorbFlip.game.add.bitmapText(cardPos(col) + 5, cardPos(row) + 1, 'board_numbers', voltorbs.toString(), 32);
        }
        return HintText;
    })();
    VoltorbFlip.HintText = HintText;
    var Card = (function () {
        function Card(row, col, value) {
            this.sprite = VoltorbFlip.game.add.sprite(cardPos(col), cardPos(row), 'cards', 0);
            this.sprite.anchor.setTo(.5);
            this.sprite.inputEnabled = true;
            this.sprite.events.onInputDown.add(this.onClick, this);
            this.row = row;
            this.col = col;
            this.value = value;
        }
        Card.prototype.flip = function () {
            this.sprite.frame = this.value + 1;
        };
        Card.prototype.onClick = function () {
            this.flip();
            VoltorbFlip.board.cursor.move(this.row, this.col);
        };
        return Card;
    })();
    VoltorbFlip.Card = Card;
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
            this.sprite.x = cardPos(col);
            this.sprite.y = cardPos(row);
        };
        Cursor.prototype.moveUp = function () { this.moveRelative(-1, 0); };
        Cursor.prototype.moveDown = function () { this.moveRelative(1, 0); };
        Cursor.prototype.moveLeft = function () { this.moveRelative(0, -1); };
        Cursor.prototype.moveRight = function () { this.moveRelative(0, 1); };
        Cursor.prototype.flipCard = function () {
            VoltorbFlip.board.cards[this.row][this.col].flip();
        };
        Cursor.prototype.moveRelative = function (row, col) {
            this.move(this.row + row, this.col + col);
        };
        return Cursor;
    })();
    VoltorbFlip.Cursor = Cursor;
    function cardPos(pos) {
        return pos * (VoltorbFlip.CARD_SIZE + VoltorbFlip.CARD_MARGIN) + VoltorbFlip.CARD_MARGIN + VoltorbFlip.CARD_SIZE / 2;
    }
    VoltorbFlip.cardPos = cardPos;
})(VoltorbFlip || (VoltorbFlip = {}));
window.onload = function () {
    VoltorbFlip.init();
};
//# sourceMappingURL=app.js.map