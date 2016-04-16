// Color -----------------------------------------------------------------------

function Color(red, green, blue, alpha) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = alpha;
}

Color.prototype.getRelativeLuminance = function() {
    return 0.2126 * this.red + 0.7152 * this.green + 0.0722 * this.blue;
}

// Filter ----------------------------------------------------------------------

function Filter() { }
Filter.prototype.process = function(imageData) { }

// BasicFilter -----------------------------------------------------------------

function BasicFilter() { }
BasicFilter.prototype = new Filter();

BasicFilter.prototype.process = function(imageData) {
    for (var i = 0; i < imageData.data.length; i += 4) {
        // Prepare the pixel color data
        var red = imageData.data[i];
        var green = imageData.data[i + 1];
        var blue = imageData.data[i + 2];
        var alpha = imageData.data[i + 3];
        var color = new Color(red, green, blue, alpha);

        // Process the color
        this.processPixel(color);

        // Write the result back
        imageData.data[i] = color.red;
        imageData.data[i + 1] = color.green;
        imageData.data[i + 2] = color.blue;
        imageData.data[i + 3] = color.alpha;
    }
}

BasicFilter.prototype.processPixel = function(color) { }

// ConvolutionFilter -----------------------------------------------------------

function ConvolutionFilter() {
    this.kernel = [];
}

ConvolutionFilter.prototype = new Filter();

ConvolutionFilter.prototype.process = function(imageData) {
    // TODO
}

ConvolutionFilter.prototype.processPixel = function(color, colorMatrix) {
    // TODO
}

ConvolutionFilter.prototype.convolve = function(color, colorMatrix) {
    // TODO
}

// GrayscaleFilter -------------------------------------------------------------

function GrayscaleFilter() { }
GrayscaleFilter.prototype = new BasicFilter();

GrayscaleFilter.prototype.processPixel = function(color) {
    var relativeLuminance = color.getRelativeLuminance();
    color.red = relativeLuminance;
    color.green = relativeLuminance;
    color.blue = relativeLuminance;
}

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






function Operation(task) {
    this.task = task;
    this.nextOperation = null;

    this.finishSubject = new Rx.Subject();
}

Operation.prototype.chain = function(other) {
    this.nextOperation = other;
    this.finishSubject.subscribeOnNext(other.perform.bind(other));
}

Operation.prototype.perform = function() {
    this.task();
    // this.finishSubject.onNext();
    setTimeout(function() { this.finishSubject.onNext(); }.bind(this), 0);
}






function runTest() {
    // setupDragAndDrop();

    // var canvas = document.getElementById("test-canvas");
    var canvas = document.querySelector("canvas");
    var context = canvas.getContext("2d");

    var image = new Image();
    // image.src = "https://i.ytimg.com/vi/Wq4Y7ztznKc/maxresdefault.jpg";
    // image.src = "http://www.prague.eu/file/edee/2014/09/prague-winter-pink-sky.jpg";
    image.src = "http://cdn.c.photoshelter.com/img-get/I0000y3wwyf_58qM/s/750/san-francisco-baker-beach-golden-gate-bridge-california108828.jpg";
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



    // // Test RxJS
    // var operation1 = new Operation(function() {
    //     console.log("Operation 1 has started...");
    //     for (var i = 0; i < 1000000000; ++i) {
    //         var x = 15 * 995;
    //     }
    //     console.log("Operation 1 has finished...");
    // });
    //
    // var operation2 = new Operation(function() {
    //     console.log("Operation 2 has started...");
    //     for (var i = 0; i < 1000000000; ++i) {
    //         var x = 15 * 995;
    //     }
    //     console.log("Operation 2 has finished...");
    // });
    //
    // var operation3 = new Operation(function() {
    //     console.log("Operation 3 has started...");
    //     for (var i = 0; i < 1000000000; ++i) {
    //         var x = 15 * 995;
    //     }
    //     console.log("Operation 3 has finished...");
    // });
    //
    // var operation4 = new Operation(function() {
    //     console.log("Operation 4 has started...");
    //     for (var i = 0; i < 1000000000; ++i) {
    //         var x = 15 * 995;
    //     }
    //     console.log("Operation 4 has finished...");
    // });
    //
    // var operation5 = new Operation(function() {
    //     console.log("Operation 5 has started...");
    //     for (var i = 0; i < 1000000000; ++i) {
    //         var x = 15 * 995;
    //     }
    //     console.log("Operation 5 has finished...");
    // });
    //
    // operation1.chain(operation2);
    // operation2.chain(operation3);
    // operation3.chain(operation4);
    // operation4.chain(operation5);
    //
    // operation1.perform();
    //
    // // Do some stuff
    // console.log("Hello World!");
}
