// Playground ------------------------------------------------------------------

function setupDragAndDrop() {
    var dropArea = document.getElementById("drop-area");
    // dragArea.addEventListener("dragstart", function() {
    //
    // });

    dropArea.addEventListener("drop", function(event) {
        event.preventDefault();
        console.log(event.dataTransfer.files);
    }, false);
}

function runTest() {
    // setupDragAndDrop();

    var grid = document.querySelector(".grid");

    var rootNode = new RootNode();
    var grayscaleNode = new GrayscaleNode();
    var fadeNode = new FadeNode();

    grid.appendChild(rootNode.view);
    grid.appendChild(fadeNode.view);
    grid.appendChild(grayscaleNode.view);

    rootNode.append(fadeNode);
    fadeNode.append(grayscaleNode);

    rootNode.showCanvas();

    var canvas = rootNode.canvas;
    var context = canvas.getContext("2d");

    var image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = "https://upload.wikimedia.org/wikipedia/commons/1/16/Meadow_at_Noble_Woods_Park_-_Hillsboro,_Oregon.JPG";

    image.onload = function() {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);
        image.style.display = "none";

        // var grayscale = new GrayscaleFilter();
        // var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        // grayscale.process(imageData);
        // context.putImageData(imageData, 0, 0);

        // var fade = new FadeFilter();
        // fade.strength = 0.5;
        // fade.exponent = 3;
        // fade.shadowColor = new Color(96, 96, 160, 1);
        // var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        // fade.process(imageData);
        // context.putImageData(imageData, 0, 0);

        // var testFilter = new TestFilter();
        // var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        // testFilter.process(imageData);
        // context.putImageData(imageData, 0, 0);

        rootNode.next.update();
    }

    canvas.addEventListener("click", function(event) {
        window.location.href = canvas.toDataURL();
    });
}
