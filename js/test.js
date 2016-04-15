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
    setupDragAndDrop();
}
