// RangeControl

function RangeControl(title, min, max, step, value, onChange) {
    // Add root
    this.view = document.createElement("div");
    this.view.className = "control";

    // Add label
    var label = document.createElement("label");
    label.innerHTML = title;
    this.view.appendChild(label);

    // Add range
    this.range = document.createElement("input");
    this.range.type = "range";
    this.range.min = min;
    this.range.max = max;
    this.range.step = step;
    this.range.value = value;
    this.range.addEventListener("change", onChange);
    this.view.appendChild(this.range);
}

RangeControl.prototype.getValue = function() {
    return this.range.value;
}

// Node

function Node() {
    this.previous = null;
    this.next = null;

    this.view = null;
    this.contentView = null;
    this.settingsView = null;
    this.titleView = null;
}

Node.prototype.append = function(node) {
    if (this.next) {
        this.next.previous = node;
        node.next = this.next;
    }

    node.previous = this;
    this.next = node;
}

Node.prototype.loadView = function() {
    // Create root view
    this.view = document.createElement("div");
    this.view.className = "fltr-node";

    // Create a row
    var row = document.createElement("div");
    row.className = "row";
    this.view.appendChild(row);

    // Create content
    this.contentView = document.createElement("div");
    this.contentView.className = "col-8 content";
    row.appendChild(this.contentView);

    // Create settings
    this.settingsView = document.createElement("div");
    this.settingsView.className = "col-4 settings";
    row.appendChild(this.settingsView);

    // Create title
    this.titleView = document.createElement("h1");
    this.settingsView.appendChild(this.titleView);

    // Insert separator
    this.settingsView.appendChild(document.createElement("hr"));
}

Node.prototype.update = function() {
    if (this.next) {
        this.next.update();
    }
}

Node.prototype.invalidate = function() {
    if (this.next) {
        this.next.invalidate();
    }
}

// RootNode

function RootNode() {
    this.loadView();
    this.titleView.innerHTML = "Upload";

    // Add drop field
    this.dropView = document.createElement("div");
    this.dropView.className = "drop";
    this.dropView.draggable = true;
    this.contentView.appendChild(this.dropView);

    this.dropView.addEventListener("dragenter", function(event) {
        event.preventDefault();
        this.dropView.classList.add("dragging");
    }.bind(this), false);

    this.dropView.addEventListener("dragover", function(event) {
        event.preventDefault();
    }.bind(this), false);

    this.dropView.addEventListener("dragleave", function(event) {
        event.preventDefault();
        this.dropView.classList.remove("dragging");
    }.bind(this), false);

    this.dropView.addEventListener("drop", function(event) {
        event.preventDefault();
        var reader = new FileReader();
        reader.onload = this.onFileReaderLoad.bind(this);
        reader.readAsDataURL(event.dataTransfer.files[0]);
        this.dropView.classList.remove("dragging");
    }.bind(this), false);

    // Add upload icon
    var uploadIcon = document.createElement("img");
    this.dropView.appendChild(uploadIcon);

    // Add label
    var label = document.createElement("h1");
    label.innerHTML = "Drag&Drop your image or use the file upload.";
    this.dropView.appendChild(label);

    // Add upload button
    var uploadButton = document.createElement("input");
    uploadButton.type = "file";
    uploadButton.addEventListener("change", function(event) {
        var reader = new FileReader();
        reader.onload = this.onFileReaderLoad.bind(this);
        reader.readAsDataURL(event.target.files[0]);
    }.bind(this), false);
    this.dropView.appendChild(uploadButton);

    // Add canvas
    this.canvas = null;

    // Add description
    var description = document.createElement("p");
    description.innerHTML = "Upload your image.";
    this.settingsView.appendChild(description);
}

RootNode.prototype = new Node();

RootNode.prototype.onFileReaderLoad = function(event) {
    var image = new Image();
    image.onload = function() {
        this.renderImage(image);
    }.bind(this);
    image.src = event.target.result;
}

RootNode.prototype.renderImage = function(image) {
    // Remove drop field
    this.contentView.removeChild(this.dropView);
    this.dropView = null;

    // Add canvas
    this.canvas = document.createElement("canvas");
    this.contentView.appendChild(this.canvas);

    // Load image into the canvas
    this.canvas.width = image.width;
    this.canvas.height = image.height;
    this.canvas.getContext("2d").drawImage(image, 0, 0);

    // Update the next node
    if (this.next) {
        this.next.update();
    }
}

// FilterNode

function FilterNode(filter) {
    this.filter = filter;
}

FilterNode.prototype = new Node();

