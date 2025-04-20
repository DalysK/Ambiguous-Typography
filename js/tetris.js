document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("grid-container-tetris");

  const COLS = 10;
  const ROWS = 20;

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
    const types = Object.keys(shapeData);
    const type = types[Math.floor(Math.random() * types.length)];
    return shapeData[type];
  }
function drawShape(matrix, startRow = 1, startCol = 4) {
    matrix.forEach((row, rIdx) => {
      row.forEach((cell, cIdx) => {
        if (cell === 1) {
          const block = document.createElement("div");
          block.classList.add("block", "falling-shape");
          block.style.gridRowStart = startRow + rIdx;
          block.style.gridColumnStart = startCol + cIdx;
          grid.appendChild(block);
        }
      });
    });
  }
const newShape = getRandomShape();
  drawShape(newShape);
  
 document.getElementById("color-picker").addEventListener("input", (e) => {
  const color = e.target.value;
  const shape = document.querySelector(".falling-shape");
  if (!shape) return;

  const svg = shape.querySelector("svg");
  if (!svg) return;

  const paths = svg.querySelectorAll("path, rect, circle, polygon");
  paths.forEach(p => p.setAttribute("fill", color));
});

  
});


