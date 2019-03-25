import createjs from 'createjs';
import Cells from './Cells';
import Timer from './Timer';
import moment from 'moment';
import '../../css/main.css';

class Board {
  constructor () {
  this.boardLength = {x: 10, y: 10};
  this.size = 50;
  this.color = ['#87af3a', '#4a752b']
  this.myCanvas = $('<canvas>', { class: 'mineCanvas', id: 'mineCanvas' });
  this.mode = {easy: 15};
  this.firstClick = {easy: [20, 60]};
  this.clickCount = 0;
  this.bombs = 0;
  this.opened = 0;
  this.hiddenBombs = [];
  this.flags = [];
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
        cell.addEventListener("click", this.onClick.bind(this))
        window.addEventListener('contextmenu', event => event.preventDefault());
        this.stage.addChild(cell);
      }
    }
    this.rowLimit = this.cell.length-1;
    this.columnLimit = this.cell[0].length-1;
    console.log(this.winOpen);
    
  }

  onClick(e) {
    let clicked = this.cell[Math.round(e.target.x/this.size)][Math.round(e.target.y/this.size)];

    if (!e.nativeEvent.button && !clicked.flag) {
        this.clickCount += 1;
        if (this.clickCount === 1) {
          this.onFirstClick(clicked);
        } else {
          this.handleClick(clicked);
        }
    }
    else if (e.nativeEvent.button && clicked.flag) {
      clicked.flag = false;
      this.stage.removeChild(clicked.store[0]);
      this.stage.removeChild(clicked.store[1]);
      this.stage.removeChild(clicked.store[2]);
      clicked.store = null;
    }
    else if (!clicked.opened && !clicked.flag) {
      clicked.flag = true;
      let flag = clicked.createFlag();
      this.stage.addChild(flag[0]);
      this.flags.push(flag[0]);
      this.stage.addChild(flag[1]);
      this.flags.push(flag[1]);
      this.stage.addChild(flag[2]);
      this.flags.push(flag[2]);
      clicked.store = flag;
      console.log("right click");
    }
  }

  onFirstClick(clicked) {
    Timer(true);
    this.winOpen -= 1;
    let open = this.getRandomArbitrary(this.firstClick.easy[0], this.firstClick.easy[1]);
    let count = 0;
    let i = clicked.x;
    let j = clicked.y;
    this.cell[i][i].opened = true;
    let randomX = [];
    let randomY = [];
    while (count < open) {
      for(let x = Math.max(0, i-1); x <= Math.min(i+1, this.rowLimit); x++) {
        for(let y = Math.max(0, j-1); y <= Math.min(j+1, this.columnLimit); y++) {
          if(x !== i || y !== j) {
            this.cell[x][y].opened = true;
            count ++;
            if (x !== i) {
              randomX.push(x);
            }
            if (y !== j) {
              randomY.push(y);
            }
          }
        }
      }
      i = randomX[Math.floor(Math.random() * randomX.length)];
      j = randomY[Math.floor(Math.random() * randomY.length)];
      randomX = [];
      randomY = [];
  
    }
    this.createBombs();
    
  }

  handleClick(clicked) { 
    if (this.cell[clicked.x][clicked.y].count === 0) {
      this.freeSorroundingTiles(clicked.x, clicked.y);
    } 
    else if (this.cell[clicked.x][clicked.y].count === null) {
      this.makeBombsVisible();
      Timer(false);
      console.log("loser");
     
    } 
    else {
      this.cell[clicked.x][clicked.y].opened = true;
      this.getSorroundingZero(clicked.x, clicked.y);
    }
    if ((this.bombs + this.opened) + 1 === this.boardLength.x * this.boardLength.y) {
      alert("Winner Winner Chicken Dinner")
    } 
    this.createNumbers();
  }

  makeBombsVisible() {
    for (let i = 0; i < this.hiddenBombs.length; i += 1) {
      this.hiddenBombs[i].visible = true;
    }

    for (let i = 0; i < this.flags.length; i += 1) {
      this.stage.removeChild(this.flags[i])
    }

    alert("Loser Loser Paneer Dinner");
  }

  freeSorroundingTiles(i ,j) {
    for(let x = Math.max(0, i-1); x <= Math.min(i+1, this.rowLimit); x++) {
      for(let y = Math.max(0, j-1); y <= Math.min(j+1, this.columnLimit); y++) {
          this.cell[x][y].opened = true;
      }
    }
  }

  getSorroundingZero(i, j) {
    for(let x = Math.max(0, i-1); x <= Math.min(i+1, this.rowLimit); x++) {
      for(let y = Math.max(0, j-1); y <= Math.min(j+1, this.columnLimit); y++) {
          if (this.cell[x][y].count === 0) {
            this.cell[x][y].opened = true;
          }
      }
    }
  }

  getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  createBombs() {
    let count = 0;
    while(count < this.mode.easy) {
      let i = Math.floor(Math.random()*10);
      let j = Math.floor(Math.random()*10);
      if (this.cell[i][j].opened) {
        continue;
      }
      let bombArr = this.cell[i][j].createBomb();
      this.stage.addChild(bombArr[0]);
      this.hiddenBombs.push(bombArr[0]);
      this.stage.addChild(bombArr[1]);
      this.hiddenBombs.push(bombArr[1]);
      count += 1;
      this.cell[i][j].bomb = true;
    }
    // console.log(this.cell);
    
    this.createGameLogic();
  }

  createGameLogic() {
    for (let i = 0 ; i < this.boardLength.x; i += 1) {
      for (let j = 0 ; j < this.boardLength.y; j += 1) {
          let bombs = this.getSorroundingBombs(i, j);
          this.cell[i][j].count = bombs;
      }
    }
    this.createInitialBombs();
  }

  createInitialBombs() {
    for (let i = 0 ; i < this.boardLength.x; i += 1) {
      for (let j = 0 ; j < this.boardLength.y; j += 1) {
        if (this.cell[i][j].opened) {
          for(let x = Math.max(0, i-1); x <= Math.min(i+1, this.rowLimit); x++) {
            for(let y = Math.max(0, j-1); y <= Math.min(j+1, this.columnLimit); y++) {
              if((x !== i || y !== j) && !this.cell[x][y].opened && this.cell[x][y].count === 0) {
                let bombArr = this.cell[x][y].createBomb();
                this.stage.addChild(bombArr[0]);
                this.hiddenBombs.push(bombArr[0]);
                this.stage.addChild(bombArr[1]);
                this.hiddenBombs.push(bombArr[1]);
                this.cell[x][y].bomb = true;
              }
            }
          }
        }
      }
    }
    for (let i = 0 ; i < this.boardLength.x; i += 1) {
      for (let j = 0 ; j < this.boardLength.y; j += 1) {
          let bombs = this.getSorroundingBombs(i, j);
          this.cell[i][j].count = bombs;
      }
    }
    this.createNumbers(); 
  }

  createNumbers() {
    this.opened = 0;
    this.bombs = 0;
    for (let i = 0 ; i < this.boardLength.x; i += 1) {
      for (let j = 0 ; j < this.boardLength.y; j += 1) {
        if (this.cell[i][j].opened && !this.cell[i][j].bomb) {
            let number = this.cell[i][j].createNumber(this.cell[i][j].count);
            if (number) {
              this.stage.addChild(number[0]);
              this.stage.addChild(number[1]);
              this.opened += 1;
            }
        }
        if (this.cell[i][j].bomb) {
          this.bombs += 1;
        }
      }
    }
  }

  getSorroundingBombs(i, j) {
    if (this.cell[i][j].bomb) {
      return null;
    }
    let count = 0;
    for(let x = Math.max(0, i-1); x <= Math.min(i+1, this.rowLimit); x++) {
      for(let y = Math.max(0, j-1); y <= Math.min(j+1, this.columnLimit); y++) {
        if(x !== i || y !== j) {
          this.cell[x][y].bomb ? count++ : null;
        }
      }
    }
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