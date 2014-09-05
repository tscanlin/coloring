(function (window) {

  'use strict';

  /*global define, module, exports, require */

  // can take an options object.
  // can take string to convert to whatever.
  // error catching for bad colors#####################

  // Many of the color conversion functions have been taken from:
  // TinyColor.js: https://github.com/bgrins/TinyColor

  var GOLDEN_ANGLE = 137.5;
  var GOLDEN_RATIO = 0.61803398875;

  var coloringjs, Coloringjs;

  coloringjs = Coloringjs = function coloringjs(input) {
    var num, string, obj;

    if (!(this instanceof coloringjs)) {
      return new Coloringjs(input);
    }

    this.version = '0.0.1';

    this.colorFunction = 'ratio';
    this.cycleThreshold = 144;
    this.format = 'hsl';

    this.incrementLightness = -2;
    this.incrementSaturation = 4;

    this.maxHue = 360;
    this.startHue = 0;
    this.startSaturation = 50;
    this.startLightness = 50;

    this._h = 0;
    this._s = 0;
    this._l = 0;
    this._a = 1;

    if (!isNaN(input)) {
      num = input || 0;
      return this.color(num);
    }
    else if (typeof input === 'string') {
      string = input;
      return this.parse(string);
    }
    else if (typeof input === 'object') {
      obj = input;
      for (var key in obj) {
        if (this[key] !== undefined) {
          this[key] = obj[key];
        }
      }
      return this;
    }
    else if (input === undefined) {
      return this;
    }
    else {
      console.log('[coloring.js] Invalid input.');
      return this;
    }

  };

  coloringjs.prototype = {

    getAlpha: function() {
      return this._a;
    },

    setAlpha: function(value) {
      var a = parseFloat(value);
      if (isNaN(a) || a < 0 || a > 1) {
        a = 1;
      }
      this._a = a;

      return this;
    },

    color: function(i) {
      var n;
      var loops = Math.round(i / this.cycleThreshold);
      this._h = this.startHue;
      this._s = this.startSaturation;
      this._l = this.startLightness;

      // Color function with the Golden Ratio.
      if (this.colorFunction == 'ratio') {
        for (n = 0; n <= i; n++) {
          this._h += GOLDEN_RATIO;
          this._h %= 1;
        }
        this._h = Math.round(this._h * 360);
      }

      // Color function with the Golden Angle.
      else if (this.colorFunction == 'angle') {
        if (i !== 0) {
          this._h = (GOLDEN_ANGLE * i) % this.maxHue;
        }
      }

      else {
        console.warn('[coloring.js] Unknown color function.');
      }

      // This keeps colors unique even at very high values of i.
      // By changing both the saturation and the lightness.
      if (i >= this.cycleThreshold || i % this.cycleThreshold === 0) {
        this._s += (this.incrementSaturation) * loops;
        this._l += (this.incrementLightness) * loops;
      }

      return this;
      // return 'hsl: '+ this.toHslString() + ' // rgb: ' + this.toRgbString() + ' // hex: ' + this.();
    },

    parse: function(str) {
      var arr = [];
      var hslObj = {};

      // Parse HSL & HSLA.
      if (str.indexOf('hsl') > -1) {
        arr = str.replace(/[^\d.,]/g, '').split(',');
        this._h = +arr[0];
        this._s = +arr[1];
        this._l = +arr[2];
        if (arr[3] !== undefined) this._a = +arr[3];
      }
      // Parse RGB & RGBA.
      else if (str.indexOf('rgb') > -1) {
        arr = str.replace(/[^\d.,]/g, '').split(',');
        hslObj = rgbToHsl(arr[0], arr[1], arr[2]);
        this._h = Math.round(hslObj.h * 360);
        this._s = Math.round(hslObj.s * 100);
        this._l = Math.round(hslObj.l * 100);
        if (arr[3] !== undefined) this._a = +arr[3];
      }
      // Parse HEX.
      else if (str.indexOf('#') > -1) {
        arr = str.split('#')[1].match(/.{1,2}/g);
        hslObj = rgbToHsl(parseIntFromHex(arr[0]), parseIntFromHex(arr[1]), parseIntFromHex(arr[2]));
        this._h = Math.round(hslObj.h * 360);
        this._s = Math.round(hslObj.s * 100);
        this._l = Math.round(hslObj.l * 100);
      }
      else {
        console.log('[coloring.js] Unable to parse color.');
      }

      return this;
    },

    toString: function(format) {
      format = format || this.format;

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


  function hslToRgb(h, s, l) {
    var r, g, b;

    h = bound01(h, 360);
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


  window.c = coloringjs(2);
  coloringjs({a: 123, _a: 0.2});
  console.log(coloringjs().toString());
  // console.log(c.color(2));

  // console.log(c.parse('rgba(191, 64, 176)'));
  // console.log(c.parse('hsl(20, 50%, 50%)'));
  // console.log(c.parse('#00CC00'));



  // Node.js export.
  if (typeof module !== "undefined" && module.exports) {
    module.exports = coloringjs;
  }
  else if (typeof define === 'function' && define.amd) {
    define(function () {return coloringjs;});
  }
  else {
    window.coloringjs = coloringjs;
  }

})(window);
