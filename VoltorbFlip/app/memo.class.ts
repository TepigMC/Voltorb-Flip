namespace VoltorbFlip {
  export class Memo {
    id: number;
    visible: boolean;
    sprite: Phaser.Sprite;

    constructor(row: number, col: number, id: number) {
      this.id = id;
      this.visible = false;
      this.sprite = game.add.sprite(Card.position(col), Card.position(row), 'memos', id);
      this.sprite.anchor.setTo(.5);
      this.sprite.visible = false;
    }

    setVisible(visible: boolean) {
      this.visible = visible;
      this.sprite.visible = visible;
    }

    toggle() {
      this.setVisible(!this.visible);
    }
  }
}
