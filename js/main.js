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

    document.getElementById("add-invert").addEventListener("click", function() {
        filterList.appendFilterNode(new InvertNode());
    });

    document.getElementById("add-brightness").addEventListener("click", function() {
        filterList.appendFilterNode(new BrightnessNode());
    });

    document.getElementById("add-contrast").addEventListener("click", function() {
        filterList.appendFilterNode(new ContrastNode());
    });

    document.getElementById("add-fade").addEventListener("click", function() {
        filterList.appendFilterNode(new FadeNode());
    });

    var downloadButton = document.getElementById("download");
    downloadButton.addEventListener("click", function() {
        var canvas = filterList.tailNode.canvas;
        if (!canvas) {
            return;
        }

        if (window.navigator.userAgent.indexOf("Edge") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1) {
            // Display the image on the same page in Edge
            var edgeResultImage = document.getElementById("edge-result");
            edgeResultImage.src = canvas.toDataURL("image/jpeg");
        } else {
            // For other browsers open the image in a new tab
            window.open(canvas.toDataURL("image/jpeg"));
        }

        // Send a notification
        if ("Notification" in window) {
            var notificationText = "Your image has finished processing and is now available for download.";
            var permission = Notification.permission;
            if (permission === "granted") {
                new Notification(notificationText);
            } else if (permission !== "denied") {
                Notification.requestPermission(function(permission) {
                    if (permission === "granted") {
                        new Notification(notificationText);
                    }
                });
            }
        }

    }, false);
}
