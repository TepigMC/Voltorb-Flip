namespace VoltorbFlip {
  export class Board {
    cards: Card[][];
    rows: HintText[];
    cols: HintText[];
    cursor: Cursor;
    background: Phaser.Sprite;

    constructor() {
      this.background = game.add.sprite(0, 0, 'background');
      this.cards = this.generateCards(3);
      this.cursor = new Cursor(0, 0);
      this.calculateTotals();
    }

    currentCard() {
      return this.cards[this.cursor.row][this.cursor.col];
    }

    generateCards(value: number) {
      var cards = [];
      for (var i = 0; i < BOARD_SIZE; i++) {
        var row = [];
        for (var j = 0; j < BOARD_SIZE; j++) {
          row.push(new Card(i, j, value));
        }
        cards.push(row);
      }
      return cards;
    }

    calculateTotals() {
      var rows = [];
      var cols = [];
      for (var i = 0; i < BOARD_SIZE; i++) {
        var rowCoins = 0, rowVoltorbs = 0;
        var colCoins = 0, colVoltorbs = 0;
        for (var j = 0; j < BOARD_SIZE; j++) {
          rowCoins += this.cards[i][j].value;
          colCoins += this.cards[j][i].value;
          if (this.cards[i][j].value === 0) {
            rowVoltorbs++;
          }
          if (this.cards[j][i].value === 0) {
            colVoltorbs++;
          }
        }
        rows.push(new HintText(i, BOARD_SIZE, rowCoins, rowVoltorbs));
        cols.push(new HintText(BOARD_SIZE, i, colCoins, colVoltorbs));
      }
      this.rows = rows;
      this.cols = cols;
    }
  }
}
