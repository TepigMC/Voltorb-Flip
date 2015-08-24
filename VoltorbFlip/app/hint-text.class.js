var VoltorbFlip;
(function (VoltorbFlip) {
    var HintText = (function () {
        function HintText(row, col, coins, voltorbs) {
            this.coins = coins;
            this.voltorbs = voltorbs;
            this.coinText = VoltorbFlip.game.add.bitmapText(VoltorbFlip.Card.position(col) - 3, VoltorbFlip.Card.position(row) - 12, 'board_numbers', ('00' + coins).slice(-2), 32);
            this.voltorbText = VoltorbFlip.game.add.bitmapText(VoltorbFlip.Card.position(col) + 5, VoltorbFlip.Card.position(row) + 1, 'board_numbers', voltorbs.toString(), 32);
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
})(VoltorbFlip || (VoltorbFlip = {}));
//# sourceMappingURL=hint-text.class.js.map