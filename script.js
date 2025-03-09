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
document.addEventListener("DOMContentLoaded", function () {
    // 🔹 GRID SYSTEM
    const gridContainer = document.querySelector(".grid-container");

    function updateGrid() {
        if (!gridContainer) return;

        const containerWidth = gridContainer.clientWidth;
        const containerHeight = gridContainer.clientHeight;
        const cellSize = 30; // Adjust grid square size

        const cols = Math.floor(containerWidth / cellSize);
        const rows = Math.floor(containerHeight / cellSize);

        // Instead of clearing entire container, only remove old grid items
        gridContainer.innerHTML = "";
        gridContainer.style.display = "grid";
        gridContainer.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
        gridContainer.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;

        for (let i = 0; i < rows * cols; i++) {
            const gridItem = document.createElement("div");
            gridItem.classList.add("grid-item");
            gridContainer.appendChild(gridItem);
        }
    }
    updateGrid();
    window.addEventListener("resize", updateGrid); // Keep grid responsive

    // 🔹 DRAG-AND-DROP SYSTEM (iPad & Desktop)
    let activeShape = null;
    let offsetX, offsetY;

    document.querySelectorAll(".puzzle-shape img").forEach(shape => {
        shape.addEventListener("touchstart", startDrag);
        shape.addEventListener("mousedown", startDrag);
    });

    function startDrag(event) {
        event.preventDefault();

        // Create a new shape from the source shape
        activeShape = event.target.cloneNode(true);
        activeShape.classList.add("placed-shape");
        activeShape.style.position = "absolute";
        activeShape.style.width = "80px"; // Default size

        document.querySelector(".playarea-large").appendChild(activeShape);

        let x = event.touches ? event.touches[0].clientX : event.clientX;
        let y = event.touches ? event.touches[0].clientY : event.clientY;

        offsetX = x - activeShape.getBoundingClientRect().left;
        offsetY = y - activeShape.getBoundingClientRect().top;

        activeShape.style.left = `${x - offsetX}px`;
        activeShape.style.top = `${y - offsetY}px`;

        document.addEventListener("mousemove", moveShape);
        document.addEventListener("mouseup", dropShape);
        document.addEventListener("touchmove", moveShape);
        document.addEventListener("touchend", dropShape);

        // Allow moving already placed shapes
        activeShape.addEventListener("mousedown", startDrag);
        activeShape.addEventListener("touchstart", startDrag);
    }

    function moveShape(event) {
        if (!activeShape) return;
        event.preventDefault();

        let x = event.touches ? event.touches[0].clientX : event.clientX;
        let y = event.touches ? event.touches[0].clientY : event.clientY;

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

    function dropShape() {
        if (!activeShape) return;

        document.removeEventListener("mousemove", moveShape);
        document.removeEventListener("mouseup", dropShape);
        document.removeEventListener("touchmove", moveShape);
        document.removeEventListener("touchend", dropShape);

        activeShape = null;
    }

    // 🔹 ALLOW MOVING SHAPES AFTER PLACING
    document.querySelector(".playarea-large").addEventListener("mousedown", function (event) {
        if (event.target.classList.contains("placed-shape")) {
            startDrag(event);
        }
    });

    document.querySelector(".playarea-large").addEventListener("touchstart", function (event) {
        if (event.target.classList.contains("placed-shape")) {
            startDrag(event);
        }
    });

    // 🔹 SHAPE TRANSFORMATIONS (Rotate, Flip, Size)
    let selectedShape = null;

    document.querySelector(".playarea-large").addEventListener("click", function (event) {
        if (event.target.tagName === "IMG") {
            selectedShape = event.target;
        }
    });

    document.querySelector(".setting-button img[src*='rotate_right']").addEventListener("click", function () {
        if (selectedShape) {
            let currentRotation = selectedShape.style.transform.match(/rotate\((\d+)deg\)/);
            let newRotation = currentRotation ? parseInt(currentRotation[1]) + 90 : 90;
            selectedShape.style.transform = `rotate(${newRotation}deg)`;
        }
    });

    document.querySelector(".setting-button img[src*='flip']").addEventListener("click", function () {
        if (selectedShape) {
            let currentScale = selectedShape.style.transform.match(/scaleX\((-?1)\)/);
            let newScale = currentScale ? -parseInt(currentScale[1]) : -1;
            selectedShape.style.transform += ` scaleX(${newScale})`;
        }
    });

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

    // 🔹 CHANGE SHAPE COLOR
    document.querySelectorAll(".color-option").forEach(colorOption => {
        colorOption.addEventListener("click", function () {
            if (selectedShape) {
                let color = this.dataset.color;
                selectedShape.style.filter = `invert(1) sepia(1) saturate(10000%) hue-rotate(${Math.random() * 360}deg) brightness(1.2)`;
            }
        });
    });

    // 🔹 DELETE SHAPE FUNCTION
    document.querySelector(".playarea-large").addEventListener("dblclick", function (event) {
        if (event.target.classList.contains("placed-shape")) {
            event.target.remove(); // Remove shape on double-click
        }
    });

    // 🔹 RESET BUTTON FUNCTION
    document.querySelector("#reset").addEventListener("click", function () {
        document.querySelectorAll(".placed-shape").forEach(shape => shape.remove());
    });
});
