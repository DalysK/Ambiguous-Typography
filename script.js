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


//new test
// Drag-and-Drop for iPad & Desktop
let activeShape = null;
let offsetX, offsetY;

document.querySelectorAll(".puzzle-shape img").forEach(shape => {
    shape.addEventListener("touchstart", startDrag);
    shape.addEventListener("mousedown", startDrag);
});

function startDrag(event) {
    event.preventDefault();

    // Check if dragging an existing placed shape or a new one
    if (event.target.classList.contains("placed-shape")) {
        activeShape = event.target; // Select the existing shape
    } else {
        activeShape = event.target.cloneNode(true);
        activeShape.classList.add("placed-shape");
        document.querySelector(".playarea-large").appendChild(activeShape);
    }

    let x = event.touches ? event.touches[0].clientX : event.clientX;
    let y = event.touches ? event.touches[0].clientY : event.clientY;

    // Get offsets to ensure smooth movement
    offsetX = x - activeShape.getBoundingClientRect().left;
    offsetY = y - activeShape.getBoundingClientRect().top;

    // Set absolute positioning
    activeShape.style.position = "absolute";
    activeShape.style.left = `${x - offsetX}px`;
    activeShape.style.top = `${y - offsetY}px`;

    // Add event listeners for movement
    document.addEventListener("mousemove", moveShape);
    document.addEventListener("mouseup", dropShape);
    document.addEventListener("touchmove", moveShape);
    document.addEventListener("touchend", dropShape);
}

function moveShape(event) {
    event.preventDefault();

    if (!activeShape) return;

    let x = event.touches ? event.touches[0].clientX : event.clientX;
    let y = event.touches ? event.touches[0].clientY : event.clientY;

    // Prevent dragging outside play area
    const playArea = document.querySelector(".playarea-large").getBoundingClientRect();
    const shapeRect = activeShape.getBoundingClientRect();

    if (
        x - offsetX >= playArea.left &&
        x - offsetX + shapeRect.width <= playArea.right &&
        y - offsetY >= playArea.top &&
        y - offsetY + shapeRect.height <= playArea.bottom
    ) {
        activeShape.style.left = `${x - offsetX}px`;
        activeShape.style.top = `${y - offsetY}px`;
    }
}

function dropShape(event) {
    if (!activeShape) return;

    // Remove event listeners when shape is dropped
    document.removeEventListener("mousemove", moveShape);
    document.removeEventListener("mouseup", dropShape);
    document.removeEventListener("touchmove", moveShape);
    document.removeEventListener("touchend", dropShape);

    activeShape = null; // Reset active shape
}



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
