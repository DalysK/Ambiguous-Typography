document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("grid-container-tetris");

  const COLS = 10;
  const ROWS = 20;

   grid.style.display = "grid";
  grid.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${ROWS}, 1fr)`;

  for (let i = 0; i < COLS * ROWS; i++) {
    const cell = document.createElement("div");
    cell.classList.add("grid-cell");
    grid.appendChild(cell);
  }
 const shapeData = {
    I: [[1], [1], [1], [1]],
    L: [[1, 0], [1, 0], [1, 1]],
    O: [[1, 1], [1, 1]],
    T: [[1, 1, 1], [0, 1, 0]],
    Z: [[1, 1, 0], [0, 1, 1]],
  };

    function getRandomShape() {
    const keys = Object.keys(shapeData);
    const random = keys[Math.floor(Math.random() * keys.length)];
    return shapeData[random];
  }

  let currentRow = 1;
  let currentCol = 4;
  const shapeMatrix = getRandomShape();
  const fallingBlocks = [];

  function drawShape(matrix, row, col) {
    matrix.forEach((r, rIdx) => {
      r.forEach((cell, cIdx) => {
        if (cell === 1) {
          const block = document.createElement("div");
          block.classList.add("block", "falling-shape");
          block.style.gridRowStart = row + rIdx;
          block.style.gridColumnStart = col + cIdx;
          grid.appendChild(block);
          fallingBlocks.push(block);
        }
      });
    });
  }

  function moveDown() {
    if (currentRow + shapeMatrix.length >= ROWS) {
      lockShape();
      return;
    }

    currentRow++;
    updateShapePosition();
  }

  function updateShapePosition() {
    // Just move each block down by +1 row
    fallingBlocks.forEach(block => {
      const currentRow = parseInt(block.style.gridRowStart);
      block.style.gridRowStart = currentRow + 1;
    });
  }

  function lockShape() {
    fallingBlocks.forEach(block => {
      block.classList.remove("falling-shape");
    });
    // Stop dropping — no auto-spawn for now
    clearInterval(fallInterval);
  }

  drawShape(shapeMatrix, currentRow, currentCol);
  const fallInterval = setInterval(moveDown, 400);

  // Color picker applies only to current falling shape
  document.getElementById("color-picker").addEventListener("input", (e) => {
    const color = e.target.value;
    document.querySelectorAll(".falling-shape").forEach(block => {
      block.style.backgroundColor = color;
    });
  });
});


