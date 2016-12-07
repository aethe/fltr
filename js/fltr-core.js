// Random numbers

function randomUniform() {
    return Math.random();
}

function randomNormal() {
    var u = 1 - randomUniform();
    var v = 1 - randomUniform();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

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

// InvertFilter

function InvertFilter() { }

InvertFilter.prototype = new BasicFilter();

InvertFilter.prototype.processPixel = function(color) {
    color.red = 255 - color.red;
    color.green = 255 - color.green;
    color.blue = 255 - color.blue;
}

// BrightnessFilter

function BrightnessFilter() {
    this.value = 0;
}

BrightnessFilter.prototype = new BasicFilter();

BrightnessFilter.prototype.processPixel = function(color) {
    color.red = color.red + this.value;
    color.green = color.green + this.value;
    color.blue = color.blue + this.value;
}

// ContrastFilter

function ContrastFilter() {
    this.value = 1;
}

ContrastFilter.prototype = new BasicFilter();

ContrastFilter.prototype.processPixel = function(color) {
    color.red = (color.red - 128) * this.value + 128;
    color.green = (color.green - 128) * this.value + 128;
    color.blue = (color.blue - 128) * this.value + 128;
}

// FadeFilter

function FadeFilter() {
    this.strength = 0.25;
    this.exponent = 3;
    this.brightness = 128;
}

FadeFilter.prototype = new BasicFilter();

FadeFilter.prototype.processPixel = function(color) {
    // Calculate the faded color
    var fadedRed = color.red * (1 - this.strength) + this.brightness * this.strength;
    var fadedGreen = color.green * (1 - this.strength) + this.brightness * this.strength;
    var fadedBlue = color.blue * (1 - this.strength) + this.brightness * this.strength;

    // Interpolate between the original color and the faded color based on how dark the original color is
    // TODO: It might be a good idea to calculate the interpolation factor for each channel separately
    var t = Math.pow(1 - color.getRelativeLuminance() / 255, this.exponent);
    color.red = color.red * (1 - t) + fadedRed * t;
    color.green = color.green * (1 - t) + fadedGreen * t;
    color.blue = color.blue * (1 - t) + fadedBlue * t;

    // Make sure that the faded color is not darker than the faded black color
    var threshold = this.brightness * this.strength;
    color.red = Math.max(color.red, threshold);
    color.green = Math.max(color.green, threshold);
    color.blue = Math.max(color.blue, threshold);
}

// GrainFilter

function GrainFilter() {
    this.strength = 0.05;
}

GrainFilter.prototype = new BasicFilter();

GrainFilter.prototype.processPixel = function(color) {
    var modifier = randomNormal() * 255 * this.strength;
    color.red = color.red + modifier;
    color.green = color.green + modifier;
    color.blue = color.blue + modifier;
}
