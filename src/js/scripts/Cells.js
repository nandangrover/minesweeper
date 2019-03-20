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
    console.log(this.color);
    
    cell.graphics.beginFill(this.color).beginStroke('#b9dd77').drawRect(0, 0, this.size, this.size).endStroke();
    cell.graphics.endFill();
    cell.x = (this.y * this.size)+1;
    cell.y = (this.x * this.size)+1;
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
    return [bomb, circle];
  }
}
