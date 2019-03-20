import createjs from 'createjs';

export default class Cells {
  constructor (x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
  }

  createCell() {
    let cell = new createjs.Shape();
    // cell.graphics.beginFill('#b9dd77');
    cell.graphics.beginFill(this.color).beginStroke('#b9dd77').drawRect(0, 0, this.size, this.size).endStroke();
    cell.graphics.endFill();
    cell.x = (this.x * this.size)+1;
    cell.y = (this.y * this.size)+1;
    cell.height = this.size;
    cell.width = this.size;
    return cell;
  }

  createBomb() {
    let bomb = new createjs.Shape();
    let circle = new createjs.Shape();
    bomb.graphics.beginFill('#db3236');
    bomb.graphics.drawRect(0, 0, this.size, this.size).endStroke();
    bomb.graphics.endFill();
    circle.graphics.beginFill("#8e2023").drawCircle(0, 0, this.size/3);
    circle.x = (this.x * this.size) +1 + this.size/2;
    circle.y = (this.y * this.size) +1 + this.size/2;
    bomb.x = (this.x * this.size)+1;
    bomb.y = (this.y * this.size)+1;
    bomb.height = this.size;
    bomb.width = this.size;
    bomb.visible = false;
    circle.visible = false;
    return [bomb, circle];
  }

  createNumber(number) {
    // console.log(number);
    if (number !== null) {
      let textBg = new createjs.Shape();
      textBg.graphics.beginFill('#e5c29f');
      textBg.graphics.drawRect(0, 0, this.size, this.size).endStroke();
      textBg.graphics.endFill();
      textBg.x = (this.x * this.size)+1;
      textBg.y = (this.y * this.size)+1;
      let text = new createjs.Text(`${number}`, `${this.size/2}px Arial`, '#1976d2');
      text.x = (this.x * this.size) +1 + this.size/3;
      text.y = (this.y * this.size) +1 + this.size/1.5;
      text.textBaseline = "alphabetic";
      return [textBg, text];
    }
    return false;
  }
}
