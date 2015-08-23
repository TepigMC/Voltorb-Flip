class VoltorbFlip {
  game: Phaser.Game;
  board: Board;
  keys: Phaser.Key[];

  static GRID_SIZE = 5;
  static CARD_SIZE = 24;
  static CARD_MARGIN = 8;

  constructor() {
    this.game = new Phaser.Game(256, 192, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
  }

  preload() {
    this.game.load.image('background', 'sprites/background.png');
    this.game.load.spritesheet('cards', 'sprites/cards.png', 24, 24);
    this.game.load.spritesheet('cursor', 'sprites/cursor.png', 28, 28);
    this.game.load.bitmapFont('board_numbers', 'fonts/board_numbers.png', 'fonts/board_numbers.xml');

    this.game.stage.smoothed = false;
  }

  create() {
    this.board = new Board(this);
    //logo.anchor.setTo(0.5, 0.5);

    this.addKey('UP', () => this.board.cursor.moveUp(), this);
    this.addKey('DOWN', () => this.board.cursor.moveDown(), this);
    this.addKey('LEFT', () => this.board.cursor.moveLeft(), this);
    this.addKey('RIGHT', () => this.board.cursor.moveRight(), this);
    this.addKey('SPACEBAR', () => this.board.cursor.flipCard(this), this);
  }

  /////

  addKey(keyName: string, callback: Function, context: any) {
    var key = this.game.input.keyboard.addKey(Phaser.Keyboard[keyName]);
    key.onDown.add(callback, context);
    this.keys[keyName] = key;
  }
}

class Board {
  cards: Card[][];
  rows: BoardHint[];
  cols: BoardHint[];
  cursor: Cursor;
  background: Phaser.Sprite;

  constructor(voltorbFlip: VoltorbFlip) {
    this.background = voltorbFlip.game.add.sprite(0, 0, 'background');
    this.cards = this.generateCards(voltorbFlip, 3);
    this.cursor = new Cursor(voltorbFlip, 0, 0);
    this.calculateTotals(voltorbFlip);
  }

  generateCards(voltorbFlip: VoltorbFlip, value: number) {
    var cards = [];
    for (var i = 0; i < VoltorbFlip.GRID_SIZE; i++) {
      var row = [];
      for (var j = 0; j < VoltorbFlip.GRID_SIZE; j++) {
        row.push(new Card(voltorbFlip, i, j, value));
      }
      cards.push(row);
    }
    return cards;
  }

  calculateTotals(voltorbFlip: VoltorbFlip) {
    var rows = [];
    var cols = [];
    for (var i = 0; i < VoltorbFlip.GRID_SIZE; i++) {
      var row = { coins: 0, voltorbs: 0, coinText: null, voltorbText: null };
      var col = { coins: 0, voltorbs: 0, coinText: null, voltorbText: null };
      //var rowCoins: number, rowVoltorbs: number;
      //var colCoins: number, colVoltorbs: number;
      for (var j = 0; j < VoltorbFlip.GRID_SIZE; j++) {
        row.coins += this.cards[i][j].value;
        col.coins += this.cards[j][i].value;
        if (this.cards[i][j].value === 0) {
          row.voltorbs++;
        }
        if (this.cards[j][i].value === 0) {
          col.voltorbs++;
        }
      }
      row.coinText = voltorbFlip.game.add.bitmapText(177, cardPos(i), 'board_numbers', ('00' + col.coins).slice(-2), 32);
      row.voltorbText = voltorbFlip.game.add.bitmapText(185, cardPos(i) + 13, 'board_numbers', col.voltorbs.toString(), 32);
      col.coinText = voltorbFlip.game.add.bitmapText(cardPos(i) + 9, 168, 'board_numbers', ('00' + col.coins).slice(-2), 32);
      col.voltorbText = voltorbFlip.game.add.bitmapText(cardPos(i) + 17, 181, 'board_numbers', col.voltorbs.toString(), 32);
      rows.push(row);
      cols.push(col);
      //rows.push(new BoardHint(voltorbFlip, i, VoltorbFlip.GRID_SIZE + 1, rowCoins, rowVoltorbs));
      //cols.push(new BoardHint(voltorbFlip, VoltorbFlip.GRID_SIZE + 1, i, colCoins, colVoltorbs));
    }
    this.rows = rows;
    this.cols = cols;
  }
}

class BoardHint {
  coins: number;
  voltorbs: number;
  coinText: Phaser.BitmapText;
  voltorbText: Phaser.BitmapText;

  constructor(voltorbFlip: VoltorbFlip, row: number, col: number, coins: number, voltorbs: number) {
    this.coins = coins;
    this.voltorbs = voltorbs;
    this.coinText = voltorbFlip.game.add.bitmapText(cardPos(col) + 9, cardPos(row), 'board_numbers', ('00' + coins).slice(-2), 32);
    this.voltorbText = voltorbFlip.game.add.bitmapText(cardPos(col) + 17, cardPos(row) + 13, 'board_numbers', voltorbs.toString(), 32);
  }
}

class Card {
  row: number;
  col: number;
  value: number;
  sprite: Phaser.Sprite;

  constructor(voltorbFlip: VoltorbFlip, row: number, col: number, value: number) {
    var sprite = voltorbFlip.game.add.sprite(cardPos(col), cardPos(row), 'cards', 0);
    sprite.inputEnabled = true;
    sprite.events.onInputDown.add(() => this.onClick(voltorbFlip), this);
    this.sprite = sprite;
    this.row = row;
    this.col = col;
    this.value = value;
  }

  flip() {
    this.sprite.frame = this.value + 1;
  }

  private onClick(voltorbFlip: VoltorbFlip) {
    this.flip();
    voltorbFlip.board.cursor.move(this.row, this.col);
  }
}

class Cursor {
  row: number;
  col: number;
  sprite: Phaser.Sprite;

  constructor(voltorbFlip: VoltorbFlip, row: number, col: number) {
    this.sprite = voltorbFlip.game.add.sprite(0, 0, 'cursor', 0);
    this.move(row, col);
  }

  move(row: number, col: number) {
    row = (row < 0 ? 0 : (row >= VoltorbFlip.GRID_SIZE ? VoltorbFlip.GRID_SIZE - 1 : row));
    col = (col < 0 ? 0 : (col >= VoltorbFlip.GRID_SIZE ? VoltorbFlip.GRID_SIZE - 1 : col));
    this.row = row;
    this.col = col;
    this.sprite.x = cardPos(col) - 2;
    this.sprite.y = cardPos(row) - 2;
  }

  moveUp() { this.moveRelative(-1, 0); }
  moveDown() { this.moveRelative(1, 0); }
  moveLeft() { this.moveRelative(0, -1); }
  moveRight() { this.moveRelative(0, 1); }

  flipCard(voltorbFlip: VoltorbFlip) {
    voltorbFlip.board.cards[this.row][this.col].flip();
  }

  private moveRelative(row: number, col: number) {
    this.move(this.row + row, this.col + col);
  }
}

function cardPos(pos: number) {
  return pos * (VoltorbFlip.CARD_SIZE + VoltorbFlip.CARD_MARGIN) + VoltorbFlip.CARD_MARGIN;
}

window.onload = () => {
  var game = new VoltorbFlip();
};
