# Coloring.js

Coloring.js is a small library for color generation and color conversion. It's super small and has no external dependencies. Currently it supports HSL(A), RGB(A), and HEX color formats.

**Color Generation** is done in such a way that the adjacent colors are well distributed and do not look very similar to each other. This is important in data visualization because colors are often used as a way to differentiate data. For example, on a line chart, it's important for all of the plotted lines to have different colors so that they are discernible from one another. The formulas used will be described in more detail below.

## Installation

You can download the library and include it on your page like so:

~~~ html
<script type='text/javascript' src='coloring.js'></script>
<script type='text/javascript'>
var color = coloringjs(0);
</script>
~~~

~~~ js
var coloringjs = require("./coloringjs");
var color = coloringjs(0);
~~~

## Usage

coloring.js accepts several forms of input: integers, color strings, or a settings object. If it does not receive one of those then it will return itself.

There are currently two different color generation algorithms supported, one makes use of the [Golden Ratio]() while the other makes use of the [Golden Angle](). By default the golden 'ratio' algorithm is used. See below for an example of each:

~~~ js
var GOLDEN_ANGLE = 137.5;
var GOLDEN_RATIO = 0.61803398875;
var MAX_HUE = 360;

// Golden Ratio Color Function
function(i) {
  for (n = 0; n <= i; n++) {
    this._h += GOLDEN_RATIO;
    this._h %= 1;
  }
  this._h = Math.round(this._h * MAX_HUE);
}

// Golden Angle Color Function
function(i) {
  if (i !== 0) {
    this._h = (GOLDEN_ANGLE * i) % MAX_HUE;
  }
}
~~~

Passing in an **integer** will pass that value to the .color() method which will then use the default algorithm to set the color. Then you can use the .toString() method to output the color.

Passing in a **string** will attempt to parse the color string, from there you can use the .toString() method to output the string in the default string format.

Passing in an **object** will attempt to parse the object and look for keys that match up to coloring.js methods that set defaults / settings for the coloringjs object.

## Methods

### Primary Methods

~~~ js
// To parse a color string.
coloring().parse('hsl(200,50%,50%)');

// To pass in a settings object.
coloring().settings({ format: 'rgb' });

// You can also pass settings with get/set functions.
coloring().format('hex');
coloring().format();
> 'hex'

// To output a text color string.
coloring().toString();
> 'hsl(0,0,0)'

// To generate a color string.
coloring().generate(3).toString();
> 'hsl(170, 50%, 50%)'

~~~

### Other Methods

**.alpha([int])**

This would get/set the alpha/opacity.

**.hue([int])**

This would get/set the current hue value.

**.saturation([int])**

This would get/set the current saturation value.

**.lightness([int])**

This would get/set the current lightness value.

**.colorFunction([string])**

This can be used to change the color function between 'ratio' or 'angle'.

cycleThreshold: function(threshold) {
  if (!arguments.length) return this._cycleThreshold;
  if (!isNaN(int)) this._cycleThreshold = threshold;
  return this;
},

format: function(format) {
  if (!arguments.length) return this._format;
  if (format == 'hsl' || format == 'rgb' || format == 'hex') {
    this._format = format;
  }
  return this;
},

incrementLightness: function(int) {
  if (!arguments.length) return this._incrementLightness;
  if (!isNaN(int)) this._incrementLightness = int;
  return this;
},

incrementSaturation: function(int) {
  if (!arguments.length) return this._incrementSaturation;
  if (!isNaN(int)) this._incrementSaturation = int;
  return this;
},

settings: function(obj) {

},

startHue: function(int) {
  if (!arguments.length) return this._startHue;
  if (!isNaN(int)) this._startHue = int;
  return this;
},

startSaturation: function(int) {
  if (!arguments.length) return this._startSaturation;
  if (!isNaN(int)) this._startSaturation = int;
  return this;
},

startLightness: function(int) {
  if (!arguments.length) return this._startLightness;
  if (!isNaN(int)) this._startLightness = int;
  return this;
},

generate: function(i) {

},

parse: function(str) {

},

toString: function(format) {

},

toHexString: function() {
  var rgbObj = hslToRgb(this._h, this._s, this._l);
  var r = Math.round(rgbObj.r);
  var g = Math.round(rgbObj.g);
  var b = Math.round(rgbObj.b);
  var hexCode = rgbToHex(r, g, b);

  return '#' + hexCode;
},

toHslString: function() {
  var h = (this._h);
  var s = (this._s);
  var l = (this._l);

  return (this._a == 1) ?
    "hsl("  + h + ", " + s + "%, " + l + "%)" :
    "hsla(" + h + ", " + s + "%, " + l + "%, "+ this._a + ")";
},

toRgbString: function() {
  var rgbObj = hslToRgb(this._h, this._s, this._l);
  var r = Math.round(rgbObj.r);
  var g = Math.round(rgbObj.g);
  var b = Math.round(rgbObj.b);

  return (this._a == 1) ?
    "rgb("  + r + ", " + g + ", " + b + ")" :
    "rgba(" + r + ", " + g + ", " + b + ", " + this._a + ")";
}


## Examples



## Acknowledgement
