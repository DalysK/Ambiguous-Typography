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


