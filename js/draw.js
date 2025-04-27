document.addEventListener("DOMContentLoaded", function () {
const canvas = document.getElementById("drawing-board");
const ctx = canvas.getContext("2d");

// Resize canvas to fit its parent container
  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

let isDrawing = false;
let strokeColor = "#000000";
let strokeWidth = 2;
let strokeStyle = "solid";

// Helper draw function
function drawLine(x, y) {
  if (strokeStyle === "dashed") {
    ctx.setLineDash([10, 5]);
  } else {
    ctx.setLineDash([]);
  }
  ctx.lineWidth = strokeWidth;
  ctx.strokeStyle = strokeColor;
  ctx.lineTo(x, y);
  ctx.stroke();
}


// --- Mouse events ---
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;
  drawLine(e.offsetX, e.offsetY);
});

canvas.addEventListener("mouseup", () => {
  isDrawing = false;
  ctx.closePath();
});

// --- Touch events ---
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  isDrawing = true;
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  ctx.beginPath();
  ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
}, { passive: false });

canvas.addEventListener("touchmove", (e) => {
  if (!isDrawing) return;
  e.preventDefault();
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  drawLine(touch.clientX - rect.left, touch.clientY - rect.top);
}, { passive: false });

canvas.addEventListener("touchend", () => {
  isDrawing = false;
  ctx.closePath();
});


  // Handle color picker
  const colorPicker = document.getElementById("color-picker");
  colorPicker.addEventListener("input", (e) => {
    strokeColor = e.target.value;
  });

  // Handle stroke width and dashed/solid
 const strokes = document.querySelectorAll(".stroke-option");

strokes.forEach(option => {
  option.style.cursor = "pointer";

  // Shared logic for click and touch
  function selectStroke() {
    // Remove checkmark from all
    strokes.forEach(o => o.querySelector(".checkmark").textContent = "");

    // Add checkmark to this one
    option.querySelector(".checkmark").textContent = "✔";

    // Update stroke settings
    strokeWidth = parseInt(option.getAttribute("data-width"));
    strokeStyle = option.getAttribute("data-style");

    console.log("Stroke updated:", strokeWidth, strokeStyle);
  }

  // Event listeners for both mouse and touch
  option.addEventListener("click", selectStroke);

  option.addEventListener("touchstart", (e) => {
    e.preventDefault(); // prevent double-tap zoom and simulate click
    selectStroke();
  }, { passive: false });
}what);

     const prompts = [
  "Make a letter that feels angry",
  "Use only curves and no straight lines",
  "Create a shape that breaks symmetry",
  "Build a letterform from minimal pieces",
  "Make it feel like it's tipping over",
  "Use negative space creatively",
  "Design something that challenges legibility",
  "Build a soft-looking structure",
  "Stack parts vertically, like a tower",
  "Make it feel like it's in motion"
];

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

  function saveCanvas() {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext("2d");

    tempCtx.fillStyle = "white";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvas, 0, 0);

    const link = document.createElement("a");
    link.download = "ambiguous_typography.png";
    link.href = tempCanvas.toDataURL();
    link.click();
  }
  
  // Reset button
  const resetBtn = document.getElementById("reset");
  resetBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  // Save button 
  const saveBtn = document.getElementById("save");
  saveBtn.addEventListener("click", () => {
    const dataURL = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "drawing.png";
    a.click();
  });
});
