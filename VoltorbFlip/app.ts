﻿namespace VoltorbFlip {
  export var game: Phaser.Game;
  export var board: Board;
  export var keys: Phaser.Key[];

  export var BOARD_SIZE = 5;
  export var CARD_SIZE = 24;
  export var CARD_MARGIN = 8;

  export function init() {
    game = new Phaser.Game(256, 192, Phaser.AUTO, 'content', { preload: preload, create: create });
  }

  export function preload() {
    game.load.image('background', 'sprites/background.png');
    game.load.spritesheet('cards', 'sprites/cards.png', 24, 24);
    game.load.spritesheet('cursor', 'sprites/cursor.png', 28, 28);
    game.load.bitmapFont('board_numbers', 'fonts/board_numbers.png', 'fonts/board_numbers.xml');

    game.stage.smoothed = false;
  }

  export function create() {
    board = new Board();
    keys = [];

    addKey('UP', () => board.cursor.moveUp(), this);
    addKey('DOWN', () => board.cursor.moveDown(), this);
    addKey('LEFT', () => board.cursor.moveLeft(), this);
    addKey('RIGHT', () => board.cursor.moveRight(), this);
    addKey('SPACEBAR', () => board.cursor.flipCard(), this);
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
      this.coinText = game.add.bitmapText(cardPos(col) - 3, cardPos(row) - 12, 'board_numbers', ('00' + coins).slice(-2), 32);
      this.voltorbText = game.add.bitmapText(cardPos(col) + 5, cardPos(row) + 1, 'board_numbers', voltorbs.toString(), 32);
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
    sprite: Phaser.Sprite;

    constructor(row: number, col: number, value: number) {
      this.sprite = game.add.sprite(cardPos(col), cardPos(row), 'cards', 0);
      this.sprite.anchor.setTo(.5);
      this.sprite.inputEnabled = true;
      this.sprite.events.onInputDown.add(this.onClick, this);
      this.row = row;
      this.col = col;
      this.value = value;
    }

    flip() {
      this.sprite.frame = this.value + 1;
    }

    private onClick() {
      this.flip();
      board.cursor.move(this.row, this.col);
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
      this.sprite.x = cardPos(col);
      this.sprite.y = cardPos(row);
    }

    moveUp() { this.moveRelative(-1, 0); }
    moveDown() { this.moveRelative(1, 0); }
    moveLeft() { this.moveRelative(0, -1); }
    moveRight() { this.moveRelative(0, 1); }

    flipCard() {
      board.cards[this.row][this.col].flip();
    }

    private moveRelative(row: number, col: number) {
      this.move(this.row + row, this.col + col);
    }
  }

  export function cardPos(pos: number) {
    return pos * (CARD_SIZE + CARD_MARGIN) + CARD_MARGIN + CARD_SIZE / 2;
  }
}

window.onload = () => {
  VoltorbFlip.init();
};
