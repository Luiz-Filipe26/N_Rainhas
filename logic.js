const BOARD_CELL_STATE = {
    OPEN: 0,
    QUEEN: 2,
    CLOSED: 1
}

document.getElementById("nRainhasForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const queens = parseInt(document.getElementById("queens").value);
    const width = parseInt(document.getElementById("width").value);
    const height = parseInt(document.getElementById("height").value);

    if (isNaN(queens) || isNaN(width) || isNaN(height) || queens <= 0 || width <= 0 || height <= 0) {
        alert("Por favor, insira valores válidos.");
        return;
    }

    const steps = findPossibleSolution(queens, width, height);

    const numberOfQueens = steps.length > 0
        ? steps[steps.length - 1].flatMap(row => row)
            .reduce((sum, cell) => cell == BOARD_CELL_STATE.QUEEN ? sum + 1 : sum, 0)
        : 0;

    console.log(`Number of queens: ${numberOfQueens}`);
    console.log(steps[steps.length - 1]);

    await visualizeSteps(steps, 500); // Exibição automática com 500ms entre os passos
});

async function visualizeSteps(steps, delay = 500) {
    for (const step of steps) {
        drawBoard(step);
        await sleep(delay);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function create2DArray(rows, cols, defaultValue) {
    return new Array(rows).fill(null).map(() => new Array(cols).fill(defaultValue));
}

function copy2DArray(array) {
    return array.map(row => [...row]);
}

function drawBoard(board) {
    const container = document.getElementById("boardContainer");
    container.innerHTML = "";

    const rows = board.length;
    const cols = board[0].length;

    container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");

            switch (board[y][x]) {
                case BOARD_CELL_STATE.OPEN:
                    cell.classList.add("open");
                    break;
                case BOARD_CELL_STATE.CLOSED:
                    cell.classList.add("closed");
                    break;
                case BOARD_CELL_STATE.QUEEN:
                    cell.classList.add("queen");
                    cell.textContent = "♛";
                    break;
            }

            container.appendChild(cell);
        }
    }
}

function findPossibleSolution(queens, width, height) {
    const steps = [];

    let leadingCells = width * height;
    let currentBoard = create2DArray(height, width, BOARD_CELL_STATE.OPEN);
    let placedQueens = 0;

    while (placedQueens < queens && leadingCells > 0) {
        const bestBoard = findBestPosition(currentBoard);

        if (!bestBoard) break;

        leadingCells = calculateNumOfLeadingCells(bestBoard);
        currentBoard = bestBoard;
        placedQueens++;

        steps.push(copy2DArray(currentBoard));
    }

    return steps;
}


function findBestPosition(board) {
    let maxHeuristicValue = 0;
    let bestBoard = null;

    for (let y = 0; y < board.length; y++) { //line
        for (let x = 0; x < board[y].length; x++) { //column
            if (board[y][x] !== BOARD_CELL_STATE.OPEN) {
                continue;
            }

            const newBoard = testPosition(board, x, y);
            const heuristicValue = heuristicFunction(newBoard);
            if (heuristicValue >= maxHeuristicValue) {
                maxHeuristicValue = heuristicValue;
                bestBoard = newBoard;
            }
        }
    }

    return bestBoard;
}

function calculateNumOfLeadingCells(board) {
    return board.flatMap(row => row).reduce((sum, cell) => (cell == BOARD_CELL_STATE.OPEN) ? sum+1 : sum, 0);
}

function heuristicFunction(board) {
    return board.flatMap(row => row).reduce((sum, cell) => (cell == BOARD_CELL_STATE.OPEN) ? sum+1 : sum, 0);
}

function testPosition(board, x, y) {
    const newBoard = copy2DArray(board);

    newBoard[y][x] = BOARD_CELL_STATE.QUEEN;

    for (let stepY = -1; stepY <= 1; stepY++) {
        for (let stepX = -1; stepX <= 1; stepX++) {
            if (stepX != 0 || stepY != 0) {
                traverseStraightPath(newBoard, x, y, stepX, stepY);
            }
        }
    }

    return newBoard;
}

function traverseStraightPath(board, posX, posY, stepX, stepY) {
    let x = posX + stepX;
    let y = posY + stepY;

    while (x >= 0 && x < board[0].length && y >= 0 && y < board.length) {
        if (board[y][x] === BOARD_CELL_STATE.OPEN) {
            board[y][x] = BOARD_CELL_STATE.CLOSED;
        }
        x += stepX;
        y += stepY;
    }
}