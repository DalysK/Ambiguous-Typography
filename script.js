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
    document.querySelectorAll(".puzzle-shape img").forEach(shape => {
        shape.addEventListener("click", function () {
            addShapeToPlayArea(this);
        });
    });

    function addShapeToPlayArea(originalShape) {
        const playArea = document.querySelector(".playarea-large");

        // Clone the clicked shape
        const newShape = originalShape.cloneNode(true);
        newShape.classList.add("placed-shape");
        newShape.style.position = "absolute";
        newShape.style.width = originalShape.clientWidth + "px"; 
        newShape.style.height = "auto"; 

        // Position the shape in the center of the play area
        const playAreaRect = playArea.getBoundingClientRect();
        newShape.style.left = `${playAreaRect.width / 2 - originalShape.clientWidth / 2}px`;
        newShape.style.top = `${playAreaRect.height / 2 - originalShape.clientHeight / 2}px`;

        // Add the shape to the play area
        playArea.appendChild(newShape);

        // Make the shape draggable
            activeShape.addEventListener("mousedown", function (e) {
                startMoving(activeShape, "playarea-large", e);
            });

            activeShape.addEventListener("mouseup", function () {
                stopMoving("playarea-large");
            });
        });
    });

    function move(divid, xpos, ypos) {
        divid.style.left = xpos + "px";
        divid.style.top = ypos + "px";
    }

    function startMoving(divid, container, evt) {
        evt = evt || window.event;
        const posX = evt.clientX, posY = evt.clientY;
        const divTop = parseInt(divid.style.top) || 0;
        const divLeft = parseInt(divid.style.left) || 0;
        const eWi = divid.offsetWidth, eHe = divid.offsetHeight;
        const playArea = document.getElementById(container);
        const cWi = playArea.clientWidth, cHe = playArea.clientHeight;

        playArea.style.cursor = "move";

        const diffX = posX - divLeft, diffY = posY - divTop;

        document.onmousemove = function (evt) {
            evt = evt || window.event;
            const posX = evt.clientX, posY = evt.clientY;
            let newX = posX - diffX;
            let newY = posY - diffY;

            // Constrain movement within playarea
            if (newX < 0) newX = 0;
            if (newY < 0) newY = 0;
            if (newX + eWi > cWi) newX = cWi - eWi;
            if (newY + eHe > cHe) newY = cHe - eHe;

            move(divid, newX, newY);
        };
    }

    function stopMoving(container) {
        document.getElementById(container).style.cursor = "default";
        document.onmousemove = null;
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
