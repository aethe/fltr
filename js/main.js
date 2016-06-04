function main() {
    // Load root node
    var grid = document.querySelector(".grid");
    var rootNode = new RootNode();
    grid.appendChild(rootNode.view);

    // Load some default filters
    var fadeNode = new FadeNode();
    grid.appendChild(fadeNode.view);
    rootNode.append(fadeNode);
    var grayscaleNode = new GrayscaleNode();
    grid.appendChild(grayscaleNode.view);
    fadeNode.append(grayscaleNode);
}
