var VoltorbFlip = (function () {
    function VoltorbFlip() {
        this.game = new Phaser.Game(256, 192, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
    }
    VoltorbFlip.prototype.preload = function () {
        this.game.load.image('background', 'sprites/background.png');
        this.game.load.spritesheet('cards', 'sprites/cards.png', 24, 24);
        this.game.load.spritesheet('cursor', 'sprites/cursor.png', 28, 28);
        this.game.load.bitmapFont('board_numbers', 'fonts/board_numbers.png', 'fonts/board_numbers.xml');
        this.game.stage.smoothed = false;
    };
    VoltorbFlip.prototype.create = function () {
        var _this = this;
        this.board = new Board(this);
        //logo.anchor.setTo(0.5, 0.5);
        this.addKey('UP', function () { return _this.board.cursor.moveUp(); }, this);
        this.addKey('DOWN', function () { return _this.board.cursor.moveDown(); }, this);
        this.addKey('LEFT', function () { return _this.board.cursor.moveLeft(); }, this);
        this.addKey('RIGHT', function () { return _this.board.cursor.moveRight(); }, this);
        this.addKey('SPACEBAR', function () { return _this.board.cursor.flipCard(_this); }, this);
    };
    /////
    VoltorbFlip.prototype.addKey = function (keyName, callback, context) {
        var key = this.game.input.keyboard.addKey(Phaser.Keyboard[keyName]);
        key.onDown.add(callback, context);
        this.keys[keyName] = key;
    };
    VoltorbFlip.GRID_SIZE = 5;
    VoltorbFlip.CARD_SIZE = 24;
    VoltorbFlip.CARD_MARGIN = 8;
    return VoltorbFlip;
})();
var Board = (function () {
    function Board(voltorbFlip) {
        this.background = voltorbFlip.game.add.sprite(0, 0, 'background');
        this.cards = this.generateCards(voltorbFlip, 3);
        this.cursor = new Cursor(voltorbFlip, 0, 0);
        this.calculateTotals(voltorbFlip);
    }
    Board.prototype.generateCards = function (voltorbFlip, value) {
        var cards = [];
        for (var i = 0; i < VoltorbFlip.GRID_SIZE; i++) {
            var row = [];
            for (var j = 0; j < VoltorbFlip.GRID_SIZE; j++) {
                row.push(new Card(voltorbFlip, i, j, value));
            }
            cards.push(row);
        }
        return cards;
    };
    Board.prototype.calculateTotals = function (voltorbFlip) {
        var rows = [];
        var cols = [];
        for (var i = 0; i < VoltorbFlip.GRID_SIZE; i++) {
            //var row = { coins: 0, voltorbs: 0, coinText: null, voltorbText: null };
            //var col = { coins: 0, voltorbs: 0, coinText: null, voltorbText: null };
            var rowCoins, rowVoltorbs;
            var colCoins, colVoltorbs;
            for (var j = 0; j < VoltorbFlip.GRID_SIZE; j++) {
                rowCoins += this.cards[i][j].value;
                colCoins += this.cards[j][i].value;
                if (this.cards[i][j].value === 0) {
                    rowVoltorbs++;
                }
                if (this.cards[j][i].value === 0) {
                    colVoltorbs++;
                }
            }
            //row.coinText = voltorbFlip.game.add.bitmapText(177, cardPos(i), 'board_numbers', ('00' + col.coins).slice(-2), 32);
            //row.voltorbText = voltorbFlip.game.add.bitmapText(185, cardPos(i) + 13, 'board_numbers', col.voltorbs.toString(), 32);
            //col.coinText = voltorbFlip.game.add.bitmapText(cardPos(i) + 9, 168, 'board_numbers', ('00' + col.coins).slice(-2), 32);
            //col.voltorbText = voltorbFlip.game.add.bitmapText(cardPos(i) + 17, 181, 'board_numbers', col.voltorbs.toString(), 32);
            //rows.push(row);
            //cols.push(col);
            rows.push(new BoardHint(voltorbFlip, i, VoltorbFlip.GRID_SIZE + 1, rowCoins, rowVoltorbs));
            cols.push(new BoardHint(voltorbFlip, VoltorbFlip.GRID_SIZE + 1, i, colCoins, colVoltorbs));
        }
        this.rows = rows;
        this.cols = cols;
    };
    return Board;
})();
var BoardHint = (function () {
    function BoardHint(voltorbFlip, row, col, coins, voltorbs) {
        this.coins = coins;
        this.voltorbs = voltorbs;
        this.coinText = voltorbFlip.game.add.bitmapText(cardPos(col) + 9, cardPos(row), 'board_numbers', ('00' + coins).slice(-2), 32);
        this.voltorbText = voltorbFlip.game.add.bitmapText(cardPos(col) + 17, cardPos(row) + 13, 'board_numbers', voltorbs.toString(), 32);
    }
    return BoardHint;
})();
var Card = (function () {
    function Card(voltorbFlip, row, col, value) {
        var _this = this;
        var sprite = voltorbFlip.game.add.sprite(cardPos(col), cardPos(row), 'cards', 0);
        sprite.inputEnabled = true;
        sprite.events.onInputDown.add(function () { return _this.onClick(voltorbFlip); }, this);
        this.sprite = sprite;
        this.row = row;
        this.col = col;
        this.value = value;
    }
    Card.prototype.flip = function () {
        this.sprite.frame = this.value + 1;
    };
    Card.prototype.onClick = function (voltorbFlip) {
        this.flip();
        voltorbFlip.board.cursor.move(this.row, this.col);
    };
    return Card;
})();
var Cursor = (function () {
    function Cursor(voltorbFlip, row, col) {
        this.sprite = voltorbFlip.game.add.sprite(0, 0, 'cursor', 0);
        this.move(row, col);
    }
    Cursor.prototype.move = function (row, col) {
        row = (row < 0 ? 0 : (row >= VoltorbFlip.GRID_SIZE ? VoltorbFlip.GRID_SIZE - 1 : row));
        col = (col < 0 ? 0 : (col >= VoltorbFlip.GRID_SIZE ? VoltorbFlip.GRID_SIZE - 1 : col));
        this.row = row;
        this.col = col;
        this.sprite.x = cardPos(col) - 2;
        this.sprite.y = cardPos(row) - 2;
    };
    Cursor.prototype.moveUp = function () { this.moveRelative(-1, 0); };
    Cursor.prototype.moveDown = function () { this.moveRelative(1, 0); };
    Cursor.prototype.moveLeft = function () { this.moveRelative(0, -1); };
    Cursor.prototype.moveRight = function () { this.moveRelative(0, 1); };
    Cursor.prototype.flipCard = function (voltorbFlip) {
        voltorbFlip.board.cards[this.row][this.col].flip();
    };
    Cursor.prototype.moveRelative = function (row, col) {
        this.move(this.row + row, this.col + col);
    };
    return Cursor;
})();
function cardPos(pos) {
    return pos * (VoltorbFlip.CARD_SIZE + VoltorbFlip.CARD_MARGIN) + VoltorbFlip.CARD_MARGIN;
}
window.onload = function () {
    var game = new VoltorbFlip();
};
//# sourceMappingURL=app.js.map