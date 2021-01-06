class Sudoku {
	constructor(x, y, w, h) {
		this.cells = 9;
		this.textSize = 40;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.cellSize = this.h / this.cells;
		this.data = [];
		this.random = 100;
		this.init();
		this.draw();
	}

	init() {
		for (let row = 0; row < this.cells; row++) {
			this.data[row] = [];
			for (let column = 0; column < this.cells; column++) {
				this.data[row].push(
					new Cell(
						row,
						column,
						this.x +
							3 +
							column * this.cellSize +
							int(column / 3) * 3,
						this.y + 3 + row * this.cellSize + int(row / 3) * 3,
						this.cellSize,
						this.textSize,
						this.cells
					)
				);
			}
		}
		this.generatedCount = 0;
		this.currentRow = 0;
		this.currentColumn = 0;
		this.getRandomNumber(this.currentRow, this.currentColumn);
	}

	draw() {
		fill('white');
		rect(
			this.x,
			this.y,
			this.cellSize * this.cells + 12,
			this.cellSize * this.cells + 12
		);
		for (let row = 0; row < this.cells; row++) {
			for (let column = 0; column < this.cells; column++) {
				this.data[row][column].draw();
			}
		}
	}

	generatePuzzle() {
		if (this.generatedCount < this.cells * this.cells) {
			if (this.data[this.currentRow][this.currentColumn].value === 0) {
				if (
					this.data[this.currentRow][this.currentColumn].openList
						.length > 0
				) {
					const n = this.data[this.currentRow][this.currentColumn]
						.openList[0];
					this.data[this.currentRow][
						this.currentColumn
					].openList.shift();
					this.data[this.currentRow][this.currentColumn].value = n;
					this.generatedCount++;
					this.currentColumn++;
					if (this.currentColumn === this.cells) {
						this.currentColumn = 0;
						this.currentRow++;
					}
					if (this.currentRow < this.cells) {
						this.getRandomNumber(
							this.currentRow,
							this.currentColumn
						);
					}
				} else {
					this.generatedCount--;
					this.currentColumn--;
					if (this.currentColumn < 0) {
						this.currentColumn = this.cells - 1;
						this.currentRow--;
					}
					this.data[this.currentRow][this.currentColumn].value = 0;
				}
			} else {
				this.currentColumn++;
				if (this.currentColumn === this.cells) {
					this.currentColumn = 0;
					this.currentRow++;
				}
			}
		}
		this.draw();
		if (this.generatedCount === this.cells * this.cells) {
			if (this.checkSafeAll()) {
				console.log('GOOD');
			} else {
				console.log('NO GOOD');
			}
			return false;
		}
		return true; //this.generatePuzzle();
	}

	getRandomNumber(row, column) {
		let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		for (let i = 0; i < this.random; i++) {
			const i1 = int(random(0, this.cells));
			const i2 = int(random(0, this.cells));
			const temp = numbers[i1];
			numbers[i1] = numbers[i2];
			numbers[i2] = temp;
		}
		numbers.forEach((n) => {
			if (this.isSafe(row, column, n)) {
				this.data[row][column].openList.push(n);
				// this.data[row][column].drawHint();
			}
		});
	}

	checkSafeAll() {
		for (let row = 0; row < this.cells; row++) {
			for (let column = 0; column < this.cells; column++) {
				if (
					this.data[row][column].value > 0 &&
					!this.isSafe(row, column, this.data[row][column].value)
				) {
					console.log('NOT safe', row, column);
					return false;
				}
			}
		}
		return true;
	}

	generatePossibleNumbers(row, column) {
		let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		let row_1 = numbers;
		for (let column = 0; column < this.cells; column++) {
			if (this.data[row][column].value > 0) {
				row_1 = row_1.filter((e) => e !== this.data[row][column].value);
			}
		}
		if (row_1.length === 0) {
			return false;
		}
		for (let row = 0; row < this.cells; row++) {
			if (this.data[row][column].value > 0) {
				row_1 = row_1.filter((e) => e !== this.data[row][column].value);
			}
		}
		if (row_1.length === 0) {
			return false;
		}
		const areaRow = int(row / 3);
		const areaColumn = int(column / 3);
		console.log(
			'row, column, areaRow, areaColumn',
			row,
			column,
			areaRow,
			areaColumn
		);
		for (let r = areaRow * 3; r < areaRow * 3 + 3; r++) {
			for (let c = areaColumn * 3; c < areaColumn * 3 + 3; c++) {
				row_1 = row_1.filter((e) => e !== this.data[r][c].value);
			}
		}
		if (row_1.length === 0) {
			return false;
		}
		for (let i = 0; i < this.random; i++) {
			const i1 = int(random(0, row_1.length));
			const i2 = int(random(0, row_1.length));
			const temp = row_1[i1];
			row_1[i1] = row_1[i2];
			row_1[i2] = temp;
		}
		console.log('row_1 column', row_1);
		row_1.forEach((e) => {
			this.stack.push(e);
		});
		return true;
	}

	isSafe(row, column, number) {
		// console.log('isSafe', row, column, number);
		const areaRow = int(row / 3);
		const areaColumn = int(column / 3);
		for (let r = areaRow * 3; r < areaRow * 3 + 3; r++) {
			for (let c = areaColumn * 3; c < areaColumn * 3 + 3; c++) {
				if (
					this.data[r][c].value === number &&
					(r !== row || c !== column)
				) {
					return false;
				}
			}
		}
		for (let c = 0; c < this.cells; c++) {
			if (this.data[row][c].value === number && c !== column) {
				return false;
			}
		}
		for (let r = 0; r < this.cells; r++) {
			if (this.data[r][column].value === number && r !== row) {
				return false;
			}
		}
		return true;
	}

	prepareToSolvePuzzle() {
		this.solution = [];
		this.removeNCells = 40;
		for (let row = 0; row < this.cells; row++) {
			for (let column = 0; column < this.cells; column++) {
				this.data[row][column].openList = null;
			}
		}
	}

	solvePuzzle() {
		if (this.removeNCells > 0) {
			let r = int(random(0, this.cells));
			let c = int(random(0, this.cells));
			while (this.data[r][c].value === 0) {
				r = int(random(0, this.cells));
				c = int(random(0, this.cells));
			}
			this.solution.push(this.data[r][c]);
			this.data[r][c].value = 0;
			this.data[r][c].openList = [];
			// this.getRandomNumber(r, c, 0);
			// console.log('this.data[r][c]', this.data[r][c]);
			this.draw();

			this.removeNCells--;
			return true;
		} else {
			let st = '';
			for (let row = 0; row < this.cells; row++) {
				for (let column = 0; column < this.cells; column++) {
					st += this.data[row][column].value;
				}
			}
			console.log(st);
			return false;
		}
	}

	findSolution(r, c, from) {
		let count = 0;
		while (this.data[r][c].openList.length > 0) {
			const n = this.data[r][c].openList[0];
			this.data[r][c].openList.shift();
			this.data[r][c].value = n;
			from++;
			if (this.solution.length > from) {
				count += this.findSolution(
					this.solution[from].row,
					this.solution[from].column,
					from
				);
			} else {
				count++;
			}
			if (count > 1) {
				return 2;
			}
		}
	}

	generateRandomTopLeftArea() {
		let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		for (let i = 0; i < this.random; i++) {
			const i1 = int(random(0, this.cells));
			const i2 = int(random(0, this.cells));
			const temp = numbers[i1];
			numbers[i1] = numbers[i2];
			numbers[i2] = temp;
		}
		// console.log('generateRandomTopLeftArea', numbers);
		this.data[0][0].value = numbers[0];
		this.data[0][1].value = numbers[1];
		this.data[0][2].value = numbers[2];
		this.data[1][0].value = numbers[3];
		this.data[1][1].value = numbers[4];
		this.data[1][2].value = numbers[5];
		this.data[2][0].value = numbers[6];
		this.data[2][1].value = numbers[7];
		this.data[2][2].value = numbers[8];
	}

	generateRandomSecondArea(row1, row2, row3, col1, col2, col3, x, y) {
		//                      3,     4,    5,    0,    1,    2,  0, -1
		const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		let row_1 = numbers.filter(
			(e) => e !== this.data[row1 + 3 * y][col1 + 3 * x].value
		);
		row_1 = row_1.filter(
			(e) => e !== this.data[row1 + 3 * y][col2 + 3 * x].value
		);
		row_1 = row_1.filter(
			(e) => e !== this.data[row1 + 3 * y][col3 + 3 * x].value
		);
		console.log('row_1', row_1);
		let row_2 = numbers.filter(
			(e) => e !== this.data[row2 + 3 * y][col1 + 3 * x].value
		);
		row_2 = row_2.filter(
			(e) => e !== this.data[row2 + 3 * y][col2 + 3 * x].value
		);
		row_2 = row_2.filter(
			(e) => e !== this.data[row2 + 3 * y][col3 + 3 * x].value
		);
		console.log('row_2', row_2);
		let row_3 = numbers.filter(
			(e) => e !== this.data[row3 + 3 * y][col1 + 3 * x].value
		);
		row_3 = row_3.filter(
			(e) => e !== this.data[row3 + 3 * y][col2 + 3 * x].value
		);
		row_3 = row_3.filter(
			(e) => e !== this.data[row3 + 3 * y][col3 + 3 * x].value
		);
		console.log('row_3', row_3);
		for (let i = 0; i < this.random; i++) {
			let i1 = int(random(0, row_1.length));
			let i2 = int(random(0, row_1.length));
			let temp = row_1[i1];
			row_1[i1] = row_1[i2];
			row_1[i2] = temp;

			i1 = int(random(0, row_2.length));
			i2 = int(random(0, row_2.length));
			temp = row_2[i1];
			row_2[i1] = row_2[i2];
			row_2[i2] = temp;

			i1 = int(random(0, row_3.length));
			i2 = int(random(0, row_3.length));
			temp = row_3[i1];
			row_3[i1] = row_3[i2];
			row_3[i2] = temp;
		}
		let index = 0;
		while (row_1.length > 3 && index < row_1.length) {
			const n = row_1[index];
			if (row_2.includes(n)) {
				row_1 = row_1.filter((e) => e !== n);
			} else {
				index++;
			}
		}
		console.log('row_1 => ', row_1);
		index = 0;
		while (row_2.length > 3 && index < row_2.length) {
			const n = row_2[index];
			if (row_3.includes(n)) {
				row_2 = row_2.filter((e) => e !== n);
			} else {
				index++;
			}
		}
		console.log('row_2 => ', row_2);
		index = 0;
		while (row_3.length > 3 && index < row_3.length) {
			const n = row_3[index];
			if (row_1.includes(n)) {
				row_3 = row_3.filter((e) => e !== n);
			} else {
				index++;
			}
		}
		console.log('row_3 => ', row_3);
		this.data[row1][col1].value = row_1[0];
		this.data[row1][col2].value = row_1[1];
		this.data[row1][col3].value = row_1[2];
		this.data[row2][col1].value = row_2[0];
		this.data[row2][col2].value = row_2[1];
		this.data[row2][col3].value = row_2[2];
		this.data[row3][col1].value = row_3[0];
		this.data[row3][col2].value = row_3[1];
		this.data[row3][col3].value = row_3[2];
	}
}
