document.addEventListener("DOMContentLoaded", function () {
    /*** GRID SYSTEM ***/
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
        gridContainer.innerHTML = ""; // Clear grid

        for (let i = 0; i < rows * cols; i++) {
            const gridItem = document.createElement("div");
            gridItem.classList.add("grid-item");
            gridContainer.appendChild(gridItem);
        }
    }

    scaleSlider.addEventListener("input", function () {
        gridSize = parseInt(this.value);
        updateGrid();
    });

    updateGrid(); // Initialize grid

    /*** DRAG-AND-DROP SYSTEM ***/
    // DRAG-AND-DROP SYSTEM FOR TOUCH & DESKTOP

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

        // Get play area and shape bounds
        const playArea = document.querySelector(".playarea-large").getBoundingClientRect();
        const shapeRect = activeShape.getBoundingClientRect();

        // If shape is outside the play area, remove it
        if (
            shapeRect.left < playArea.left ||
            shapeRect.right > playArea.right ||
            shapeRect.top < playArea.top ||
            shapeRect.bottom > playArea.bottom
        ) {
            activeShape.remove();
        }

        // Remove event listeners when shape is dropped
        document.removeEventListener("mousemove", moveShape);
        document.removeEventListener("mouseup", dropShape);
        document.removeEventListener("touchmove", moveShape);
        document.removeEventListener("touchend", dropShape);

        activeShape = null; // Reset active shape
    }
});


    /*** SHAPE TRANSFORMATIONS ***/
    let selectedShape = null;

    document.querySelector(".playarea-large").addEventListener("click", function (event) {
        if (event.target.tagName === "IMG") {
            selectedShape = event.target;
        }
    });

    // Rotate Shape
    document.querySelector(".setting-button img[src*='rotate_right']").addEventListener("click", function () {
        if (selectedShape) {
            let currentRotation = selectedShape.style.transform.match(/rotate\((\d+)deg\)/);
            let newRotation = currentRotation ? parseInt(currentRotation[1]) + 90 : 90;
            selectedShape.style.transform = `rotate(${newRotation}deg)`;
        }
    });

    // Flip Shape
    document.querySelector(".setting-button img[src*='flip']").addEventListener("click", function () {
        if (selectedShape) {
            let flip = selectedShape.style.transform.includes("scaleX(-1)") ? "scaleX(1)" : "scaleX(-1)";
            selectedShape.style.transform += ` ${flip}`;
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

    /*** COLOR CHANGE FOR SVG SHAPES ***/
    document.querySelectorAll(".color-option").forEach(colorOption => {
        colorOption.addEventListener("click", function () {
            if (selectedShape) {
                let color = this.dataset.color;
                selectedShape.style.filter = `invert(1) sepia(1) saturate(10000%) hue-rotate(${Math.random() * 360}deg) brightness(1.2)`;
            }
        });
    });

    /*** RESET BUTTON (Clears All Placed Shapes) ***/
    document.getElementById("reset").addEventListener("click", function () {
        document.querySelectorAll(".playarea-large .placed-shape").forEach(shape => shape.remove());
        selectedShape = null;
    });

});
