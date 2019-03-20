import createjs from 'createjs';
import Cells from './Cells';
import '../../css/main.css';

class Board {
  constructor () {
  this.boardLength = {x: 10, y: 10};
  this.size = 50;
  this.color = ['#87af3a', '#4a752b']
  this.myCanvas = $('<canvas>', { class: 'mineCanvas', id: 'mineCanvas' });
  this.mode = {easy: 10}
  $('.main-wrapper').append(this.myCanvas);
  this.ctx = $(this.myCanvas)[0].getContext('2d');
  $(this.myCanvas)[0].width = (this.size * this.boardLength.x)+this.boardLength.x;
  $(this.myCanvas)[0].height = (this.size * this.boardLength.y)+this.boardLength.y;
  this.stage = new createjs.Stage($(this.myCanvas)[0]);
  // createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", this.stage);
  }

  createBoard() {
    this.cell = this.make2dArray(this.boardLength.x, this.boardLength.y);
    for (let i = 0 ; i < this.boardLength.x; i += 1) {
      for (let j = 0 ; j < this.boardLength.y; j += 1) {
        let color = 0;
        if (i % 2 === 0) {
          color = j % 2 === 0 ? 0 : 1;
        } else {
          color = j % 2 === 0 ? 1 : 0;
        }
        this.cell[i][j] = new Cells(i, j, this.size, this.color[color]);
        let cell = this.cell[i][j].createCell();
        this.stage.addChild(cell);
      }
    }
    this.createBombs();
  }

  createBombs() {
    let count = 0;
    while(count < this.mode.easy) {
      let i = Math.floor(Math.random()*10);
      let j = Math.floor(Math.random()*10);
      let bombArr = this.cell[i][j].createBomb();
      this.stage.addChild(bombArr[0]);
      this.stage.addChild(bombArr[1]);
      count += 1;
      this.cell[i][j].bomb = true;
    }
    this.createGameLogic();
  }

  createGameLogic() {
    for (let i = 0 ; i < this.boardLength.x; i += 1) {
      for (let j = 0 ; j < this.boardLength.y; j += 1) {
          let bombs = this.getSorroundingBombs(i, j);
          this.cell[i][j].count = bombs;
      }
    }
    console.table(this.cell);
  }
  
  getSorroundingBombs(i ,j) {
    if (this.cell[i][j].bomb) {
      return 0;
    }
    let upleft = this.cell[i-1][j-1].bomb ? 1 : 0;
    let up = this.cell[i-1][j].bomb ? 1 : 0;
    let upright = this.cell[i-1][j+1].bomb ? 1 : 0;
    let left = this.cell[i][j-1].bomb ? 1 : 0;
    let right = this.cell[i][j+1].bomb ? 1 : 0;
    let downleft = this.cell[i+1][j-1].bomb ? 1 : 0;
    let down  = this.cell[i+1][j].bomb ? 1 : 0;
    let downright = this.cell[i+1][j+1].bomb ? 1 : 0;

    let count = upleft + up + upright + left + right + downleft + down + downright;
    console.log(count);
    
    return count;
  }

  make2dArray(rows, columns) {
    let arr = new Array(columns);
    for (let i = 0; i < arr.length; i += 1) {
      arr[i] = new Array(rows);
    }
    return arr;
  }
}

const board = new Board();
board.createBoard();