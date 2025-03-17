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
    let offsetX = 0, offsetY = 0;

    // Select all shapes in the small popup window
 
    const shapeElements = document.querySelectorAll(".puzzle-shape img");

    if (shapeElements.length === 0) {
        console.error("No shapes found! Check your selector.");
    }

    shapeElements.forEach(shape => {
        shape.addEventListener("click", function (event) {
            console.log("Shape clicked:", event.target); // Debugging check
            addShapeToPlayArea(this);
        });
    });


    function addShapeToPlayArea(originalShape) {
        const playArea = document.querySelector(".playarea-large");

        // Clone the clicked shape
        let newShape = originalShape.cloneNode(true);
        newShape.classList.add("placed-shape");
        newShape.style.position = "absolute";
        newShape.style.width = originalShape.clientWidth + "px"; 
        newShape.style.height = "auto"; 
        newShape.style.cursor = "grab"; // Indicate it's draggable

        // Get play area size
        const playAreaRect = playArea.getBoundingClientRect();

        // Correct position relative to the play area
        newShape.style.left = `${playArea.clientWidth / 2 - originalShape.clientWidth / 2}px`;
        newShape.style.top = `${playArea.clientHeight / 2 - originalShape.clientHeight / 2}px`;

        // Add the shape to the play area
        playArea.appendChild(newShape);

        // Make the shape draggable
        newShape.addEventListener("mousedown", startDrag);
        newShape.addEventListener("touchstart", startDrag);
    }

    function startDrag(event) {
        event.preventDefault();
        activeShape = event.target;

        const isTouch = event.type.startsWith("touch");
        const touch = isTouch ? event.touches[0] : event;

        const playArea = document.querySelector(".playarea-large");
        const playAreaRect = playArea.getBoundingClientRect();
        const shapeRect = activeShape.getBoundingClientRect();
        
        console.log("Clicked shape:", activeShape, "Shape position:", activeShape.getBoundingClientRect());
        console.log("Mouse position:", touch.clientX, touch.clientY);
        console.log("Play area:", playAreaRect);

        // Fix offset calculation (relative to the play area)
        offsetX = touch.clientX - shapeRect.left + playAreaRect.left;
        offsetY = touch.clientY - shapeRect.top + playAreaRect.top;

        document.addEventListener(isTouch ? "touchmove" : "mousemove", moveShape, { passive: false });
        document.addEventListener(isTouch ? "touchend" : "mouseup", dropShape);
    }

    function moveShape(event) {
        event.preventDefault();
        if (!activeShape) return;

        const isTouch = event.type.startsWith("touch");
        const touch = isTouch ? event.touches[0] : event;

        const playArea = document.querySelector(".playarea-large");
        const playAreaRect = playArea.getBoundingClientRect();     
        
        // Calculate new position (inside play area)
        let newX = touch.clientX - offsetX - playAreaRect.left;
        let newY = touch.clientY - offsetY - playAreaRect.top;

        // Keep shape inside the play area
        newX = Math.max(0, Math.min(playAreaRect.width - activeShape.clientWidth, newX));
        newY = Math.max(0, Math.min(playAreaRect.height - activeShape.clientHeight, newY));

        // Apply new position
        activeShape.style.left = `${newX}px`;
        activeShape.style.top = `${newY}px`;
    }

    function dropShape() {
        document.removeEventListener("mousemove", moveShape);
        document.removeEventListener("mouseup", dropShape);
        document.removeEventListener("touchmove", moveShape);
        document.removeEventListener("touchend", dropShape);
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
