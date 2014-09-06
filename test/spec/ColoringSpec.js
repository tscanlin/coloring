describe("Coloring", function(window) {
  // if (window === undefined) coloring = require('./coloring.js');
  var color, coloringjs = coloring;

  beforeEach(function() {
    color = null;
    coloring = coloringjs;
  });

  it("should start out black w/ alpha 1", function() {
    color = coloring();
    expect(color._h).toBe(0);
    expect(color._s).toBe(0);
    expect(color._l).toBe(0);
    expect(color._a).toBe(1);
  });

  it("should have these default settings", function() {
    color = coloring();
    expect(color._colorFunction).toBe("ratio");
    expect(color._cycleThreshold).toBe(144);
    expect(color._format).toBe("hsl");
    expect(color._startHue).toBe(0);
    expect(color._startSaturation).toBe(50);
    expect(color._startLightness).toBe(50);
  });

  describe("Methods", function() {

    describe(".generate() should", function() {
      it("generate well distributed colors with the GOLDEN RATIO algorithm", function() {
        color = coloring();

        var ints = [0, 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];
        var colors = [222, 85, 307, 32, 202, 182, 142, 62, 261, 301, 19, 175];

        // Make sure it works when passed directly.
        for (var n = 0; n < ints.length; n++) {
          color = coloring(ints[n]);
          expect(color._h).toBe(colors[n]);
        }

        // Make sure it works when passed via the .color() method.
        for (n = 0; n < ints.length; n++) {
          color = coloring().generate(ints[n]);
          expect(color._h).toBe(colors[n]);
        }
      });

      it("generate well distributed colors with the GOLDEN ANGLE algorithm", function() {
        var ints = [0, 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];
        var colors = [0, 137.5, 275, 190, 20, 40, 80, 160, 320, 280, 200, 40];

        // Set the color function.
        color = coloring({ colorFunction: 'angle' });

        // Make sure it works when passed via the .color() method.
        for (n = 0; n < ints.length; n++) {
          color.generate(ints[n]);
          expect(color._h).toBe(colors[n]);
        }
      });

      it("return different saturation and lightness for values past a certain point", function() {
        var ints = [50, 100, 150, 200, 300, 400, 500, 1000];
        var saturation = [50, 50, 54, 54, 58, 62, 62, 78];
        var lightness = [50, 50, 48, 48, 46, 44, 44, 36];

        // Make sure it works when passed via the .color() method.
        for (n = 0; n < ints.length; n++) {
          color = coloring();
          color.generate(ints[n]);
          expect(color._s).toBe(saturation[n]);
          expect(color._l).toBe(lightness[n]);
        }
      });
    });

    describe(".parse() should", function() {
      it("be able to parse HSL strings", function() {
        color = coloring();

        color.parse('hsl(0,0%,0%)');
        expect(color._h).toBe(0);
        expect(color._s).toBe(0);
        expect(color._l).toBe(0);
        expect(color._a).toBe(1);

        color.parse('hsla(200, 50%,50%, 1)');
        expect(color._h).toBe(200);
        expect(color._s).toBe(50);
        expect(color._l).toBe(50);
        expect(color._a).toBe(1);

        color.parse('hsla(10, 20%, 90%, 0.5)');
        expect(color._h).toBe(10);
        expect(color._s).toBe(20);
        expect(color._l).toBe(90);
        expect(color._a).toBe(0.5);

        // Invalid so stays the same as before.
        color.parse('hsla(,,)');
        expect(color._h).toBe(10);
        expect(color._s).toBe(20);
        expect(color._l).toBe(90);
        expect(color._a).toBe(0.5);

        color.parse('hsla(730,5%,150%,0.8)');
        expect(color._h).toBe(730);
        expect(color._s).toBe(5);
        expect(color._l).toBe(150);
        expect(color._a).toBe(0.8);
      });

      it("be able to parse RGB strings", function() {
        color = coloring();

        color.parse('rgb( 0,0,0)');
        expect(color._h).toBe(0);
        expect(color._s).toBe(0);
        expect(color._l).toBe(0);
        expect(color._a).toBe(1);

        color.parse('rgb(255, 255,255 )');
        expect(color._h).toBe(0);
        expect(color._s).toBe(0);
        expect(color._l).toBe(100);
        expect(color._a).toBe(1);

        color.parse('rgba(-100,200,50, 0.4)');
        expect(color._h).toBe(100);
        expect(color._s).toBe(60);
        expect(color._l).toBe(49);
        expect(color._a).toBe(0.4);

        // Invalid so stays the same as before.
        color.parse('rgb(pass)');
        expect(color._h).toBe(100);
        expect(color._s).toBe(60);
        expect(color._l).toBe(49);
        expect(color._a).toBe(0.4);

        color.parse('rgba(500,300,50, 0.9)');
        expect(color._h).toBe(60);
        expect(color._s).toBe(100);
        expect(color._l).toBe(60);
        expect(color._a).toBe(0.9);
      });

      it("be able to parse HEX strings", function() {
        color = coloring();

        color.parse('#00FFCC');
        expect(color._h).toBe(168);
        expect(color._s).toBe(100);
        expect(color._l).toBe(50);
        expect(color._a).toBe(1);

        color.parse('#AAA');
        expect(color._h).toBe(0);
        expect(color._s).toBe(0);
        expect(color._l).toBe(67);
        expect(color._a).toBe(1);

        // Invalid so stays the same as before.
        color.parse('#');
        expect(color._h).toBe(0);
        expect(color._s).toBe(0);
        expect(color._l).toBe(67);
        expect(color._a).toBe(1);

        color.parse('#00CC22');
        expect(color._h).toBe(130);
        expect(color._s).toBe(100);
        expect(color._l).toBe(40);
        expect(color._a).toBe(1);

        color.parse('#bada55');
        expect(color._h).toBe(74);
        expect(color._s).toBe(64);
        expect(color._l).toBe(59);
        expect(color._a).toBe(1);

        color.parse('#3FB');
        expect(color._h).toBe(160);
        expect(color._s).toBe(100);
        expect(color._l).toBe(60);
        expect(color._a).toBe(1);
      });
    });

    describe(".to[*]String() methods should", function() {

      it("return a HSL string", function() {
        color = coloring();
        var str;

        str = color.parse('#3FB').toHslString();
        expect(str).toBe('hsl(160, 100%, 60%)');

        str = color.parse('#bada55').toHslString();
        expect(str).toBe('hsl(74, 64%, 59%)');

        str = coloring().toHslString();
        expect(str).toBe('hsl(0, 0%, 0%)');
      });

      it("return a RGB string", function() {
        color = coloring();
        var str;

        str = color.parse('#3FB').toRgbString();
        expect(str).toBe('rgb(51, 255, 187)');

        str = color.parse('hsl(10, 50, 50)').toRgbString();
        expect(str).toBe('rgb(191, 85, 64)');

        str = coloring().toRgbString();
        expect(str).toBe('rgb(0, 0, 0)');
      });

      it("return a HEX string", function() {
        color = coloring();
        var str;

        str = color.parse('#3FB').toHexString();
        expect(str).toBe('#33ffbb');

        str = color.parse('hsl(10, 50, 50)').toHexString();
        expect(str).toBe('#bf5540');

        str = coloring().toHexString();
        expect(str).toBe('#000000');
      });

      it("return the correct string based on settings", function() {
        color = coloring();
        var str;

        str = color.parse('#3FB').toString();
        expect(str).toBe('hsl(160, 100%, 60%)');

        // Set color to HEX.
        color.settings({ format: 'hex' });

        str = color.parse('hsl(180, 85%, 38%)').toString();
        expect(str).toBe('#0fb3b3');

        expect(color.format()).toBe('hex');

        // Set color to RGB.
        color.format('rgb');

        str = color.parse('hsl(80, 55%, 47%)').toString();
        expect(str).toBe('rgb(142, 186, 54)');

        str = coloring().toString();
        expect(str).toBe('hsl(0, 0%, 0%)');
      });
    });

    describe(".settings() and other Get/Set methods", function() {
      it("set settings with an object", function() {
        color = coloring();

        expect(color.format()).toBe('hsl');
        expect(color.colorFunction()).toBe('ratio');

        color.settings({ format: 'hex', colorFunction: 'angle' });

        expect(color.format()).toBe('hex');
        expect(color.colorFunction()).toBe('angle');
      });

      it("set settings with get/set methods", function() {
        color = coloring();

        color.format('rgb');
        expect(color.format()).toBe('rgb');

        expect(color.colorFunction()).toBe('ratio');
        color.colorFunction('angle');
        expect(color.colorFunction()).toBe('angle');
        color.colorFunction('ratio');
        expect(color.colorFunction()).toBe('ratio');
      });

    });

  });

  function add2DOM(color) {
    document.querySelector('#display').innerHTML += '<div class="box" style="background:'+ color.toHexString() +'"></div>' +
                                                    '<div class="box" style="background:'+ color.toHslString() +'"></div>' +
                                                    '<div class="box" style="background:'+ color.toRgbString() +'"></div>';
  }

});
