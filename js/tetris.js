document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("playarea-canvas");
  const ctx = canvas.getContext("2d");

  const COLS = 12;
  const ROWS = 20;
  const BLOCK_SIZE = 30; // size of each square

  canvas.width = COLS * BLOCK_SIZE;
  canvas.height = ROWS * BLOCK_SIZE;

  let filledCells = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

  const shapeData = {
    I: [[1], [1], [1], [1]],
    L: [[1, 0], [1, 0], [1, 1]],
    O: [[1, 1], [1, 1]],
    T: [[1, 1, 1], [0, 1, 0]],
    Z: [[1, 1, 0], [0, 1, 1]],
  };

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
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw placed blocks
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (filledCells[r][c]) {
          ctx.fillStyle = "#969696";
          ctx.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          ctx.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
      }
    }

    // Draw falling shape
    ctx.fillStyle = "#969696";
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
        if (cell) {
          filledCells[currentRow + rIdx][currentCol + cIdx] = 1;
        }
      });
    });

    currentRow = 0;
    currentCol = 4;
    currentShape = getRandomShape();
    drawGrid();
  }

  function togglePause() {
    paused = !paused;
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

  fallInterval = setInterval(moveDown, 500);


  // Color picker applies only to current falling shape
  document.getElementById("color-picker").addEventListener("input", (e) => {
    const color = e.target.value;
    document.querySelectorAll(".falling-shape").forEach(block => {
      block.style.backgroundColor = color;
    });
  });

const promptText = document.querySelector(".prompt-text");

function getRandomPrompt() {
  const index = Math.floor(Math.random() * prompts.length);
  return prompts[index];
}

function updatePrompt() {
  const newPrompt = getRandomPrompt();
  promptText.textContent = `Prompt: ${newPrompt}`;
}

// Show a prompt immediately when the game loads
updatePrompt();

// Change prompt on reset
const resetBtn = document.getElementById("reset");
if (resetBtn) {
  resetBtn.addEventListener("click", updatePrompt);
}

// Change prompt on save
const saveBtn = document.getElementById("save");
if (saveBtn) {
  saveBtn.addEventListener("click", updatePrompt);
}

// Change prompt on restart icon click
const restartBtn = document.querySelector(".restart-btn");
if (restartBtn) {
  restartBtn.addEventListener("click", updatePrompt);
}
function fixViewportHeight() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
window.addEventListener('load', fixViewportHeight);
window.addEventListener('resize', fixViewportHeight);

  
});


