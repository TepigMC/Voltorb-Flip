namespace VoltorbFlip {
  export class Card {
    row: number;
    col: number;
    value: number;
    flipped: boolean;
    sprite: Phaser.Sprite;
    memos: Memo[];

    constructor(row: number, col: number, value: number) {
      this.row = row;
      this.col = col;
      this.value = value;
      this.flipped = false;
      this.sprite = game.add.sprite(Card.position(col), Card.position(row), 'cards', 0);
      this.sprite.anchor.setTo(.5);
      this.sprite.inputEnabled = true;
      this.sprite.events.onInputDown.add(this.onClick, this);
      this.memos = [];
      this.memos[0] = new Memo(row, col, 0);
      this.memos[1] = new Memo(row, col, 1);
      this.memos[2] = new Memo(row, col, 2);
      this.memos[3] = new Memo(row, col, 3);
    }

    flip() {
      this.flipped = true;
      this.sprite.frame = this.value + 1;
      this.memos.map((memo: Memo) => memo.setVisible(false));
    }

    toggleMemo(id: number) {
      if (this.flipped === false) {
        this.memos[id].toggle();
      }
    }

    static position(pos: number) {
      return pos * (CARD_SIZE + CARD_MARGIN) + CARD_MARGIN + CARD_SIZE / 2;
    }

    private onClick() {
      this.flip();
      board.cursor.move(this.row, this.col);
    }
  }
}
