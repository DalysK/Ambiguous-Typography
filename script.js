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


    var mydragg = function() {
  return {
    move: function(divid, xpos, ypos) {
      divid.style.left = xpos + 'px';
      divid.style.top = ypos + 'px';
    },
    startMoving: function(divid, container, evt) {
      evt = evt || window.event;
      var posX = evt.clientX,
          posY = evt.clientY,
          divTop = divid.offsetTop,
          divLeft = divid.offsetLeft,
          eWi = divid.offsetWidth,
          eHe = divid.offsetHeight,
          cWi = document.getElementById(container).clientWidth,
          cHe = document.getElementById(container).clientHeight;
      
      document.getElementById(container).style.cursor = 'move';

      var diffX = posX - divLeft,
          diffY = posY - divTop;

      document.onmousemove = function(evt) {
        evt = evt || window.event;
        var posX = evt.clientX,
            posY = evt.clientY,
            aX = posX - diffX,
            aY = posY - diffY;

        // Constrain within container
        if (aX < 0) aX = 0;
        if (aY < 0) aY = 0;
        if (aX + eWi > cWi) aX = cWi - eWi;
        if (aY + eHe > cHe) aY = cHe - eHe;

        mydragg.move(divid, aX, aY);
      }

      document.onmouseup = function() {
        document.getElementById(container).style.cursor = 'default';
        document.onmousemove = null;
        document.onmouseup = null;
      }
    }
  }
}();

  
    /*** DRAG-AND-DROP SYSTEM ***/
  

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
        newShape.style.cursor = "grab"; // Indicate it's draggable

        // Position the shape at a default location inside playarea
        newShape.style.left = "20px";
        newShape.style.top = "20px";

        // Add the shape to the play area
        playArea.appendChild(newShape);

       newShape.addEventListener("mousedown",function (e) {
                mydragg.startMoving(newShape, "playarea-large", e);
    });
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
