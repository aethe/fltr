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
    // image.src = "http://cs635100.vk.me/v635100859/7163/6kTTdKuy-Gw.jpg";
    // image.src = "http://gamerant.com/wp-content/uploads/Skyrim-screenshot-forest.jpg";
    // image.src = "http://cs635100.vk.me/v635100859/7c4e/goougMymzGY.jpg";
    // image.src = "http://www.geforce.com/sites/default/files-world/screenshots/elder-scrolls-v-skyrim/screenshot-2.jpg";
    // image.src = "http://cs633125.vk.me/v633125656/262dd/wb7zrUzTD8s.jpg";
    // image.src = "http://cache-graphicslib.viator.com/graphicslib/thumbs674x446/3731/SITours/skip-the-line-ancient-rome-and-colosseum-half-day-walking-tour-in-rome-114992.jpg";
    // image.src = "https://upload.wikimedia.org/wikipedia/commons/1/16/Meadow_at_Noble_Woods_Park_-_Hillsboro,_Oregon.JPG";
    // image.src = "http://www.benefest.org/images/2012/archive/2012_keel_john_pickathon_sun_wood-brothers_woods-stage-1399.jpg";
    // image.src = "http://www.geforce.com/sites/default/files-world/screenshots/elder-scrolls-v-skyrim/screenshot-8.jpg";
    // image.src = "http://arkantophotography.eu/wp-content/uploads/2013/10/Russian-woods.jpg";
    // image.src = "http://www.gameslayer.org/articles/Beautiful_Skyrim_Screenshots_Collection_One-5/gslayer-skyrim-screenshot-002.jpg";
    image.src = "http://cs635100.vk.me/v635100859/7c2c/SzpWW39j-V8.jpg";

    image.onload = function() {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);
        image.style.display = "none";

        // var grayscale = new GrayscaleFilter();
        // var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        // grayscale.process(imageData);
        // context.putImageData(imageData, 0, 0);

        var fade = new FadeFilter();
        fade.strength = 0.5;
        fade.exponent = 3;
        fade.shadowColor = new Color(96, 96, 160, 1);
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        fade.process(imageData);
        context.putImageData(imageData, 0, 0);

        // var testFilter = new TestFilter();
        // var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        // testFilter.process(imageData);
        // context.putImageData(imageData, 0, 0);
    }

    var grid = document.querySelector(".grid");
    var grayscaleNode = new GrayscaleNode();
    grid.appendChild(grayscaleNode.view);
    var fadeNode = new FadeNode();
    grid.appendChild(fadeNode.view);

    canvas.addEventListener("click", function(event) {
        window.location.href = canvas.toDataURL();
    });
}
