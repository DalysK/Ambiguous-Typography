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

document.addEventListener("DOMContentLoaded", function() {
    const gridContainer = document.querySelector(".grid-container");
    
    // Get the smallest dimension (width or height) to keep grid square
    const gridSize = Math.min(gridContainer.clientWidth, gridContainer.clientHeight);
    
    const rows = 20;
    const cols = 20;
    
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, ${gridSize / cols}px)`;
    gridContainer.style.gridTemplateRows = `repeat(${rows}, ${gridSize / rows}px)`;

    // Remove existing cells to avoid duplicates
    gridContainer.innerHTML = "";

    for (let i = 0; i < rows * cols; i++) {
        const gridItem = document.createElement("div");
        gridItem.classList.add("grid-item");
        gridContainer.appendChild(gridItem);
    }
});

