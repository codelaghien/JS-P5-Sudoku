let width;
let height;
let sudoku;
let solving = false;

function setup() {
	width = windowWidth - 10;
	height = windowHeight - 20;
	createCanvas(width, height);
	frameRate(30);
	background(255);
	sudoku = new Sudoku(40, 50, width * 0.8, height * 0.8);
}

function draw() {
	if (!solving) {
		if (!sudoku.generatePuzzle()) {
			noLoop();
		}
	} else {
		if (!sudoku.solvePuzzle()) {
			noLoop();
		}
	}
}

function mouseClicked() {
	console.log('mouseClicked');
	solving = true;
	sudoku.prepareToSolvePuzzle();
	loop();
}
