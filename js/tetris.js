document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("playarea-canvas");
  const ctx = canvas.getContext("2d");

  const COLS = 12;
  const ROWS = 20;
  const BLOCK_SIZE = 30; // each block size

  canvas.width = COLS * BLOCK_SIZE;
  canvas.height = ROWS * BLOCK_SIZE;

  let filledCells = Array.from({ length: ROWS }, () => Array(COLS).fill(null));

  const shapeData = {
    I: [[1], [1], [1], [1]],
    L: [[1, 0], [1, 0], [1, 1]],
    O: [[1, 1], [1, 1]],
    T: [[1, 1, 1], [0, 1, 0]],
    Z: [[1, 1, 0], [0, 1, 1]],
  };

  let defaultColor = "#969696"; // Default grey color
  let currentColor = defaultColor;

  let currentShape = getRandomShape();
  let currentRow = 0;
  let currentCol = 4;
  let fallInterval;
  let paused = false;

  function getRandomShape() {
    const keys = Object.keys(shapeData);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return shapeData[randomKey];
  }

  function drawGrid() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw placed blocks
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (filledCells[r][c]) {
          ctx.fillStyle = filledCells[r][c];
          ctx.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          ctx.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
      }
    }

    // Draw falling shape
    ctx.fillStyle = currentColor;
    currentShape.forEach((row, rIdx) => {
      row.forEach((cell, cIdx) => {
        if (cell === 1) {
          ctx.fillRect((currentCol + cIdx) * BLOCK_SIZE, (currentRow + rIdx) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          ctx.strokeRect((currentCol + cIdx) * BLOCK_SIZE, (currentRow + rIdx) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
      });
    });
  }

  function moveDown() {
    if (paused) return;

    if (!canMove(0, 1)) {
      lockShape();
      return;
    }

    currentRow++;
    drawGrid();
  }

  function moveLeft() {
    if (paused) return;
    if (canMove(-1, 0)) currentCol--;
    drawGrid();
  }

  function moveRight() {
    if (paused) return;
    if (canMove(1, 0)) currentCol++;
    drawGrid();
  }

  function canMove(dx, dy) {
    for (let r = 0; r < currentShape.length; r++) {
      for (let c = 0; c < currentShape[r].length; c++) {
        if (currentShape[r][c]) {
          const newR = currentRow + r + dy;
          const newC = currentCol + c + dx;
          if (newR >= ROWS || newC < 0 || newC >= COLS || (newR >= 0 && filledCells[newR][newC])) {
            return false;
          }
        }
      }
    }
    return true;
  }

  function lockShape() {
    currentShape.forEach((row, rIdx) => {
      row.forEach((cell, cIdx) => {
        if (cell === 1) {
          filledCells[currentRow + rIdx][currentCol + cIdx] = currentColor;
        }
      });
    });

    currentRow = 0;
    currentCol = 4;
    currentShape = getRandomShape();
    currentColor = defaultColor;
    drawGrid();
  }

  function rotateShape() {
    const rows = currentShape.length;
    const cols = currentShape[0].length;
    const rotated = [];

    for (let c = 0; c < cols; c++) {
      rotated[c] = [];
      for (let r = rows - 1; r >= 0; r--) {
        rotated[c][rows - 1 - r] = currentShape[r][c];
      }
    }

    currentShape = rotated;
  }

  function togglePause() {
    paused = !paused;
  }

  function resetGame() {
    filledCells = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    currentRow = 0;
    currentCol = 4;
    currentShape = getRandomShape();
    currentColor = defaultColor;
    drawGrid();
  }

  function saveCanvas() {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext("2d");

    tempCtx.fillStyle = "white";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvas, 0, 0);

    const link = document.createElement("a");
    link.download = "my_tetris_creation.png";
    link.href = tempCanvas.toDataURL();
    link.click();
  }

  // Button listeners
  document.getElementById("move-left").addEventListener("click", moveLeft);
  document.getElementById("move-right").addEventListener("click", moveRight);
  document.getElementById("move-down").addEventListener("click", moveDown);
  document.getElementById("rotate").addEventListener("click", () => {
    if (paused) return;
    rotateShape();
    drawGrid();
  });
  document.getElementById("pause-btn").addEventListener("click", togglePause);
  document.getElementById("reset").addEventListener("click", resetGame);
  document.getElementById("save").addEventListener("click", saveCanvas);

  document.getElementById("color-picker").addEventListener("input", (e) => {
    currentColor = e.target.value;
  });

  fallInterval = setInterval(moveDown, 500);
});
