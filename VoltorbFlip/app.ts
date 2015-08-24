namespace VoltorbFlip {
  export var game: Phaser.Game;
  export var board: Board;
  export var keys: { [name: string]: Phaser.Key } = {};

  export var BOARD_SIZE = 5;
  export var CARD_SIZE = 24;
  export var CARD_MARGIN = 8;

  export function init() {
    game = new Phaser.Game(256, 192, Phaser.AUTO, 'content', { preload: preload, create: create });
  }

  export function preload() {
    game.load.image('background', 'sprites/background.png');
    game.load.spritesheet('cards', 'sprites/cards.png', 24, 24);
    game.load.spritesheet('memos', 'sprites/memos.png', 24, 24);
    game.load.spritesheet('cursor', 'sprites/cursor.png', 28, 28);
    game.load.bitmapFont('board_numbers', 'fonts/board_numbers.png', 'fonts/board_numbers.xml');

    game.stage.smoothed = false;
  }

  export function create() {
    board = new Board();

    addKey('UP', () => board.cursor.moveUp(), this);
    addKey('DOWN', () => board.cursor.moveDown(), this);
    addKey('LEFT', () => board.cursor.moveLeft(), this);
    addKey('RIGHT', () => board.cursor.moveRight(), this);
    addKey('A', () => board.currentCard().toggleMemo(0), this);
    addKey('S', () => board.currentCard().toggleMemo(1), this);
    addKey('Z', () => board.currentCard().toggleMemo(2), this);
    addKey('X', () => board.currentCard().toggleMemo(3), this);
    addKey('SPACEBAR', () => board.currentCard().flip(), this);
  }

  export function addKey(keyName: string, callback: Function, context: any) {
    var key = game.input.keyboard.addKey(Phaser.Keyboard[keyName]);
    key.onDown.add(callback, context);
    keys[keyName] = key;
  }

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

  export class HintText {
    coins: number;
    voltorbs: number;
    coinText: Phaser.BitmapText;
    voltorbText: Phaser.BitmapText;

    constructor(row: number, col: number, coins: number, voltorbs: number) {
      this.coins = coins;
      this.voltorbs = voltorbs;
      this.coinText = game.add.bitmapText(Card.position(col) - 3, Card.position(row) - 12, 'board_numbers', ('00' + coins).slice(-2), 32);
      this.voltorbText = game.add.bitmapText(Card.position(col) + 5, Card.position(row) + 1, 'board_numbers', voltorbs.toString(), 32);
    }

    setCoins(coins: number) {
      this.coins = coins;
      this.coinText.text = ('00' + coins).slice(-2);
    }

    setVoltorbs(voltorbs: number) {
      this.voltorbs = voltorbs;
      this.voltorbText.text = voltorbs.toString();
    }
  }

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

window.onload = () => {
  VoltorbFlip.init();
};
