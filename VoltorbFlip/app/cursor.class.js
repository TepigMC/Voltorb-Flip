var VoltorbFlip;
(function (VoltorbFlip) {
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
            this.sprite.x = VoltorbFlip.Card.position(col);
            this.sprite.y = VoltorbFlip.Card.position(row);
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
})(VoltorbFlip || (VoltorbFlip = {}));
//# sourceMappingURL=cursor.class.js.map