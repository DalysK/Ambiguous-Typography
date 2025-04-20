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
  const container = document.getElementById("grid-container-tetris");
  const containerHeight = container.offsetHeight;

  const interval = setInterval(() => {
    y += 5;
    shape.style.transform = `translate(-50%, ${y}px)`;

    if (y + shape.offsetHeight >= containerHeight) {
      clearInterval(interval);
      shape.classList.remove("falling-shape");
      shape.classList.add("placed-shape");
      shape.style.transform = `translate(-50%, ${containerHeight - shape.offsetHeight}px)`;
    }
  }, 30);
}
dropNewShape();


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


