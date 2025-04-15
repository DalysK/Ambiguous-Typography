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
        gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
        
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
 
    const shapeElements = document.querySelectorAll(".puzzle-shape");

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

        function selectShape(e) {
  e.preventDefault();
  e.stopPropagation();
  selectedShape = this;
  console.log("Shape selected (touch/click):", selectedShape);
}

newShape.addEventListener("click", selectShape);
newShape.addEventListener("touchstart", selectShape, { passive: false });

    }

    function startDrag(event) {
        event.preventDefault();
        activeShape = event.target.closest(".placed-shape");

        const isTouch = event.type.startsWith("touch");
        const touch = isTouch ? event.touches[0] : event;

        const playArea = document.querySelector(".playarea-large");
        const playAreaRect = playArea.getBoundingClientRect();
        const shapeRect = activeShape.getBoundingClientRect();
        
    console.log("CLICKED SHAPE:", activeShape);
   console.log("Shape Position BEFORE Drag: ", shapeRect.left, shapeRect.top);
    console.log("Mouse Position: ", touch.clientX, touch.clientY);
    console.log("Offset X:", offsetX, "Offset Y:", offsetY);
    console.log("Play Area Position: ", playAreaRect.left, playAreaRect.top);



        // Fix offset calculation (relative to the play area)
        offsetX = touch.clientX - shapeRect.left;
        offsetY = touch.clientY - shapeRect.top;

        activeShape.style.left = `${shapeRect.left - playAreaRect.left}px`;
        activeShape.style.top = `${shapeRect.top - playAreaRect.top}px`;
        
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
        const shapeRect = activeShape.getBoundingClientRect();


        console.log("Touch X:", touch.clientX, "Touch Y:", touch.clientY);
        console.log("Offset X:", offsetX, "Offset Y:", offsetY);
        console.log("Play area left:", playAreaRect.left, "top:", playAreaRect.top);
        
        // Calculate new position (inside play area)
        let newX = touch.clientX - offsetX - playAreaRect.left;
        let newY = touch.clientY - offsetY - playAreaRect.top;

        // Keep shape inside the play area
   newX = Math.max(0, Math.min(playAreaRect.width - shapeRect.width, newX));
    newY = Math.max(0, Math.min(playAreaRect.height - shapeRect.height, newY));


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

// Select shape when clicked
document.querySelector(".playarea-large").addEventListener("click", function (event) {
    if (event.target.classList.contains("placed-shape")) {
        selectedShape = event.target;
        console.log("Selected shape:", selectedShape);
    }
});

// Function to get current transform values
function getCurrentTransformValues(element) {
    const transform = window.getComputedStyle(element).transform;
    let rotate = 0, flip = 1;

    if (transform !== "none") {
        const values = transform.match(/matrix\(([-\d.,\s]+)\)/);
        if (values) {
            const matrix = values[1].split(", ").map(parseFloat);
            rotate = Math.round(Math.atan2(matrix[1], matrix[0]) * (180 / Math.PI));
            flip = matrix[0] < 0 ? -1 : 1;
        }
    }

    return { rotate, flip };
}

// Apply transformations
document.querySelectorAll(".setting-button img").forEach(button => {
    button.addEventListener("click", handleTransform);
    button.addEventListener("touchstart", handleTransform, { passive: false });
});

function handleTransform(e) {
    e.preventDefault();
    if (!selectedShape) return;

    const src = e.currentTarget.getAttribute("src");
    let { rotate, flip } = getCurrentTransformValues(selectedShape);

    if (src.includes("rotate_right")) {
        rotate += 90;
    } 
    else if (src.includes("flip")) {
        flip *= -1;
    }
    else if (src.includes("plus")) {
        let currentWidth = selectedShape.getBoundingClientRect().width;
        let newSize = currentWidth + 10;
        selectedShape.style.width = `${newSize}px`;
        selectedShape.style.height = "auto";
    }
    else if (src.includes("minus")) {
        let currentWidth = selectedShape.getBoundingClientRect().width;
        let newSize = Math.max(10, currentWidth - 10);
        selectedShape.style.width = `${newSize}px`;
        selectedShape.style.height = "auto";
    }

    selectedShape.style.transform = `rotate(${rotate}deg) scaleX(${flip})`;
    console.log("Updated Transform:", selectedShape.style.transform);
}



    /*** COLOR CHANGE FOR SVG SHAPES ***/
   // document.querySelectorAll(".color-option").forEach(colorOption => {
       // colorOption.addEventListener("click", function () {
           // if (selectedShape) {
             //   let color = this.dataset.color;
              //  selectedShape.style.filter = `invert(1) sepia(1) saturate(10000%) hue-rotate(${Math.random() * 360}deg) brightness(1.2)`;
          //  }
        //});
  //  });

   const colorPicker = document.getElementById("color-picker");

colorPicker.addEventListener("input", function (event) {
    if (selectedShape) {
        const chosenColor = event.target.value;
        const shapePath = selectedShape.querySelector("path, rect, circle, polygon");
        if (shapePath) {
            shapePath.setAttribute("fill", chosenColor);
        }
    }
});

    /*** RESET BUTTON (Clears All Placed Shapes) ***/
    document.getElementById("reset").addEventListener("click", function () {
        document.querySelectorAll(".playarea-large .placed-shape").forEach(shape => shape.remove());
        selectedShape = null;
    });

    const prompts = [
  "Make a letter that feels angry",
  "Use only curves and no straight lines",
  "Create a shape that breaks symmetry",
  "Build a letterform from minimal pieces",
  "Make it feel like it's tipping over",
  "Use negative space creatively",
  "Design something that challenges legibility",
  "Build a soft-looking structure",
  "Stack parts vertically, like a tower",
  "Make it feel like it's in motion"
];

const promptText = document.querySelector(".prompt-text");

function getRandomPrompt() {
  const index = Math.floor(Math.random() * prompts.length);
  return prompts[index];
}

function updatePrompt() {
  const newPrompt = getRandomPrompt();
  promptText.textContent = `Prompt: ${newPrompt}`;
}

// Show a prompt immediately when the game loads
updatePrompt();

// Change prompt on reset
const resetBtn = document.getElementById("reset");
if (resetBtn) {
  resetBtn.addEventListener("click", updatePrompt);
}

// Change prompt on save
const saveBtn = document.getElementById("save");
if (saveBtn) {
  saveBtn.addEventListener("click", updatePrompt);
}

// Change prompt on restart icon click
const restartBtn = document.querySelector(".restart-btn");
if (restartBtn) {
  restartBtn.addEventListener("click", updatePrompt);
}
function fixViewportHeight() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
window.addEventListener('load', fixViewportHeight);
window.addEventListener('resize', fixViewportHeight);

});
