// Color

function Color(red, green, blue, alpha) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = alpha;
}

Color.prototype.getRelativeLuminance = function() {
    return 0.2126 * this.red + 0.7152 * this.green + 0.0722 * this.blue;
}

// Filter

function Filter() { }

Filter.prototype.process = function(imageData) { }

// BasicFilter

function BasicFilter() { }

BasicFilter.prototype = new Filter();

BasicFilter.prototype.process = function(imageData) {
    for (var i = 0; i < imageData.data.length; i += 4) {
        // Read the color data
        var red = imageData.data[i];
        var green = imageData.data[i + 1];
        var blue = imageData.data[i + 2];
        var alpha = imageData.data[i + 3];

        // Prepare the color
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

// GrayscaleFilter

function GrayscaleFilter() { }

GrayscaleFilter.prototype = new BasicFilter();

GrayscaleFilter.prototype.processPixel = function(color) {
    var relativeLuminance = color.getRelativeLuminance();
    color.red = relativeLuminance;
    color.green = relativeLuminance;
    color.blue = relativeLuminance;
}

// FadeFilter

function FadeFilter() {
    this.strength = 0.25;
    this.exponent = 3;
    this.brightness = 128;
}

FadeFilter.prototype = new BasicFilter();

FadeFilter.prototype.processPixel = function(color) {
    var red = color.red * (1 - this.strength) + this.brightness * this.strength;
    var green = color.green * (1 - this.strength) + this.brightness * this.strength;
    var blue = color.blue * (1 - this.strength) + this.brightness * this.strength;

    var t = 1 - color.getRelativeLuminance() / 255;
    t = Math.pow(t, this.exponent);
    color.red = color.red * (1 - t) + red * t;
    color.green = color.green * (1 - t) + green * t;
    color.blue = color.blue * (1 - t) + blue * t;
}

// TestFilter

function TestFilter() { }

TestFilter.prototype = new BasicFilter();

TestFilter.prototype.processPixel = function(color) {

}