FilterNode.prototype.update = function() {
    this.invalidate();

    setTimeout(function() {
        // Retrieve the image data from the previous node
        var previousCanvas = this.previous.canvas;
        var width = previousCanvas.width;
        var height = previousCanvas.height;
        var previousContext = previousCanvas.getContext("2d");
        var imageData = previousContext.getImageData(0, 0, width, height);

        // Process the image data
        this.filter.process(imageData);

        // Write the result to the canvas
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.getContext("2d").putImageData(imageData, 0, 0);

        // Remove invalid state
        this.view.classList.remove("invalid");

        // Update the next node
        if (this.next) {
            this.next.update();
        }
    }.bind(this), 0.001);
}

FilterNode.prototype.invalidate = function() {
    // Add invalid state
    this.view.classList.add("invalid");

    // Invalidate the next node
    if (this.next) {
        this.next.invalidate();
    }
}

// BrightnessNode

function BrightnessNode() {
    this.loadView();
    this.titleView.innerHTML = "Brightness";

    // Create canvas
    this.canvas = document.createElement("canvas");
    this.contentView.appendChild(this.canvas);

    // Add intensity control
    var intensityRange = new RangeControl("Intensity", -0.5, 0.5, 0.01, this.filter.intensity, function() {
        this.filter.intensity = parseFloat(intensityRange.getValue());
        this.update();
    }.bind(this));
    this.settingsView.appendChild(intensityRange.view);

    // Insert separator
    this.settingsView.appendChild(document.createElement("hr"));

    // Add description
    var description = document.createElement("p");
    description.innerHTML = "Brightness filter adds some light to your image.";
    this.settingsView.appendChild(description);
}

BrightnessNode.prototype = new FilterNode(new BrightnessFilter());

// ColorBalanceNode

function ColorBalanceNode() {
    this.loadView();
    this.titleView.innerHTML = "Color Balance";

    // Create canvas
    this.canvas = document.createElement("canvas");
    this.contentView.appendChild(this.canvas);

    // Add red intensity control
    var redIntensityRange = new RangeControl("Red", 0, 2, 0.02, this.filter.redIntensity, function() {
        this.filter.redIntensity = parseFloat(redIntensityRange.getValue());
        this.update();
    }.bind(this));
    this.settingsView.appendChild(redIntensityRange.view);

    // Add green intensity control
    var greenIntensityRange = new RangeControl("Green", 0, 2, 0.02, this.filter.greenIntensity, function() {
        this.filter.greenIntensity = parseFloat(greenIntensityRange.getValue());
        this.update();
    }.bind(this));
    this.settingsView.appendChild(greenIntensityRange.view);

    // Add blue intensity control
    var blueIntensityRange = new RangeControl("Blue", 0, 2, 0.02, this.filter.blueIntensity, function() {
        this.filter.blueIntensity = parseFloat(blueIntensityRange.getValue());
        this.update();
    }.bind(this));
    this.settingsView.appendChild(blueIntensityRange.view);

    // Insert separator
    this.settingsView.appendChild(document.createElement("hr"));

    // Add description
    var description = document.createElement("p");
    description.innerHTML = "Color Balance filter adjusts colors of your image.";
    this.settingsView.appendChild(description);
}

ColorBalanceNode.prototype = new FilterNode(new ColorBalanceFilter());

// ContrastNode

function ContrastNode() {
    this.loadView();
    this.titleView.innerHTML = "Contrast";

    // Create canvas
    this.canvas = document.createElement("canvas");
    this.contentView.appendChild(this.canvas);

    // Add intensity control
    var intensityRange = new RangeControl("Intensity", 0.5, 2, 0.015, this.filter.intensity, function() {
        this.filter.intensity = parseFloat(intensityRange.getValue());
        this.update();
    }.bind(this));
    this.settingsView.appendChild(intensityRange.view);

    // Insert separator
    this.settingsView.appendChild(document.createElement("hr"));

    // Add description
    var description = document.createElement("p");
    description.innerHTML = "Contrast filter increases the color range of your image.";
    this.settingsView.appendChild(description);
}

ContrastNode.prototype = new FilterNode(new ContrastFilter());

// FadeNode

