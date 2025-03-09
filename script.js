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
    let activeShape = null;
    let offsetX, offsetY;

    document.querySelectorAll(".puzzle-shape img").forEach(shape => {
        shape.addEventListener("touchstart", function (event) {
            event.preventDefault();

            activeShape = event.target.cloneNode(true);
            activeShape.classList.add("placed-shape");

            document.body.appendChild(activeShape);

            const touch = event.touches[0];
            offsetX = touch.clientX - shape.getBoundingClientRect().left;
            offsetY = touch.clientY - shape.getBoundingClientRect().top;

            activeShape.style.position = "absolute";
            activeShape.style.width = "80px"; // Default size
            activeShape.style.left = `${touch.clientX - offsetX}px`;
            activeShape.style.top = `${touch.clientY - offsetY}px`;

            function moveShape(event) {
                const touch = event.touches[0];
                activeShape.style.left = `${touch.clientX - offsetX}px`;
                activeShape.style.top = `${touch.clientY - offsetY}px`;
            }

            function dropShape(event) {
                const playArea = document.querySelector(".playarea-large").getBoundingClientRect();
                const shapeRect = activeShape.getBoundingClientRect();

                if (
                    shapeRect.left >= playArea.left &&
                    shapeRect.right <= playArea.right &&
                    shapeRect.top >= playArea.top &&
                    shapeRect.bottom <= playArea.bottom
                ) {
                    document.querySelector(".playarea-large").appendChild(activeShape);
                } else {
                    activeShape.remove(); // Remove if placed outside playarea
                }

                document.removeEventListener("touchmove", moveShape);
                document.removeEventListener("touchend", dropShape);
                activeShape = null;
            }

            document.addEventListener("touchmove", moveShape);
            document.addEventListener("touchend", dropShape);
        });
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
