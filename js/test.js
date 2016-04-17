// Node ------------------------------------------------------------------------

function Node() {
    this.previous = null;
    this.next = null;

    // Reactive
    this.disposeBag = new Rx.CompositeDisposable();
}

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

    // var canvas = document.getElementById("test-canvas");
    var canvas = document.querySelector("canvas");
    var context = canvas.getContext("2d");

    var image = new Image();
    // image.src = "https://i.ytimg.com/vi/Wq4Y7ztznKc/maxresdefault.jpg";
    // image.src = "http://www.prague.eu/file/edee/2014/09/prague-winter-pink-sky.jpg";
    // image.src = "http://cdn.c.photoshelter.com/img-get/I0000y3wwyf_58qM/s/750/san-francisco-baker-beach-golden-gate-bridge-california108828.jpg";
    image.src = "http://cs635100.vk.me/v635100859/7163/6kTTdKuy-Gw.jpg";
    // image.src = "http://cs635100.vk.me/v635100859/7c4e/goougMymzGY.jpg";
    image.onload = function() {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);
        image.style.display = "none";

        // var grayscale = new GrayscaleFilter();
        // var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        // grayscale.process(imageData);
        // context.putImageData(imageData, 0, 0);
    }
}
