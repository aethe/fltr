function FilterList() {
    // Find the filter collection
    this.filterAdd = document.querySelector(".fltr-add");

    // Load root node
    this.grid = document.querySelector(".grid");
    this.rootNode = new RootNode();
    this.grid.insertBefore(this.rootNode.view, this.filterAdd);

    // Keep track of the tail
    this.tailNode = this.rootNode;
}

FilterList.prototype.appendFilterNode = function(filterNode) {
    this.tailNode.append(filterNode);
    this.tailNode = filterNode;
    this.grid.insertBefore(filterNode.view, this.filterAdd);
    filterNode.update();
}

function main() {
    var filterList = new FilterList();

    document.getElementById("add-grayscale").addEventListener("click", function() {
        filterList.appendFilterNode(new GrayscaleNode());
    });

    document.getElementById("add-fade").addEventListener("click", function() {
        filterList.appendFilterNode(new FadeNode());
    });
}
