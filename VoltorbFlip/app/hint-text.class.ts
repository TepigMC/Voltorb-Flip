namespace VoltorbFlip {
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
}
