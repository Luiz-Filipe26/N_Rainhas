function create2DArray(width, height, defaultValue) {
    return new Array(width).fill(null).map(() => new Array(height).fill(defaultValue));
}

function copy2DArray(array) {
    return array.map(row => [...row]);
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

    const board = create2DArray(width, height, '_');

    for (let i = 0; i < queens; i++) {
        const randomWidth = Math.random() * (width - 1);
        const randomHeight = Math.random() * (height - 1);

    }
});

function findBestPosition(board) {
    let minInvalidCells = Number.MAX_VALUE;
    let bestBoard = null;

    for (boardColumn of boardCopy) {

        for (boardCell of boardColumn) {
            const {newBoard, invalidCells} = testPosition(board, boardColumn, boardCell);
            if(invalidCells < minInvalidCells) {
                minInvalidCells = invalidCells;
                bestBoard = newBoard;
            }
        }
    }

    return {numOfInvalidCells: minInvalidCells, bestBoard: bestBoard};
}

function testPosition(board, x, y) {
    const boardCopy = copy2DArray(board);
    let invalidCells = 0;

    for(let i=0; i<board.length; i++) {
        for(let j=0; j<board[i].length; j++) {
            if(boardCopy[i][j] == 'X') {
                invalidCells++;
            }
            else if(i - x == 0 || j - y == 0 || i - x == j - y) {
                boardCopy[i][j] = 'X';
                invalidCells++;
            }
        }
    }
}