var VoltorbFlip;
(function (VoltorbFlip) {
    var Board = (function () {
        function Board() {
            this.background = VoltorbFlip.game.add.sprite(0, 0, 'background');
            this.cards = this.generateCards(3);
            this.cursor = new VoltorbFlip.Cursor(0, 0);
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
                    row.push(new VoltorbFlip.Card(i, j, value));
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
                rows.push(new VoltorbFlip.HintText(i, VoltorbFlip.BOARD_SIZE, rowCoins, rowVoltorbs));
                cols.push(new VoltorbFlip.HintText(VoltorbFlip.BOARD_SIZE, i, colCoins, colVoltorbs));
            }
            this.rows = rows;
            this.cols = cols;
        };
        return Board;
    })();
    VoltorbFlip.Board = Board;
})(VoltorbFlip || (VoltorbFlip = {}));
//# sourceMappingURL=board.class.js.map