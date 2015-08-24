namespace VoltorbFlip {
  export class Cursor {
    row: number;
    col: number;
    sprite: Phaser.Sprite;

    constructor(row: number, col: number) {
      this.sprite = game.add.sprite(0, 0, 'cursor', 0);
      this.sprite.anchor.setTo(.5);
      this.move(row, col);
    }

    move(row: number, col: number) {
      row = (row < 0 ? BOARD_SIZE - 1 : (row >= BOARD_SIZE ? 0 : row));
      col = (col < 0 ? BOARD_SIZE - 1 : (col >= BOARD_SIZE ? 0 : col));
      this.row = row;
      this.col = col;
      this.sprite.x = Card.position(col);
      this.sprite.y = Card.position(row);
    }

    moveUp() { this.moveRelative(-1, 0); }
    moveDown() { this.moveRelative(1, 0); }
    moveLeft() { this.moveRelative(0, -1); }
    moveRight() { this.moveRelative(0, 1); }

    private moveRelative(row: number, col: number) {
      this.move(this.row + row, this.col + col);
    }
  }
}
