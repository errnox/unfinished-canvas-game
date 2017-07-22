document.addEventListener('DOMContentLoaded', function(e) {

  var app = this;
  var helpers = new app.Helpers();

  app.Level = (function() {
    function cls(options) {
      var clss = this;

      clss.init = function(options) {
        var self = this;
        // Initialize
        clss.context = options.context;
        clss.game = options.game;
        clss.image = options.image;
        clss.camera = options.camera;
        clss.width = options.width;
        clss.height = options.height;
        clss.boxWidth = 32;
        clss.boxHeight = self.boxWidth;
        clss.platforms = [];

        clss.numChambersX = 3;
        clss.numChambersY = 3;
        clss.chambers = [];

        self.blockTypes = {
          'd': function(x, y) { return new app.Dirt({
            context: self.context,
            image: self.image,
            x: x,
            y: y,
            solid: true,
          }); },
          'D': function(x, y) { return new app.Dirt({
            context: self.context,
            image: self.image,
            x: x,
            y: y,
            solid: false,
            layer: -1,
          }); },
          's': function(x, y) { return new app.Stone({
            context: self.context,
            image: self.image,
            x: x,
            y: y,
            solid: true,
          }); },
          'S': function(x, y) { return new app.HalfStone({
            context: self.context,
            image: self.image,
            x: x,
            y: y,
            solid: true,
          }); },
          'g': function(x, y) { return new app.Grass({
            context: self.context,
            image: self.image,
            x: x,
            y: y,
            solid: true,
            layer: 1,
          }) },
          'c': function(x, y) {
	    var coin = self.generateCoin(x, y);
	    // var obj = {
	    //   type: coin.type,
	    //   x: coin.x,
	    //   y: coin.y,
	    //   width: coin.width,
	    //   height: coin.height,
	    // };
	    return coin; },
          'w': function(x, y) { return new app.Water({
            context: self.context,
            image: self.image,
            x: x,
            y: y,
            solid: false,
            layer: 1,
          }) },
          'l': function(x, y) { return new app.Ladder({
            context: self.context,
            image: self.image,
            x: x,
            y: y,
            solid: false,
          }) },
          '.': function(x, y) { return null; },
        };

        clss.movementSpeed = 40;
        for (var x = 0; x < self.numChambersX; x++) {
          self.chambers.push([]);
          for (var y = 0; y < self.numChambersY; y++) {
            self.chambers[x].push(null);
          }
        }
        // self.generateChambers(self.chambers.length / 2 - 1,
        //                       self.chambers[0].length / 2 - 1, 10);
        self.generateChambers(0, 0, 10);

        // DEBUG
        // var string = '';
        // for (var x = 0; x < self.chambers.length; x++) {
        //   for (var y = 0; y < self.chambers[x].length; y++) {
        //     var value = self.chambers[x][y];
        //     if (value != null) {
        //       string += 'x';
        //     } else {
        //       string += 'o';
        //     }
        //   }
        //   string += "\n";
        // }
        // console.log(string);  // DEBUG
        // console.log(JSON.stringify(self.chambers, undefined, 2));  // DEBUG
      };

      clss.generate = function() {
        var self = this;
        var chamber = null;
        var newChamber = null;
        for (var x = 0; x < self.numChambersX; x++) {
          for (var y = 0; y < self.numChambersY; y++) {
            chamber = self.chambers[x][y];
            if (chamber != null) {
              // self.generateChamberBlocks(chamber, x, y);
              self.generateBackground(chamber, x, y);
              self.generateChamberBlocksFromString([
                'sssssssssss......ssls',
                's....ww............ls',
                's.SS.ww......ddd...ls',
                's.sssww............ls',
                '.....wwgg.g........ls',
                '.....wwddddS.......l.',
                '...ccww..ddd.......l.',
                'sddddww.............s',
                's....ww.......DDDDD.s',
                's....ww.......DDD.sss',
                'sggg.ww.......DDSssss',
                'sdddwww......Sdddssss',
              ].join("\n"), chamber, x, y);
            } else {
              newChamber = new app.Chamber({
                type: 'filled',
                blocks: [new app.Box({
		  color: 'rgba(255, 0, 255)',
                  solid: true,
                  context: self.context,

                  x: self.width / self.boxWidth * x * self.boxWidth,
                  y: self.height / self.boxHeight * y * self.boxHeight,
                  width: self.width - 10,
                  height: self.height - 10,

                })],
              });
              self.chambers[x][y] = newChamber;
            }
          }
        }

        // DEBUG
        //
        // console.log(JSON.stringify(self.chambers, undefined, 2));  // DEBUG
        //
        // Chambers
        // var div = document.createElement('pre');
        // div.innerHTML = JSON.stringify(self.chambers, undefined, 2);
        // document.getElementsByTagName('body')[0].appendChild(div);
      };

      clss.generateChamberBlocks = function(chamber, chamberX, chamberY) {
        var self = this;
        var chamberX = chamberX || 0;
        var chamberY = chamberY || 0;
        var boxNames = [
          'dirt',
          'stone',
          'half-stone',
          'coin',
        ];
        var platformType = '';
        var sx = 0;
        var sy = 0;
        var dx = 0;
        var dy = 0;
        var noBlock = true;
        var previousWasBlock = false;
        var previousRowHadBlocks = false;
        var notThisRow = false;
        for (var y = 0; y < self.height / self.boxHeight - 1; y++) {
          notThisRow = helpers.choice([false, true, true, true, true]);
          if (notThisRow) {
            previousRowHadBlocks = true;
          } else {
            previousRowHadBlocks = false;
          }

          if (previousRowHadBlocks) {
            notThisRow = true;
          }
          for (var x = 0; x < self.width / self.boxWidth - 1; x++) {
            dx = chamberX * self.width + x * self.boxWidth;
            dy = chamberY * self.height + y * self.boxHeight;
            if (previousWasBlock) {
              noBlock = helpers.choice([true, false, false, false, false,
                                        // false, false, false, false,
                                        // false, false, false, false,
                                        // false, false, false, false,
                                        false, false, false, false]);

            } else {
              noBlock = helpers.choice([false, true, true, true, true,
                                        // true, true, true, true,
                                        // true, true, true, true,
                                        // true, true, true, true,
                                        true, true, true, true]);
            }
            if (notThisRow) {
              noBlock = true;
            }
            if (noBlock) {
              platformType = null;
              previousWasBlock = false;
            } else {
              platformType = helpers.choice(boxNames);
              previousWasBlock = true;
            }

            if (platformType == 'dirt') {
              sx = 0;
              sy = 32 * 7;
              chamber.blocks.push(self.generateBox(
                {sx: sx, sy: sy, x: dx, y: dy}));
              // Grass cover
              sx = 32 * 2;
              sy = 32 * 8;
              chamber.blocks.push(self.generateBox(
                {sx: sx, sy: sy, x: dx, y: dy - self.boxHeight,
                 halfBlock: true, solid: false}));
            } else if (platformType == 'stone') {
              sx = 0;
              sy = 32 * 8;
              chamber.blocks.push(self.generateBox(
                {sx: sx, sy: sy, x: dx, y: dy}));
              // Half-block cover
              sx = 32;
              sy = 32 * 8;
              chamber.blocks.push(self.generateBox(
                {sx: sx, sy: sy, x: dx, y: dy - self.boxHeight,
                 halfBlock: true}));
            } else if (platformType == 'half-stone') {
              sx = 32;
              sy = 32 * 8;
              chamber.blocks.push(self.generateBox(
                {sx: sx, sy: sy, x: dx, y: dy, halfBlock: true}));
            } else if (platformType == 'coin') {
              chamber.blocks.push(self.generateCoin(dx, dy));
            } else {
              chamber.blocks.push(null);
            }
          }
        }

      };

      clss.generateChamberBlocksFromString =
        function(string, chamber, chamberX, chamberY) {
          var self = this;
          var string = string.split("\n");
          var dx = 0;
          var dy = 0;
          var line = [];
          for (var y = 0; y < string.length; y++) {
            line = string[y].split("");
            for (var x = 0; x < line.length; x++) {
              dx = chamberX * self.width + x * self.boxWidth;
              dy = chamberY * self.height + y * self.boxHeight;

	      // Add trees
	      // if (line[x] == 'g') {
              //   for (var i = 0; i < helpers.choice([1, 3, 6]); i++) {
              //     chamber.blocks.push(new app.Box({
              //       context: self.context,
              //       image: self.image,
              //       solid: false,

              //       sx: 0,
              //       sy: 0,
              //       sw: 32,
              //       sh: 32,

              //       dw: self.boxWidth,
              //       dh: self.boxHeight,

              //       x: dx + helpers.randomInt(-10, 10),
              //       y: dy,
              //       width: self.boxWidth,
              //       height: self.boxHeight,
              //     }))
              //   }
	      // }

              chamber.blocks.push(self.blockTypes[line[x]](dx, dy));
            }
          }
        };

      clss.generateBackground = function(chamber, chamberX, chamberY) {
        var self = this;
        var dx = 0;
        var dy = 0;
        var blockTypes = [
          'dirt',
          'stone',
        ];
        var choice = null;
        var block = null;
        for (var y = 0; y < self.height / self.boxHeight; y++) {
          for (var x = 0; x < self.width / self.boxWidth; x++) {
            dx = chamberX * self.width + x * self.boxWidth;
            dy = chamberY * self.height + y * self.boxHeight;
            choice = helpers.choice(blockTypes);
            if (choice == 'dirt') {
              block = new app.Dirt({
                context: self.context,
                image: self.image,
                x: dx,
                y: dy,
                solid: false,
                layer: -3,
              });
            } else if (choice == 'stone') {
              block = new app.Stone({
                context: self.context,
                image: self.image,
                x: dx,
                y: dy,
                solid: false,
                layer: -3,
              });
	    }
            chamber.blocks.push(block);
          }
        }
      };

      clss.generateBox = function(options) {
        var self = this;

        var sx = options.sx;
        var sy = options.sy;
        var x = options.x;
        var y = options.y;
        var halfBlock = options.halfBlock || false;

        var height = self.boxHeight;
        var solid = options.solid || true;
        if (options.solid == false) {
          solid = false;
        }

        if (halfBlock) {
          y += self.boxHeight / 2;
          height /= 2;
        }

        return new app.Box({
          context: self.context,
          image: self.image,
          solid: solid,

          sx: sx,
          sy: sy,
          sw: self.boxWidth,
          sh: self.boxHeight,

          dw: self.boxWidth,
          dh: self.boxHeight,

          x: x,
          y: y + 10,
          width: self.boxWidth,
          height: height - 10,
        });

      };

      clss.generateCoin = function(x, y) {
        var self = this;
        return new app.Coin({
          image: self.image,
          context: self.context,
          game: self.game,
          x: x + self.boxWidth / 3,
          y: y + self.boxHeight / 2,
        });
      };

      clss.generateChambers = function(x, y, minDistance) {
        var self = this;
        if (minDistance == 0) {
          return true;
        }

        if (self.chambers[x][y] != null) {
          return false;
        }

        var direction = helpers.choice(['north', 'east','south', 'west']);
        if (direction == 'north') {
          self.chambers[x][y] = new app.Chamber({
            type: 'platforms',
          });
          if (self.generateChambers(x - 1, y, minDistance - 1)) {
            return true;
          }
        } else if (direction == 'east') {
          self.chambers[x][y] = new app.Chamber({
            type: 'platforms',
          });
          if (self.generateChambers(x, y + 1, minDistance - 1)) {
            return true;
          }
        } else if (direction == 'south') {
          self.chambers[x][y] = new app.Chamber({
            type: 'platforms',
          });
          if (self.generateChambers(x + 1, y, minDistance - 1)) {
            return true;
          }
        } else if (direction == 'west') {
          self.chambers[x][y] = new app.Chamber({
            type: 'platforms',
          });
          if (self.generateChambers(x, y - 1, minDistance - 1)) {
            return true;
          }
        }
        return false;
      };

      clss.draw = function() {
        var self = this;
        var chamber = null;
        var boxType = '';
        var startChamberX = self.chambers.length / 2 - 1;
        var startChamberY = self.chambers[0].length / 2 - 1;
        // for (var row = 0; row < self.chambers.length; row++) {
        //   for (var col = 0; col < self.chambers[row].length; col++) {
        //     chamber = self.chambers[row][col];

        //     if (chamber != null) {

        //       self.context.fillStyle = 'rgba(255, 0, 255, 0.3)';
        //       self.context.fillRect(
        //         self.width / self.boxWidth * row * self.boxWidth,
        //         self.height / self.boxHeight * col * self.boxHeight,
        //         self.width - 10, self.height - 10);
        //       for (var i = 0; i < chamber.blocks.length; i++) {
        //         try {
        //           chamber.blocks[i].draw();
        //         } catch(error) {
        //           // Ignore it.
        //         }
        //       }
        //     } else {
        //       self.context.fillStyle = 'rgba(0, 255, 0, 0.3)';
        //       self.context.fillRect(
        //         self.width / self.boxWidth * row * self.boxWidth,
        //         self.height / self.boxHeight * col * self.boxHeight,
        //         self.width - 10, self.height - 10);
        //     }


        //   }
        // }
        // for (var i = 0; i < self.platforms; i++) {
        //   try {
        //     self.platforms[i].draw();
        //   } catch(error) {
        //     // Ignore it.
        //   }
        // }
      };

      clss.moveUp = function() {
        var self = this;
        if (self.camera.zoomOut) {
          self.context.translate(0, 1 * self.movementSpeed);
        }
      };

      clss.moveDown = function() {
        var self = this;
        if (self.camera.zoomOut) {
          self.context.translate(0, -1 * self.movementSpeed);
        }
      };

      clss.moveRight = function() {
        var self = this;
        if (self.camera.zoomOut) {
          self.context.translate(-1 * self.movementSpeed, 0);
        }
      };

      clss.moveLeft = function() {
        var self = this;
        if (self.camera.zoomOut) {
          self.context.translate(1 * self.movementSpeed, 0);
        }
      };

      clss.init(options);
    };

    return cls;
  })();

});
