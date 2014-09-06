# Coloring.js

Coloring.js is a small library for color generation and color conversion. It's super small and has no external dependencies. Currently it supports HSL(A), RGB(A), and HEX color formats.

**Color Generation** is done in such a way that the adjacent colors are well distributed and do not look very similar to each other. This is important in data visualization because colors are often used as a way to differentiate data. For example, on a line chart, it's important for all of the plotted lines to have different colors so that they are discernible from one another. The formulas used will be described in more detail below.

## Installation

You can download the library and include it on your page like so:

~~~ html
<script type='text/javascript' src='coloring.js'></script>
<script type='text/javascript'>
var color = coloring(0);
</script>
~~~

~~~ js
var coloring = require("./coloring");
var color = coloring(0);
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

This can be used to change the color function between 'ratio' or 'angle'. Defaults to 'ratio'.


**.cycleThreshold([int])**

This changes the threshold at which point the color generate function starts to change the saturation / lightness in order to not repeat colors. Defaults to 144 (recommended).


**.format([string])**

This would get/set the format. Possible values are 'hsl', 'hex', 'rgb'. Defaults to 'hsl'.


**.incrementLightness([int])**

This changes the lightness increment that's used together with the cycleThreshold to make sure colors don't repeat. Defaults to -2.


**.incrementSaturation([int])**

This changes the saturation increment that's used together with the cycleThreshold to make sure colors don't repeat. Defaults to 4.


**.settings([obj])**

This accepts an object and can be used to set different settings.


**.startHue([int])**

This can be used to get/set the starting hue value. Defaults to 0.


**.startSaturation([int])**

This can be used to get/set the starting saturation value. Defaults to 50.


**.startLightness([int])**

This can be used to get/set the starting lightness value. Defaults to 50.


**.generate(i)**

Accepts an integer and returns a color value (you still need to use toString() to get the output).


**.parse(str)**

Accepts a text color string in '#EF00BA', 'rgba(100, 150, 250, 0.3)', or 'hsl(40, 50%, 60%)', etc. forms. Currently only supports (HSL(A), RGB(A), or HEX).


**.toString([format])**

If no format parameter is specified than output to the default or preset _format value. Can be 'hsl', 'rgb', or 'hex'.


**.toHexString()**

Outputs current color as a HEX text string. Ex: '#CCFF00'.


**.toHslString()**

Outputs current color as a HSL text string. Ex: 'hsl(200, 50%, 40%)'.


**.toRgbString()**

Outputs current color as a RGB text string. Ex: 'rgb(200, 150, 100)'.


## Acknowledgement

Some of the color conversion functions were copied from: https://github.com/bgrins/TinyColor.
Which had been modified from: http://web.archive.org/web/20081227003853/http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
Which are based on formulas found on Wikipedia: http://en.wikipedia.org/wiki/HSL_and_HSV