function FadeNode() {
    this.loadView();
    this.titleView.innerHTML = "Fade";

    // Create canvas
    this.canvas = document.createElement("canvas");
    this.contentView.appendChild(this.canvas);

    // Add intensity control
    var intensityRange = new RangeControl("Intensity", 0, 1, 0.01, this.filter.intensity, function() {
        this.filter.intensity = parseFloat(intensityRange.getValue());
        this.update();
    }.bind(this));
    this.settingsView.appendChild(intensityRange.view);

    // Add shade control
    var shadeRange = new RangeControl("Shade", 0, 1, 0.01, this.filter.shade, function() {
        this.filter.shade = parseFloat(shadeRange.getValue());
        this.update();
    }.bind(this));
    this.settingsView.appendChild(shadeRange.view);

    // Add tolerance control
    var toleranceRange = new RangeControl("Tolerance", 1, 5, 0.04, this.filter.tolerance, function() {
        this.filter.tolerance = parseFloat(toleranceRange.getValue());
        this.update();
    }.bind(this));
    this.settingsView.appendChild(toleranceRange.view);

    // Insert separator
    this.settingsView.appendChild(document.createElement("hr"));

    // Add description
    var description = document.createElement("p");
    description.innerHTML = "Fade filter suppresses shadow contrast in your image.";
    this.settingsView.appendChild(description);
}

FadeNode.prototype = new FilterNode(new FadeFilter());

// GrainNode

function GrainNode() {
    this.loadView();
    this.titleView.innerHTML = "Grain";

    // Create canvas
    this.canvas = document.createElement("canvas");
    this.contentView.appendChild(this.canvas);

    // Add intensity control
    var intensityRange = new RangeControl("Intensity", 0, 1, 0.01, this.filter.intensity, function() {
        this.filter.intensity = parseFloat(intensityRange.getValue());
        this.update();
    }.bind(this));
    this.settingsView.appendChild(intensityRange.view);

    // Insert separator
    this.settingsView.appendChild(document.createElement("hr"));

    // Add description
    var description = document.createElement("p");
    description.innerHTML = "Grain filter adds some noise to your image.";
    this.settingsView.appendChild(description);
}

GrainNode.prototype = new FilterNode(new GrainFilter());

// GrayscaleNode

function GrayscaleNode() {
    this.loadView();
    this.titleView.innerHTML = "Grayscale";

    // Create canvas
    this.canvas = document.createElement("canvas");
    this.contentView.appendChild(this.canvas);

    // Add description
    var description = document.createElement("p");
    description.innerHTML = "Grayscale filter converts your image into black and white.";
    this.settingsView.appendChild(description);
}

GrayscaleNode.prototype = new FilterNode(new GrayscaleFilter());

// InvertNode

function InvertNode() {
    this.loadView();
    this.titleView.innerHTML = "Invert";

    // Create canvas
    this.canvas = document.createElement("canvas");
    this.contentView.appendChild(this.canvas);

    // Add description
    var description = document.createElement("p");
    description.innerHTML = "Invert filter inverts colors of your image.";
    this.settingsView.appendChild(description);
}

InvertNode.prototype = new FilterNode(new InvertFilter());

// SaturationNode

function SaturationNode() {
    this.loadView();
    this.titleView.innerHTML = "Saturation";

    // Create canvas
    this.canvas = document.createElement("canvas");
    this.contentView.appendChild(this.canvas);

    // Add intensity control
    var intensityRange = new RangeControl("Intensity", 0, 2, 0.02, this.filter.intensity, function() {
        this.filter.intensity = parseFloat(intensityRange.getValue());
        this.update();
    }.bind(this));
    this.settingsView.appendChild(intensityRange.view);

    // Insert separator
    this.settingsView.appendChild(document.createElement("hr"));

    // Add description
    var description = document.createElement("p");
    description.innerHTML = "Saturation filter makes your image juicy.";
    this.settingsView.appendChild(description);
}

SaturationNode.prototype = new FilterNode(new SaturationFilter());

// TemperatureNode

function TemperatureNode() {
    this.loadView();
    this.titleView.innerHTML = "Temperature";

    // Create canvas
    this.canvas = document.createElement("canvas");
    this.contentView.appendChild(this.canvas);

    // title, min, max, step, value, onChange

    // Add warmth control
    var warmthRange = new RangeControl("Warmth", -0.5, 0.5, 0.01, this.filter.warmth, function() {
        this.filter.warmth = parseFloat(warmthRange.getValue());
        this.update();
    }.bind(this));
    this.settingsView.appendChild(warmthRange.view);

    // Insert separator
    this.settingsView.appendChild(document.createElement("hr"));

    // Add description
    var description = document.createElement("p");
    description.innerHTML = "Temperature filter adjusts warmth of your image.";
    this.settingsView.appendChild(description);
}

TemperatureNode.prototype = new FilterNode(new TemperatureFilter());
