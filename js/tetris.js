document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("grid-container-tetris");

  const COLS = 10;
  const ROWS = 20;

  for (let i = 0; i < COLS * ROWS; i++) {
    const cell = document.createElement("div");
    cell.classList.add("grid-cell");
    grid.appendChild(cell);
  }
const shapes = ["I", "L", "O", "T", "Z"];

function getRandomShape() {
  const type = shapes[Math.floor(Math.random() * shapes.length)];
  const template = document.getElementById(`shape-${type}`);
  return template.content.firstElementChild.cloneNode(true);
}

  function dropNewShape() {
  const shape = getRandomShape();
  shape.classList.add("falling-shape");
  document.getElementById("grid-container-tetris").appendChild(shape);

  let y = 0;
  const interval = setInterval(() => {
    y += 10;
    shape.style.transform = `translateY(${y}px)`;
    // Stop when hits bottom
    if (y >= 400) clearInterval(interval);
  }, 100);
}

  document.getElementById("color-picker").addEventListener("input", (e) => {
  const color = e.target.value;
  const selected = document.querySelector(".falling-shape.selected");
  if (selected) {
    selected.querySelector("svg path").setAttribute("fill", color);
  }
});

  
});


