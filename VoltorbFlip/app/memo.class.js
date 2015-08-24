var VoltorbFlip;
(function (VoltorbFlip) {
    var Memo = (function () {
        function Memo(row, col, id) {
            this.id = id;
            this.visible = false;
            this.sprite = VoltorbFlip.game.add.sprite(VoltorbFlip.Card.position(col), VoltorbFlip.Card.position(row), 'memos', id);
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
})(VoltorbFlip || (VoltorbFlip = {}));
//# sourceMappingURL=memo.class.js.map