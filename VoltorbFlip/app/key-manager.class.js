var VoltorbFlip;
(function (VoltorbFlip) {
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
//# sourceMappingURL=key-manager.class.js.map