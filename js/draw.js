document.addEventListener("DOMContentLoaded", function () {
const canvas = document.getElementById("drawing-board");
const ctx = canvas.getContext("2d");

// Resize canvas to fit its parent container
canvas.width = canvas.parentElement.clientWidth;
canvas.height = canvas.parentElement.clientHeight;

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
});



  
  // Reset button
  const resetBtn = document.getElementById("reset");
  resetBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  // Save button (optional)
  const saveBtn = document.getElementById("save");
  saveBtn.addEventListener("click", () => {
    const dataURL = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "drawing.png";
    a.click();
  });
});
