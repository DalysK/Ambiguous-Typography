document.addEventListener("DOMContentLoaded", function () {
    /*** GRID SYSTEM ***/
    const gridContainer = document.querySelector(".grid-container");
    const scaleSlider = document.getElementById("scale-slider");
    let gridSize = 30; // Default grid size

    function updateGrid() {
        const containerWidth = gridContainer.clientWidth;
        const containerHeight = gridContainer.clientHeight;
        const cols = Math.floor(containerWidth / gridSize);
        const rows = Math.floor(containerHeight / gridSize);
        
        gridContainer.style.display = "grid"; 
        gridContainer.style.gridTemplateColumns = `repeat(${cols}, ${gridSize}px)`;
        gridContainer.style.gridTemplateRows = `repeat(${rows}, ${gridSize}px)`;
        
       // Preserve existing elements and only update the grid
    if (gridContainer.childNodes.length !== rows * cols) {
        gridContainer.innerHTML = ""; // Clear only if the grid size changes
        for (let i = 0; i < rows * cols; i++) {
            const gridItem = document.createElement("div");
            gridItem.classList.add("grid-item");
            gridItem.style.border = "1px solid #ccc"; // Ensure grid visibility
            gridContainer.appendChild(gridItem);
        }
    }
}

    scaleSlider.addEventListener("input", function () {
        gridSize = parseInt(this.value);
        updateGrid();
    });

    updateGrid(); // Initialize grid

    /*** DRAG-AND-DROP SYSTEM ***/
    let activeShape = null;
    let offsetX, offsetY;

    document.querySelectorAll(".puzzle-shape img").forEach(shape => {
        shape.addEventListener("touchstart", startDrag);
        shape.addEventListener("mousedown", startDrag);
    });

    function startDrag(event) {
    event.preventDefault();

    const isTouch = event.type.startsWith("touch");
    const touch = isTouch ? event.touches[0] : event;

    const playArea = document.querySelector(".playarea-large");
    const playAreaRect = playArea.getBoundingClientRect();    

    if (!event.target.classList.contains("placed-shape")) {
        // Clone new shape
        activeShape = event.target.cloneNode(true);
        activeShape.classList.add("placed-shape");

        // Ensure it's placed in the correct container
        playArea.appendChild(activeShape);

        // Keep original size
        activeShape.style.width = event.target.clientWidth + "px";
        activeShape.style.height = event.target.clientHeight + "px";

        // Set absolute positioning relative to playarea
        activeShape.style.position = "absolute";
        activeShape.style.zIndex = "1000"; // Make sure it's on top


        // FIX: Position it inside the play area at the exact click location
        const clickX = touch.clientX - playArea.getBoundingClientRect().left;
        const clickY = touch.clientY - playArea.getBoundingClientRect().top;
        activeShape.style.left = `${clickX}px`;
        activeShape.style.top = `${clickY}px`;

        offsetX = 0; // Reset offset
        offsetY = 0;
    } else {
        // Move existing shape
        activeShape = event.target;
        const shapeRect = activeShape.getBoundingClientRect();
        offsetX = touch.clientX - rect.left;
        offsetY = touch.clientY - rect.top;
    }

    moveShape(event); // Position shape immediately

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

    // Calculate new position based on cursor movement
    let newX = touch.clientX - playArea.left - offsetX;
    let newY = touch.clientY - playArea.top - offsetY;

    // Keep shape inside playarea boundaries
    newX = Math.max(0, Math.min(playArea.width - shapeRect.width, newX));
    newY = Math.max(0, Math.min(playArea.height - shapeRect.height, newY));

    // Apply new position
    activeShape.style.left = `${newX}px`;
    activeShape.style.top = `${newY}px`;
}


    function dropShape(event) {
        if (!activeShape) return;

        document.removeEventListener("mousemove", moveShape);
        document.removeEventListener("mouseup", dropShape);
        document.removeEventListener("touchmove", moveShape);
        document.removeEventListener("touchend", dropShape);
        activeShape.addEventListener("mousedown", startDrag);
        activeShape.addEventListener("touchstart", startDrag);


        activeShape = null;
    }

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
