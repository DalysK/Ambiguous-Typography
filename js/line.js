document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("drawing-board");
  const ctx = canvas.getContext("2d");

  // Resize canvas to fit its parent container
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;

  let isDrawing = false;
  let strokeColor = "#000000";
  let strokeWidth = 2;
  let strokeStyle = "solid"; // or "dashed"

  // Start drawing
  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  });

  // Draw while moving mouse
  canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;
    if (strokeStyle === "dashed") {
      ctx.setLineDash([10, 5]); // dashed
    } else {
      ctx.setLineDash([]); // solid
    }
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColor;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  });

  // Stop drawing
  canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    ctx.closePath();
  });

  canvas.addEventListener("mouseleave", () => {
    isDrawing = false;
    ctx.closePath();
  });

  // Handle color picker
  const colorPicker = document.getElementById("color-picker");
  colorPicker.addEventListener("input", (e) => {
    strokeColor = e.target.value;
  });

  // Handle stroke width and dashed/solid
  const strokes = document.querySelectorAll(".stroke-setting path");
  strokes.forEach((path, index) => {
    path.style.cursor = "pointer";
    path.addEventListener("click", () => {
      // You can customize this logic based on which stroke is which
      strokeWidth = path.getAttribute("stroke-width");

      // Use first path as dashed, others as solid
      if (index === 0) {
        strokeStyle = "dashed";
      } else {
        strokeStyle = "solid";
      }

      console.log("Stroke updated:", strokeWidth, strokeStyle);
    });
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
