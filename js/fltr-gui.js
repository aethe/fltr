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
    this.contentView.appendChild(this.dropView);

    // Add canvas
    this.canvas = null;

    // Add description
    var description = document.createElement("p");
    description.innerHTML = "Drag and drop your image.";
    this.settingsView.appendChild(description);
}

RootNode.prototype = new Node();

RootNode.prototype.showCanvas = function() {
    // Don't do anything if already showing canvas
    if (this.canvas) {
        return;
    }

    // Remove drop field
    if (this.dropView) {
        this.contentView.removeChild(this.dropView);
        this.dropView = null;
    }

    // Add canvas
    this.canvas = document.createElement("canvas");
    this.contentView.appendChild(this.canvas);
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

// FadeNode

function FadeNode() {
    this.loadView();
    this.titleView.innerHTML = "Fade";

    // Create canvas
    this.canvas = document.createElement("canvas");
    this.contentView.appendChild(this.canvas);

    // Add strength control
    var strengthRange = new RangeControl("Strength", 0, 1, 0.01, this.filter.strength, function() {
        this.filter.strength = strengthRange.getValue();
        this.update();
    }.bind(this));
    this.settingsView.appendChild(strengthRange.view);

    // Add exponent control
    var exponentRange = new RangeControl("Exponent", 0, 10, 0.1, this.filter.exponent, function() {
        this.filter.exponent = exponentRange.getValue();
        this.update();
    }.bind(this));
    this.settingsView.appendChild(exponentRange.view);

    // Add brightness control
    var brightnessRange = new RangeControl("Brightness", 0, 255, 1, this.filter.brightness, function() {
        this.filter.brightness = brightnessRange.getValue();
        this.update();
    }.bind(this));
    this.settingsView.appendChild(brightnessRange.view);

    // Add description
    var description = document.createElement("p");
    description.innerHTML = "Fade filter suppresses shadow contrast in your image.";
    this.settingsView.appendChild(description);
}

FadeNode.prototype = new FilterNode(new FadeFilter());
