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
    this.intensity = 0;
}

BrightnessFilter.prototype = new BasicFilter();

BrightnessFilter.prototype.processPixel = function(color) {
    color.red = color.red + this.intensity;
    color.green = color.green + this.intensity;
    color.blue = color.blue + this.intensity;
}

// ContrastFilter

function ContrastFilter() {
    this.intensity = 1;
}

ContrastFilter.prototype = new BasicFilter();

ContrastFilter.prototype.processPixel = function(color) {
    color.red = (color.red - 128) * this.intensity + 128;
    color.green = (color.green - 128) * this.intensity + 128;
    color.blue = (color.blue - 128) * this.intensity + 128;
}

// SaturationFilter

function SaturationFilter() {
    this.intensity = 1;
}

SaturationFilter.prototype = new BasicFilter();

SaturationFilter.prototype.processPixel = function(color) {
    var relativeLuminance = color.getRelativeLuminance();
    color.red = relativeLuminance + (color.red - relativeLuminance) * this.intensity;
    color.green = relativeLuminance + (color.green - relativeLuminance) * this.intensity;
    color.blue = relativeLuminance + (color.blue - relativeLuminance) * this.intensity;
}

// ColorBalanceFilter

function ColorBalanceFilter() {
    this.redIntensity = 1;
    this.greenIntensity = 1;
    this.blueIntensity = 1;
}

ColorBalanceFilter.prototype = new BasicFilter();

ColorBalanceFilter.prototype.processPixel = function(color) {
    color.red = color.red * this.redIntensity;
    color.green = color.green * this.greenIntensity;
    color.blue = color.blue * this.blueIntensity;
}

// TemperatureFilter

function TemperatureFilter() {
    this.warmth = 0;
}

TemperatureFilter.prototype = new BasicFilter();

TemperatureFilter.prototype.processPixel = function(color) {
    color.red = color.red + this.warmth;
    color.blue = color.blue - this.warmth;
}

// FadeFilter

function FadeFilter() {
    this.intensity = 0.25;
    this.shade = 128;
    this.tolerance = 3;
}

FadeFilter.prototype = new BasicFilter();

FadeFilter.prototype.processPixel = function(color) {
    // Calculate the faded color
    var fadedRed = color.red * (1 - this.intensity) + this.shade * this.intensity;
    var fadedGreen = color.green * (1 - this.intensity) + this.shade * this.intensity;
    var fadedBlue = color.blue * (1 - this.intensity) + this.shade * this.intensity;

    // Interpolate between the original color and the faded color based on how dark the original color is
    var t = Math.pow(1 - color.getRelativeLuminance() / 255, this.tolerance);
    color.red = color.red * (1 - t) + fadedRed * t;
    color.green = color.green * (1 - t) + fadedGreen * t;
    color.blue = color.blue * (1 - t) + fadedBlue * t;

    // Make sure that the faded color is not darker than the faded black color
    var threshold = this.shade * this.intensity;
    color.red = Math.max(color.red, threshold);
    color.green = Math.max(color.green, threshold);
    color.blue = Math.max(color.blue, threshold);
}

// GrainFilter

function GrainFilter() {
    this.intensity = 0.05;
}

GrainFilter.prototype = new BasicFilter();

GrainFilter.prototype.processPixel = function(color) {
    var modifier = randomNormal() * 64 * this.intensity;
    color.red = color.red + modifier;
    color.green = color.green + modifier;
    color.blue = color.blue + modifier;
}
