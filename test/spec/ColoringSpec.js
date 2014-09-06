describe("Coloring", function() {
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

  describe("when passed a parameter", function() {
    // beforeEach(function() {
    //   player.play(song);
    //   player.pause();
    // });
    //

    it("should return different hues for integers, using the golden ratio algorithm", function() {
      var ints = [0, 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];
      var colors = [222, 85, 307, 32, 202, 182, 142, 62, 261, 301, 19, 175];

      // Make sure it works when passed directly.
      for (var n = 0; n < ints.length; n++) {
        color = coloring(ints[n]);
        expect(color._h).toBe(colors[n]);
        // expect(color._a).toBe(1);
      }

      // Make sure it works when passed via the .color() method.
      for (n = 0; n < ints.length; n++) {
        color = coloring().generate(ints[n]);
        expect(color._h).toBe(colors[n]);
      }
    });

    it("should return different hues for integers, using the golden angle algorithm", function() {
      var ints = [0, 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];
      var colors = [0, 137.5, 275, 190, 20, 40, 80, 160, 320, 280, 200, 40];

      color = coloring({ colorFunction: 'angle' });

      // Make sure it works when passed via the .color() method.
      for (n = 0; n < ints.length; n++) {
        color.generate(ints[n]);
        expect(color._h).toBe(colors[n]);
      }
    });

    it("should return different saturation and lightness for values past a certain point", function() {
      var ints = [50, 100, 150, 200, 300, 400, 500, 1000];
      var saturation = [50, 50, 54, 54, 58, 62, 62, 78];
      var lightness = [50, 50, 48, 48, 46, 44, 44, 36];
      // var colors = [0, 137.5, 275, 190, 20, 40, 80, 160, 320, 280, 200, 40];

      // Make sure it works when passed via the .color() method.
      for (n = 0; n < ints.length; n++) {
        color = coloring();
        color.generate(ints[n]);
        expect(color._s).toBe(saturation[n]);
        expect(color._l).toBe(lightness[n]);
      }
    });

  });

  describe("when calling different methods", function() {
    it(".parse() should be able to parse hsl strings", function() {
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

      color.parse('hsla(730,5%,150%,0.8)');
      expect(color._h).toBe(730);
      expect(color._s).toBe(5);
      expect(color._l).toBe(150);
      expect(color._a).toBe(0.8);
    });

    it(".parse() should be able to parse rgb strings", function() {
      color = coloring();

      color.parse('rgb(0,0,0)');
      expect(color._h).toBe(0);
      expect(color._s).toBe(0);
      expect(color._l).toBe(0);
      expect(color._a).toBe(1);
      console.log(color.toRgbString());

      color.parse('rgb(255, 255,255 )');
      expect(color._h).toBe(0);
      expect(color._s).toBe(0);
      expect(color._l).toBe(100);
      expect(color._a).toBe(1);
      console.log(color.toHslString());

      color.parse('rgba(100,200,50, 0.4)');
      expect(color._h).toBe(100);
      expect(color._s).toBe(60);
      expect(color._l).toBe(49);
      expect(color._a).toBe(0.4);
      console.log(color.toRgbString());

    });


  });

});
