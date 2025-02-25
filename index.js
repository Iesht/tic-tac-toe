const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

let field;
let currentPlayer;

startGame();
addResetListener();

function startGame () {
    field = [
        [EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY],
    ];
    currentPlayer = CROSS;
    renderGrid(3);
}
function checkWin () {
    const size = field.length;

    for (let i = 0; i < size; i++) {
        if (field[i][0] !== EMPTY && field[i].every(val => val === field[i][0])) {
            highlightWinningCells(i, 0, i, size - 1);
            alert(`Победил ${field[i][0]}!`);
            return true;
        }
    }

    for (let j = 0; j < size; j++) {
        if (field[0][j] !== EMPTY && field.every(row => row[j] === field[0][j])) {
            highlightWinningCells(0, j, size - 1, j);
            alert(`Победил ${field[0][j]}!`);
            return true;
        }
    }

    if (field[0][0] !== EMPTY && field.every((row, i) => row[i] === field[0][0])) {
        highlightWinningCells(0, 0, size - 1, size - 1);
        alert(`Победил ${field[0][0]}!`);
        return true;
    }
    
    if (field[0][size - 1] !== EMPTY && field.every((row, i) => row[size - 1 - i] === field[0][size - 1])) {
        highlightWinningCells(0, size - 1, size - 1, 0);
        alert(`Победил ${field[0][size - 1]}!`);
        return true;
    }

    return false;
}
function highlightWinningCells (startRow, startCol, endRow, endCol) {
    if (startRow === endRow) {
        for (let i = startCol; i <= endCol; i++) {
            renderSymbolInCell(field[startRow][i], startRow, i, 'red');
        }
    } else if (startCol === endCol) {
        for (let i = startRow; i <= endRow; i++) {
            renderSymbolInCell(field[i][startCol], i, startCol, 'red');
        }
    } else if (startRow === startCol && endRow === endCol) {
        for (let i = 0; i <= endRow; i++) {
            renderSymbolInCell(field[i][i], i, i, 'red');
        }
    } else {
        for (let i = 0; i <= endRow; i++) {
            renderSymbolInCell(field[i][endCol - i], i, endCol - i, 'red');
        }
    }
}
function renderGrid (dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function cellClickHandler (row, col) {
    // Пиши код тут
    if (field[row][col] !== EMPTY) return;  // Если поле, по которому кликнули, не пустое, символ ставиться не должен.
    console.log(`Clicked on cell: ${row}, ${col}`);

    field[row][col] = currentPlayer;
    renderSymbolInCell(currentPlayer, row, col);

    if (field.flat.every(c => c !== EMPTY)) {
        alert("Победила дружба");
        return;
    }

    currentPlayer = currentPlayer === CROSS ? ZERO : CROSS;

    /* Пользоваться методом для размещения символа в клетке так:
        renderSymbolInCell(ZERO, row, col);
     */
}

function renderSymbolInCell (symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell (row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener () {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler () {
    console.log('reset!');
}


/* Test Function */
/* Победа первого игрока */
function testWin () {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw () {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell (row, col) {
    findCell(row, col).click();
}
