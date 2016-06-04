// Node

function Node() {
    this.previous = null;
    this.next = null;
}

Node.prototype.append = function(node) {
    if (this.next) {
        this.next.previous = node;
        node.next = this.next;
    }

    node.previous = this;
    this.next = node;
}

// FilterNode

function FilterNode(filter) {
    this.filter = filter;

    this.view = null;
    this.settingsView = null;
    this.titleView = null;
}

FilterNode.prototype = new Node();

FilterNode.prototype.loadView = function() {
    // Create root view
    this.view = document.createElement("div");
    this.view.className = "fltr-node";

    // Create a row
    var row = document.createElement("div");
    row.className = "row";
    this.view.appendChild(row);

    // Create a column for canvas
    var canvasColumn = document.createElement("div");
    canvasColumn.className = "col-8";
    row.appendChild(canvasColumn);

    // Create a canvas
    var canvas = document.createElement("canvas");
    canvasColumn.appendChild(canvas);

    // Create a column for settings
    var settingsColumn = document.createElement("div");
    settingsColumn.className = "col-4";
    row.appendChild(settingsColumn);

    // Create settings
    this.settingsView = document.createElement("div");
    this.settingsView.className = "settings";
    settingsColumn.appendChild(this.settingsView);

    // Create title
    this.titleView = document.createElement("h1");
    this.settingsView.appendChild(this.titleView);

    // Insert a separator
    this.settingsView.appendChild(document.createElement("hr"));
}

// GrayscaleNode

function GrayscaleNode() {
    this.loadView();
    this.titleView.innerHTML = "Grayscale";
}

GrayscaleNode.prototype = new FilterNode(new GrayscaleFilter());

// FadeNode

function FadeNode() {
    this.loadView();
    this.titleView.innerHTML = "Fade";
}

FadeNode.prototype = new FilterNode(new FadeFilter());
