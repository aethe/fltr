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

function Filter() {
    // Every filter should support the intensity value
    this.intensity = 1; /* 0...1 */
}

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

        // Read the color data back and apply intensity
        red = Math.round(color.red * this.intensity + red * (1 - this.intensity));
        green = Math.round(color.green * this.intensity + green * (1 - this.intensity));
        blue = Math.round(color.blue * this.intensity + blue * (1 - this.intensity));
        alpha = Math.round(color.alpha * this.intensity + alpha * (1 - this.intensity));

        // Write the result back
        imageData.data[i] = red;
        imageData.data[i + 1] = green;
        imageData.data[i + 2] = blue;
        imageData.data[i + 3] = alpha;
    }
}

BasicFilter.prototype.processPixel = function(color) { }

// ConvolutionFilter

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

// GrayscaleFilter

function GrayscaleFilter() { }

GrayscaleFilter.prototype = new BasicFilter();

GrayscaleFilter.prototype.processPixel = function(color) {
    var relativeLuminance = color.getRelativeLuminance();
    color.red = relativeLuminance;
    color.green = relativeLuminance;
    color.blue = relativeLuminance;
}
