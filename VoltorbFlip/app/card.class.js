var VoltorbFlip;
(function (VoltorbFlip) {
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
            this.memos[0] = new VoltorbFlip.Memo(row, col, 0);
            this.memos[1] = new VoltorbFlip.Memo(row, col, 1);
            this.memos[2] = new VoltorbFlip.Memo(row, col, 2);
            this.memos[3] = new VoltorbFlip.Memo(row, col, 3);
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
})(VoltorbFlip || (VoltorbFlip = {}));
//# sourceMappingURL=card.class.js.map