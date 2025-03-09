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


document.addEventListener("DOMContentLoaded", function () {
    const shapes = document.querySelectorAll(".puzzle-shape img");
    let selectedShape = null;

  document.addEventListener("DOMContentLoaded", function() {
    const gridContainer = document.querySelector(".grid-container");
    const gridScaleSlider = document.getElementById("grid-scale-slider");
    const shapes = document.querySelectorAll(".draggable-shape");
    const rotateBtn = document.getElementById("rotate-btn");
    const flipBtn = document.getElementById("flip-btn");
    const sizeUpBtn = document.getElementById("size-up-btn");
    const sizeDownBtn = document.getElementById("size-down-btn");
    const colorOptions = document.querySelectorAll(".color-option");

    let selectedShape = null;

    // 📌 Drag and Drop for Image-Based Shapes
    shapes.forEach(shape => {
        shape.addEventListener("mousedown", function(event) {
            selectedShape = this;
            selectedShape.style.position = "absolute";
            
            function moveShape(e) {
                selectedShape.style.left = e.pageX - selectedShape.width / 2 + "px";
                selectedShape.style.top = e.pageY - selectedShape.height / 2 + "px";
            }

            document.addEventListener("mousemove", moveShape);
            document.addEventListener("mouseup", () => {
                document.removeEventListener("mousemove", moveShape);
                selectedShape = null;
            });
        });
    });

    // Scale the Grid (Doesn't affect shapes)
    gridScaleSlider.addEventListener("input", function() {
        let size = this.value;
        gridContainer.style.width = `${size * 5}px`;
        gridContainer.style.height = `${size * 5}px`;
    });

    // Rotate Shape (90-degree steps)
    rotateBtn.addEventListener("click", function() {
        if (selectedShape) {
            let currentRotation = selectedShape.dataset.rotation || 0;
            currentRotation = (parseInt(currentRotation) + 90) % 360;
            selectedShape.style.transform = `rotate(${currentRotation}deg)`;
            selectedShape.dataset.rotation = currentRotation;
        }
    });

    //  Flip Shape (Horizontal & Vertical Toggle)
    flipBtn.addEventListener("click", function() {
        if (selectedShape) {
            let currentScaleX = selectedShape.dataset.scaleX || 1;
            let newScaleX = currentScaleX == 1 ? -1 : 1;
            selectedShape.style.transform = `scaleX(${newScaleX})`;
            selectedShape.dataset.scaleX = newScaleX;
        }
    });

    // Size Up Shape (Increase Image Size)
    sizeUpBtn.addEventListener("click", function() {
        if (selectedShape) {
            let currentWidth = selectedShape.clientWidth;
            selectedShape.style.width = `${currentWidth + 10}px`;
        }
    });

    //Size Down Shape (Decrease Image Size)
    sizeDownBtn.addEventListener("click", function() {
        if (selectedShape) {
            let currentWidth = selectedShape.clientWidth;
            if (currentWidth > 20) { // Prevents too small sizes
                selectedShape.style.width = `${currentWidth - 10}px`;
            }
        }
    });

    //  Color Selection for Shape (SVG Support)
    colorOptions.forEach(option => {
        option.addEventListener("click", function() {
            if (selectedShape) {
                selectedShape.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
            }
        });
    });
});
