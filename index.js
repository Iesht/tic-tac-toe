const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');
const sizeInput = document.getElementById('sizeInput');
const startButton = document.getElementById('startButton');

let field;
let currentPlayer;
let gameOver = false;
let size = 3;

startGame();
addResetListener();

startButton.addEventListener('click', () => {
  const newSize = parseInt(sizeInput.value, 10);
  if (newSize >= 3 && newSize <= 10) {
    size = newSize;
    startGame();
  } else {
    alert('Размер поля от 3 до 10!!!!!!!!!!!!!!!!')
  }
});

function startGame() {
  field = Array.from({ length: size }, () => Array(size).fill(EMPTY));
  currentPlayer = CROSS;
  gameOver = false;
  renderGrid(size);
}

function checkWin() {
  // const size = field.length;
  const lines = [];

  for (let i = 0; i < size; i++) {
    lines.push(field[i].map((_, j) => [i, j])); // строки
    lines.push(field.map((_, j) => [j, i])); // столбцы
  }

  lines.push(field.map((_, i) => [i, i])); // главная диагональ
  lines.push(field.map((_, i) => [i, size - 1 - i])); // побочная диагональ

  for (const cells of lines) {
    const [r1, c1] = cells[0];
    if (field[r1][c1] !== EMPTY && cells.every(([r, c]) => field[r][c] === field[r1][c1])) {
      return { winner: field[r1][c1], cells };
    }
  }

  return null;
}

function highlightWinningCells(cells) {
  cells.forEach(([row, col]) => renderSymbolInCell(field[row][col], row, col, 'red'));
}

function renderGrid(dimension) {
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

function cellClickHandler(row, col) {
  if (gameOver || field[row][col] !== EMPTY) return;  // Если поле, по которому кликнули, не пустое, символ ставиться не должен.
  console.log(`Clicked on cell: ${row}, ${col}`);

  field[row][col] = currentPlayer;
  renderSymbolInCell(currentPlayer, row, col);

  if (checkGameState()) return;

  if (currentPlayer === ZERO) {
    setTimeout(computerMove, 200);
  }
}

function renderSymbolInCell(symbol, row, col, color = '#333') {
  const targetCell = findCell(row, col);

  targetCell.textContent = symbol;
  targetCell.style.color = color;
}

function findCell(row, col) {
  const targetRow = container.querySelectorAll('tr')[row];
  return targetRow.querySelectorAll('td')[col];
}

function addResetListener() {
  const resetButton = document.getElementById('reset');
  resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler() {
  console.log('reset!');
  startGame();
}

function checkGameState() {
  const result = checkWin();
  if (result) {
    gameOver = true;
    highlightWinningCells(result.cells);
    setTimeout(() => alert(`Победил ${result.winner}!`), 10);
    return true;
  }

  if (field.flat().every(c => c !== EMPTY)) {
    gameOver = true;
    setTimeout(() => alert("Победила дружба"), 10);
    return true;
  }

  currentPlayer = currentPlayer === CROSS ? ZERO : CROSS;
  return false;
}

/* Test Function */

/* Победа первого игрока */
function testWin() {
  clickOnCell(0, 2);
  clickOnCell(0, 0);
  clickOnCell(2, 0);
  clickOnCell(1, 1);
  clickOnCell(2, 2);
  clickOnCell(1, 2);
  clickOnCell(2, 1);
}

/* Ничья */
function testDraw() {
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

function clickOnCell(row, col) {
  findCell(row, col).click()
}

function computerMove() {
  const emptyCells = [];
  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      if (field[i][j] === EMPTY) {
        emptyCells.push({row: i, col: j});
      }
    }
  }

  if (emptyCells.length === 0 || gameOver) return;

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const {row, col} = emptyCells[randomIndex];
  field[row][col] = ZERO;
  renderSymbolInCell(ZERO, row, col);
  checkGameState();
}

document.getElementById('resetButton').addEventListener('click', startGame);

// testDraw();
// testWin();