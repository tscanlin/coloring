(function() {

  'use strict';

  /*global define, module, exports, require */

  // TODO: random start hue option

  var GOLDEN_ANGLE = 137.5;
  var GOLDEN_RATIO = 0.61803398875;
  var MAX_HUE = 360;

  var coloring, Coloring;
  coloring = Coloring = function coloring(input) {
    var num, string, obj;

    if (!(this instanceof coloring)) {
      return new Coloring(input);
    }

    this.version = '0.0.5';

    this._colorFunction = 'ratio';
    this._cycleThreshold = 144;
    this._format = 'hsl';

    this._incrementLightness = -2;
    this._incrementSaturation = 4;

    this._startHue = 0;
    this._startSaturation = 50;
    this._startLightness = 50;

    this._h = 0;
    this._s = 0;
    this._l = 0;
    this._a = 1;

    if (!isNaN(input)) {
      num = input || 0;
      return this.generate(num);
    }
    else if (typeof input === 'string') {
      string = input;
      return this.parse(string);
    }
    else if (typeof input === 'object') {
      obj = input;
      return this.settings(obj);
    }
    else if (input === undefined) {
      return this;
    }
    else {
      console.log('[coloring.js] Invalid input.');
      return this;
    }
  };

  coloring.prototype = {

    hue: function(int) {
      if (!arguments.length) return this._h;
      if (!isNaN(int)) this._h = int % MAX_HUE;
      return this;
    },

    saturation: function(int) {
      if (!arguments.length) return this._s;
      if (!isNaN(int)) this._s = int;
      return this;
    },

    lightness: function(int) {
      if (!arguments.length) return this._l;
      if (!isNaN(int)) this._l = int;
      return this;
    },

    alpha: function(float) {
      if (!arguments.length) return this._a;
      var a = parseFloat(float);
      if (isNaN(a) || a < 0 || a > 1) {
        a = 1;
      }
      this._a = a;
      return this;
    },

    colorFunction: function(func) {
      if (!arguments.length) return this._colorFunction;
      if (func == 'ratio' || func == 'angle') {
        this._colorFunction = func;
      }
      return this;
    },

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
      // Get.
      if (!arguments.length) {
        var ret = {};
        for (var key in this) {
          if (this[key] !== undefined) {
            var func = this[key].bind(this);
            // Just to be sure its a function.
            if (typeof(func) == "function") ret[key] = func();
          }
        }
        return ret;
      }
      // Set.
      else if (typeof obj === 'object') {
        for (var key2 in obj) {
          if (this[key2] !== undefined) {
            var func2 = this[key2].bind(this);
            // Just to be sure its a function.
            if (typeof(func2) == "function") func2(obj[key2]);
          }
        }
      }

      return this;
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
      var n;
      var loops = Math.round(i / this._cycleThreshold);
      this._h = this._startHue;
      this._s = this._startSaturation;
      this._l = this._startLightness;

      // Color function with the Golden Ratio.
      if (this._colorFunction == 'ratio') {
        for (n = 0; n <= i; n++) {
          this._h += GOLDEN_RATIO;
          this._h %= 1;
        }
        this._h = Math.round(this._h * MAX_HUE);
      }
      // Color function with the Golden Angle.
      else if (this._colorFunction == 'angle') {
        if (i !== 0) {
          this._h = (GOLDEN_ANGLE * i) % MAX_HUE;
        }
      }
      else {
        console.warn('[coloring.js] Unknown color function.');
      }

      // This keeps colors unique even at very high values of i.
      // By changing both the saturation and the lightness.
      if (i >= this._cycleThreshold || i % this._cycleThreshold === 0) {
        this._s += (this._incrementSaturation) * loops;
        this._l += (this._incrementLightness) * loops;
      }

      return this;
    },

    parse: function(str) {
      var arr = [];
      var hslObj = {};
      var h = this._h;
      var s = this._s;
      var l = this._l;

      // Parse HSL & HSLA.
      if (str.indexOf('hsl') > -1) {
        arr = str.replace(/[^\d.,]/g, '').split(',');
        this._h = parseInt(arr[0]);
        this._s = parseInt(arr[1]);
        this._l = parseInt(arr[2]);
        if (arr[3] !== undefined) this._a = +arr[3];
      }
      // Parse RGB & RGBA.
      else if (str.indexOf('rgb') > -1) {
        arr = str.replace(/[^\d.,]/g, '').split(',');
        hslObj = rgbToHsl(arr[0], arr[1], arr[2]);
        this._h = Math.round(hslObj.h * MAX_HUE);
        this._s = Math.round(hslObj.s * 100);
        this._l = Math.round(hslObj.l * 100);
        if (arr[3] !== undefined) this._a = +arr[3];
      }
      // Parse HEX.
      else if (str.indexOf('#') > -1) {
        arr = str.split('#')[1].match(/.{1,2}/g);
        // Add support for parsing 3 character hex codes.
        if (str.length < 5) {
          arr = str.split('#')[1];
          arr = arr.split('').map(function(l) { return ''+l+l; });
        }
        hslObj = rgbToHsl(parseIntFromHex(arr[0]), parseIntFromHex(arr[1]), parseIntFromHex(arr[2]));
        this._h = Math.round(hslObj.h * MAX_HUE);
        this._s = Math.round(hslObj.s * 100);
        this._l = Math.round(hslObj.l * 100);
      }
      else {
        console.log('[coloring.js] Unable to parse color.');
      }

      if (isNaN(this._h)) {
        this._h = h;
        console.log('[coloring.js] Unable to parse hue.');
      }

      if (isNaN(this._s)) {
        this._s = s;
        console.log('[coloring.js] Unable to parse saturation.');
      }

      if (isNaN(this._l)) {
        this._l = l;
        console.log('[coloring.js] Unable to parse lightness.');
      }

      return this;
    },

    toString: function(format) {
      format = format || this._format;

      if (format === "hsl") {
        return this.toHslString();
      }
      else if (format === "rgb") {
        return this.toRgbString();
      }
      else if (format === "hex") {
        return this.toHexString();
      }
      else {
        return this.toHslString();
      }
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
  };

  // The below functions were copied from: https://github.com/bgrins/TinyColor
  // Which had been modified from: http://web.archive.org/web/20081227003853/http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
  // Which are based on formulas found on Wikipedia: http://en.wikipedia.org/wiki/HSL_and_HSV
  function hslToRgb(h, s, l) {
    var r, g, b;

    h = bound01(h, MAX_HUE);
    s = bound01(s, 100);
    l = bound01(l, 100);

    function hue2rgb(p, q, t) {
      if(t < 0) t += 1;
      if(t > 1) t -= 1;
      if(t < 1/6) return p + (q - p) * 6 * t;
      if(t < 1/2) return q;
      if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    if(s === 0) {
      r = g = b = l; // achromatic
    }
    else {
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return { r: r * 255, g: g * 255, b: b * 255 };
  }

  function rgbToHex(r, g, b) {
    var hex = [
        pad2(Math.round(r).toString(16)),
        pad2(Math.round(g).toString(16)),
        pad2(Math.round(b).toString(16))
    ];

    return hex.join('');
  }

  function rgbToHsl(r, g, b) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min) {
        h = s = 0; // achromatic
    }
    else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }

      h /= 6;
    }

    return { h: h, s: s, l: l };
  }

  function bound01(n, max) {
    if (isOnePointZero(n)) { n = "100%"; }

    var processPercent = isPercentage(n);
    n = Math.min(max, Math.max(0, parseFloat(n)));

    if (processPercent) {
      n = parseInt(n * max, 10) / 100;
    }
    if ((Math.abs(n - max) < 0.000001)) {
      return 1;
    }

    return (n % max) / parseFloat(max);
  }

  function parseIntFromHex(val) {
    return parseInt(val, 16);
  }

  function isOnePointZero(n) {
    return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
  }

  function isPercentage(n) {
    return typeof n === "string" && n.indexOf('%') != -1;
  }

  function pad2(c) {
    return c.length == 1 ? '0' + c : '' + c;
  }
  // End copied formulas.

  // Node.js export.
  if (typeof module !== "undefined" && module.exports) {
    module.exports = coloring;
  }
  else if (typeof define === 'function' && define.amd) {
    define(function () {return coloring;});
  }
  else {
    window.coloring = coloring;
  }

})();
