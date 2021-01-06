class Cell {
  constructor(row, column, x, y, cellSize, textSize, cells) {
    this.row = row;
    this.column = column;
    this.x = x;
    this.y = y;
    this.textSize = textSize;
    this.cellSize = cellSize;
    this.cells = cells;
    this.value = 0; // int(random(1, 9));
    this.openList = [];
  }

  draw() {
    fill('white');
    rect(this.x, this.y, this.cellSize, this.cellSize);
    fill('blue');
    textSize(this.textSize);
    if (this.value !== 0) {
      text(
        this.value,
        this.x + this.cellSize / 2 - this.textSize * 0.3,
        this.y + this.textSize * 0.3 + int(this.row / 3) * 3 + this.cellSize / 2
      );
    }
    // fill('red');
    // const smallTextSize = int(this.textSize * 0.25);
    // for (let i = 0; i < this.cells; i++) {
    //   textSize(smallTextSize);
    //   text(
    //     i + 1,
    //     this.x + smallTextSize / 2 + i * smallTextSize,
    //     this.y + smallTextSize + 4
    //   );
    // }
    this.drawHint();
  }
  drawHint() {
    if (!this.openList || this.openList.length === 0) {
      return;
    }
    fill('red');
    const smallTextSize = int(this.textSize * 0.25);
    textSize(smallTextSize);
    for (let i = 0; i < this.openList.length; i++) {
      text(
        this.openList[i],
        this.x + smallTextSize / 2 + i * smallTextSize,
        this.y + smallTextSize + 4
      );
    }
  }
}
