const BOARD_CELL_STATE = {
    OPEN: 0,
    QUEEN: 2,
    CLOSED: 1
}

document.getElementById("nRainhasForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const queens = parseInt(document.getElementById("queens").value);
    const width = parseInt(document.getElementById("width").value);
    const height = parseInt(document.getElementById("height").value);

    if (isNaN(queens) || isNaN(width) || isNaN(height) || queens <= 0 || width <= 0 || height <= 0) {
        alert("Por favor, insira valores válidos.");
        return;
    }

    const solutionBoard = findPossibleSolution(queens, width, height);

    console.log(solutionBoard);
});

function create2DArray(width, height, defaultValue) {
    return new Array(width).fill(null).map(() => new Array(height).fill(defaultValue));
}

function copy2DArray(array) {
    return array.map(row => [...row]);
}

function findPossibleSolution(queens, width, height) {
    let leadingCells = width * height;

    let currentBoard = create2DArray(width, height, BOARD_CELL_STATE.OPEN);

    for (let i = 0; i < queens || leadingCells == 0; i++) {
        const { minClosedCells, bestBoard } = findBestPosition(currentBoard);
        leadingCells -= (minClosedCells + 1); //including the queen
        currentBoard = bestBoard;
    }

    return currentBoard;
}

function findBestPosition(board) {
    let minClosedCells = Number.MAX_VALUE;
    let bestBoard = null;

    for (let y = 0; y < board.length; y++) { //line
        for (let x = 0; x < board[y].length; x++) { //column
            const { newBoard, closedCells } = testPosition(board, x, y);
            if (closedCells < minClosedCells) {
                minClosedCells = closedCells;
                bestBoard = newBoard;
            }
        }
    }

    return { minClosedCells, bestBoard };
}

function testPosition(board, x, y) {
    const newBoard = copy2DArray(board);
    let closedCells = 0;

    newBoard[x][y] = BOARD_CELL_STATE.QUEEN;

    for (let stepY = -1; stepY <= 1; stepY++) {
        for (let stepX = -1; stepX <= 1; stepX++) {
            if (stepX != 0 || stepY != 0) {
                closedCells += traverseStraightPath(newBoard, x, y, stepX, stepY);
            }
        }
    }

    return { newBoard, closedCells }
}

function traverseStraightPath(board, posX, posY, stepX, stepY) {
    let closedCells = 0;
    let x = posX + stepX;
    let y = posY + stepY;

    while (x >= 0 && x < board[0].length && y >= 0 && y < board.length) {
        if (board[y][x] === BOARD_CELL_STATE.OPEN) {
            board[y][x] = BOARD_CELL_STATE.CLOSED;
            closedCells++;
        }
        x += stepX;
        y += stepY;
    }

    return closedCells;
}