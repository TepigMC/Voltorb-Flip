namespace VoltorbFlip {
  export class KeyManager {
    keys: { [name: string]: Phaser.Key } = {};

    addKey(keyName: string, callback: Function, context: any) {
      var key = game.input.keyboard.addKey(Phaser.Keyboard[keyName]);
      key.onDown.add(callback, context);
      this.keys[keyName] = key;
    }

    addKeys(keyNames: string[], callback: Function, context: any) {
      for (var keyName of keyNames) {
        this.addKey(keyName, callback, context);
      }
    }
  }
}
