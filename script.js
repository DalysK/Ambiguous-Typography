document.addEventListener("DOMContentLoaded", function() {
    const shapesContainer = document.querySelector(".shapes");
    const colors = ["#808080", "#E63946", "#F77F00", "#F4D35E", "#2A9D8F", "#3A86FF", "#264653", "#9B5DE5", "#FF4D6D", "#222222"];

    // Generate Shapes
    const shapeList = ["square", "circle", "triangle"];
    shapeList.forEach(shape => {
        let div = document.createElement("div");
        div.classList.add("shape", shape);
        div.style.backgroundColor = colors[0]; // Default Grey
        div.addEventListener("click", () => changeColor(div));
        shapesContainer.appendChild(div);
    });

    function changeColor(element) {
        let currentColor = element.style.backgroundColor;
        let newColor = colors[(colors.indexOf(currentColor) + 1) % colors.length];
        element.style.backgroundColor = newColor;
    }
});

//grid
//grid
 document.addEventListener("DOMContentLoaded", function() {
     const gridContainer = document.querySelector(".grid-container");
 
     function updateGrid() {
         // Get container size
         const containerWidth = gridContainer.clientWidth;
         const containerHeight = gridContainer.clientHeight;
 
         // Define the **size of each grid cell** (adjust this value if needed)
         const cellSize = 30; // Each grid square is 30px x 30px
 
         // Calculate the number of rows and columns that fit within the container
         const cols = Math.floor(containerWidth / cellSize);
         const rows = Math.floor(containerHeight / cellSize);
 
         // Apply grid size
         gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
         gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
 
         // Clear old grid items before adding new ones
         gridContainer.innerHTML = "";
 
         for (let i = 0; i < rows * cols; i++) {
             const gridItem = document.createElement("div");
             gridItem.classList.add("grid-item");
             gridContainer.appendChild(gridItem);
         }
     }
 
     // Run on page load
     updateGrid();
 
     // Run again when window resizes (to keep grid responsive)
     window.addEventListener("resize", updateGrid);
 });

    // DRAG-AND-DROP SYSTEM
  document.addEventListener("DOMContentLoaded", function () {
    const gridContainer = document.querySelector(".grid-container");
    const scaleSlider = document.getElementById("scale-slider");
    let gridSize = 30; // Default grid cell size

    function updateGrid() {
        const containerWidth = gridContainer.clientWidth;
        const containerHeight = gridContainer.clientHeight;

        const cols = Math.floor(containerWidth / gridSize);
        const rows = Math.floor(containerHeight / gridSize);

        gridContainer.style.gridTemplateColumns = `repeat(${cols}, ${gridSize}px)`;
        gridContainer.style.gridTemplateRows = `repeat(${rows}, ${gridSize}px)`;
    }

    scaleSlider.addEventListener("input", function () {
        gridSize = parseInt(this.value);
        updateGrid();
    });

    updateGrid();

    // Drag-and-Drop for Touch Screens (iPad)
    // DRAG-AND-DROP SYSTEM FOR TOUCH & DESKTOP
document.addEventListener("DOMContentLoaded", function () {
    let activeShape = null;
    let offsetX, offsetY;

    // Allow dragging from small window to play area
    document.querySelectorAll(".puzzle-shape img").forEach(shape => {
        shape.addEventListener("touchstart", startDrag);
        shape.addEventListener("mousedown", startDrag);
    });

    function startDrag(event) {
        event.preventDefault();

        const isTouch = event.type.startsWith("touch");
        const touch = isTouch ? event.touches[0] : event;

        if (event.target.classList.contains("placed-shape")) {
            // Move an existing shape
            activeShape = event.target;
        } else {
            // Create a new shape
            activeShape = event.target.cloneNode(true);
            activeShape.classList.add("placed-shape");
            document.querySelector(".playarea-large").appendChild(activeShape);
        }

        const rect = activeShape.getBoundingClientRect();
        offsetX = touch.clientX - rect.left;
        offsetY = touch.clientY - rect.top;

        activeShape.style.position = "absolute";
        moveShape(event); // Position the shape immediately

        // Attach movement listeners
        document.addEventListener(isTouch ? "touchmove" : "mousemove", moveShape, { passive: false });
        document.addEventListener(isTouch ? "touchend" : "mouseup", dropShape);
    }

    function moveShape(event) {
        event.preventDefault();
        if (!activeShape) return;

        const isTouch = event.type.startsWith("touch");
        const touch = isTouch ? event.touches[0] : event;

        const playArea = document.querySelector(".playarea-large").getBoundingClientRect();
        const shapeRect = activeShape.getBoundingClientRect();

        let newX = touch.clientX - offsetX;
        let newY = touch.clientY - offsetY;

        // Keep shape inside playarea
        if (newX < playArea.left) newX = playArea.left;
        if (newX + shapeRect.width > playArea.right) newX = playArea.right - shapeRect.width;
        if (newY < playArea.top) newY = playArea.top;
        if (newY + shapeRect.height > playArea.bottom) newY = playArea.bottom - shapeRect.height;

        activeShape.style.left = `${newX}px`;
        activeShape.style.top = `${newY}px`;
    }

    function dropShape(event) {
        if (!activeShape) return;

        document.removeEventListener("mousemove", moveShape);
        document.removeEventListener("mouseup", dropShape);
        document.removeEventListener("touchmove", moveShape);
        document.removeEventListener("touchend", dropShape);

        activeShape = null; // Reset active shape
    }
});


    // Select Shape for Transformations
    let selectedShape = null;

    document.querySelector(".playarea-large").addEventListener("click", function (event) {
        if (event.target.tagName === "IMG") {
            selectedShape = event.target;
        }
    });

    // Rotate Shape (90-degree rotation)
    document.querySelector(".setting-button img[src*='rotate_right']").addEventListener("click", function () {
        if (selectedShape) {
            let currentRotation = selectedShape.style.transform.match(/rotate\((\d+)deg\)/);
            let newRotation = currentRotation ? parseInt(currentRotation[1]) + 90 : 90;
            selectedShape.style.transform = `rotate(${newRotation}deg)`;
        }
    });

    // Flip Shape (Horizontal & Vertical)
    document.querySelector(".setting-button img[src*='flip']").addEventListener("click", function () {
        if (selectedShape) {
            let currentScale = selectedShape.style.transform.match(/scaleX\((-?1)\)/);
            let newScale = currentScale ? -parseInt(currentScale[1]) : -1;
            selectedShape.style.transform += ` scaleX(${newScale})`;
        }
    });

    // Resize Shape (+ / - Buttons)
    document.querySelector(".setting-button img[src*='plus']").addEventListener("click", function () {
        if (selectedShape) {
            let currentSize = parseInt(selectedShape.style.width || 80);
            selectedShape.style.width = `${currentSize + 10}px`;
        }
    });

    document.querySelector(".setting-button img[src*='minus']").addEventListener("click", function () {
        if (selectedShape) {
            let currentSize = parseInt(selectedShape.style.width || 80);
            selectedShape.style.width = `${Math.max(10, currentSize - 10)}px`;
        }
    });

    // Change Shape Color
    document.querySelectorAll(".color-option").forEach(colorOption => {
        colorOption.addEventListener("click", function () {
            if (selectedShape) {
                let color = this.dataset.color;
                selectedShape.style.filter = `invert(1) sepia(1) saturate(10000%) hue-rotate(${Math.random() * 360}deg) brightness(1.2)`;
            }
        });
    });
});
