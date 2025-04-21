document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("grid-container-tetris");

  const COLS = 16;
  const ROWS = 24;

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
const nextShapeBox = document.getElementById("next-shape-tetris");

function updateNextShapePreview(shapeType) {
  nextShapeBox.innerHTML = ""; 
  shapeType.forEach((row, rIdx) => {
    row.forEach((cell, cIdx) => {
      if (cell === 1) {
        const block = document.createElement("div");
        block.classList.add("preview-shape");
        block.style.gridRowStart = rIdx + 1;
        block.style.gridColumnStart = cIdx + 1;
        nextShapeBox.appendChild(block);
      }
    });
  });
}

  let currentRow = 1;
  let currentCol = 4;
let nextShape = getRandomShape();
let shapeMatrix = nextShape;
nextShape = getRandomShape();
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
drawShape(shapeMatrix, currentRow, currentCol);
updateNextShapePreview(nextShape);
const fallInterval = setInterval(moveDown, 400);


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

  currentRow = 1;
  currentCol = 4;
  shapeMatrix = nextShape;
  nextShape = getRandomShape();
  fallingBlocks.length = 0;
  drawShape(shapeMatrix, currentRow, currentCol);
  updateNextShapePreview(nextShape); 
}


function moveShape(dx, dy) {
  currentRow += dy;
  currentCol += dx;
  fallingBlocks.forEach(block => {
    const currentRowPos = parseInt(block.style.gridRowStart);
    const currentColPos = parseInt(block.style.gridColumnStart);
    block.style.gridRowStart = currentRowPos + dy;
    block.style.gridColumnStart = currentColPos + dx;
  });
}
document.querySelector('img[src*="arrow_circle_left"]').addEventListener("click", () => {
  moveShape(-1, 0);
});

document.querySelector('img[src*="arrow_circle_right"]').addEventListener("click", () => {
  moveShape(1, 0);
});

document.querySelector('img[src*="arrow_circle_down"]').addEventListener("click", () => {
  moveShape(0, 1);
});

  // Color picker applies only to current falling shape
  document.getElementById("color-picker").addEventListener("input", (e) => {
    const color = e.target.value;
    document.querySelectorAll(".falling-shape").forEach(block => {
      block.style.backgroundColor = color;
    });
  });
});


