document.addEventListener('DOMContentLoaded', function(e) {

  var app = this;

  var helpers = new app.Helpers();

  // Polyfill
  window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame ||
      window.webkitrequestAnimationFrame ||
      window.mozrequestAnimationFrame ||
      function(callback) {
        window.setTimeout(callback, 1000 / 60);
      }
  })();

  app.Game = (function() {

    function cls() {
      var clss = this;

      clss.init = function() {
        var self = this
        self.gameContainer = document
          .getElementsByClassName('game-container')[0];
        self.canvas = document.createElement('canvas');
        self.canvas.width = 671;
        self.canvas.height = 384;
        self.context = self.canvas.getContext('2d');
        self.gameContainer.appendChild(self.canvas);

        self.message = 'Hello there';

        // Game loop
        self.now = null;
        self.last = Date.now();
        self.delta = Date.now();
        self.fps = 60;

        self.tickCount = 0;
        self.frameIndex = 0;
        self.ticksPerFrame = 6;
        self.numberOfFrames = 14;

        // List of tickers (callbacks with their own tick variables).
        self.tickers = [];

        // Rectangle
        self.radius = 20;
        self.distance = 10;
        // self.angle = Math.acos(1-Math.pow((distance/radius), 2)/2);
        self.angle = 3 * Math.PI / 180;
        self.xMove = 0;
        self.yMove = 0;
        self.rectX = 0;
        self.rectY = 0;
        self.rectSpeed = 1.3;
        self.rectMoveRight = true;
        self.rectMoveLeft = true;
	self.drawingCandidate = null;

        // Images
        self.imagesLoader = new app.ImagesLoader();
        self.images = self.imagesLoader.loadImages({
          'test-image': 'public/images/16x161.png',
          'test-sprite': 'public/images/62538.png',
          'spritesheet': 'public/images/spritesheet.png',
        });

        // borders
        self.levelBorders = [];
        self.levelBorderWidth = 50;
        self.levelBorderHeight = self.levelBorderWidth
        self.levelBorderColor = '#121212';
        self.levelBorderPadding = 20;
        // left
        self.levelBorders.push(new app.Box({
          context: self.context,
          x: -self.levelBorderWidth - (self.levelBorderPadding * 2),
          y: -self.levelBorderPadding,
          width: self.levelBorderWidth + (self.levelBorderPadding * 2),
          height: self.canvas.height + (self.levelBorderPadding * 2),
          color: self.levelBorderColor,
        }));
        // top
        self.levelBorders.push(new app.Box({
          context: self.context,
          x: -self.levelBorderPadding,
          y: -self.levelBorderHeight - (self.levelBorderPadding * 2),
          width: self.canvas.width + (self.levelBorderPadding * 2),
          height: self.levelBorderHeight + (self.levelBorderPadding * 2),
          color: self.levelBorderColor,
        }));
        // right
        self.levelBorders.push(new app.Box({
          context: self.context,
          x: self.canvas.width,
          y: -self.levelBorderPadding,
          width: self.levelBorderWidth + (self.levelBorderPadding * 2),
          height: self.canvas.height + (self.levelBorderPadding * 2),
          color: self.levelBorderColor,
        }));
        // bottom
        self.levelBorders.push(new app.Box({
          context: self.context,
          x: -self.levelBorderPadding,
          y: self.canvas.height,
          width: self.canvas.width + (self.levelBorderPadding * 2),
          height: self.levelBorderHeight + (self.levelBorderPadding * 2),
          color: self.levelBorderColor,
        }));

        // Blue rectangle
        // self.blueRect = new app.BlueRectangle(self.context);

        self.friction = 0.8;
        self.gravity = 0.2;

        // Camera
        self.camera = new app.Camera({
          context: self.context,
          canvas: self.canvas,
          game: self,
        });

        // Player
        self.player = new app.Player({
          context: self.context,
          canvas: self.canvas,
          friction: self.friction,
          gravity: self.gravity,
          images: self.images,
          game: self,
          camera: self.camera,
        });

        self.camera.player = self.player;
        // self.camera.x = self.player.x;
        // self.camera.y = self.player.y;
        self.camera.y = self.canvas.width / 2;
        self.camera.y = self.canvas.height / 2;
        self.camera.initialize();

	// Earthquake
	//
	// self.earthquake = new app.Earthquake({
	//   game: self,
	//   context: self.context,
	// });
	// self.earthquake.shake({intensity: 800.3, time: 800});

        // Spinning Box
        self.spinningBox = new app.Box({
	  solid: true,
          context: self.context,
          x: 30,
          y: 120,
          width: 50,
          height: 50,
          color: '#00AF00',
        });

        // Box
        self.boxes = [];
        // for (var i = 0; i < 10; i++) {
        //   var width = 40 + helpers.randomInt(0, 80);
        //   var height = 40 + helpers.randomInt(0, 80);
        //   var box =         self.box = new app.Box({
	//     solid: true,
        //     context: self.context,
        //     x: helpers.randomInt(0, self.canvas.width - width),
        //     y: helpers.randomInt(0, self.canvas.height - height) - 40,
        //     width: width,
        //     height: height,
        //     color: '#' + helpers.randomInt(0, 9) + 'CDC' +
        //       helpers.randomInt(0, 9) +
        //       helpers.randomInt(0, 9),
        //   });
        //   self.boxes.push(box);
        // }

        // Coin
        self.coin = new app.Coin({
          image: self.images['spritesheet'],
          context: self.context,
          game: self,
          x: 80,
          y: 120,
        });

        self.someBox = new app.Box({
	  solid: true,
          context: self.context,
          x: self.canvas.width / 2 + 40,
          y: self.canvas.height - 45,
          width: 80,
          height: 30,
          color: '#AFAF23',
        });
        // self.boxes.push(self.someBox);

        // someImageBox = new app.Box({
        //   image: self.images['spritesheet'],
        //   context: self.context,

        //   sx: 0,
        //   sy: 32 * 7,
        //   sw: 32,
        //   sh: 32,

        //   x: 40,
        //   y: 80,

        //   dw: 32,
        //   dh: 32,

        //   width: 32,
        //   height: 32,
        // });
        // self.boxes.push(someImageBox);

        // Level
        self.level = new app.Level({
          context: self.context,
          game: self,
          camera: self.camera,
          image: self.images['spritesheet'],
          width: self.canvas.width,
          height: self.canvas.height,
        });
        self.level.generate();

        // Collision player - platforms
        var chamber = null;
        for (var row = 0; row < self.level.chambers.length; row++) {
          for (var col = 0; col < self.level.chambers[row].length; col++) {
            chamber = self.level.chambers[row][col];
            if (chamber != null) {
              for (var i = 0; i < chamber.blocks.length; i++) {
                if (chamber.blocks[i] != null) {
                  self.boxes.push(chamber.blocks[i]);
                }
              }
            }
          }
        }

        // self.player.x = (self.level.chambers.length / - 1) * self.level.width;
        // self.player.y = (self.level.chambers[0].length / 2 - 1) * self.level.height;

	self.gameEvents = new app.GameEvents({
	  game: self,
	  context: self.context,
	});

        // Input
        self.input = new app.Input({
          player: self.player,
          camera: self.camera,
          level: self.level,
          earthquake: self.earthquake,
        });

        self.update();
      };

      clss.update = function() {
        var self = this;

        // Master background
        self.context.fillStyle = '#FFFF00';
        self.context.fillRect(-9999, -9999, 9999 * 2, 9999 * 2);

        self.clear();
        self.input.dispatch();

        // self.player.draw();

	// Draw background
        for (var i = 0; i < self.boxes.length; i++) {
	  try {  // Do not draw things with tickers that draw themselves.
	    if (self.boxes[i].layer < 0) {
              self.boxes[i].draw()
	    }
	  } catch(error) {
	    // Ignore it.
	  }
        }

        // self.blueRect.draw();
        self.player.draw();

	// Draw foreground
        for (var i = 0; i < self.boxes.length; i++) {
	  try {  // Do not draw things with tickers that draw themselves.
	    if (self.boxes[i].layer >= 0) {
              self.boxes[i].draw()
	    }
	  } catch(error) {
	    // Ignore it.
	  }
        }

        // Drawing
        self.drawRect();

        self.camera.draw();

        // Collision detection
        for (var i = 0; i < self.boxes.length; i++) {
          var direction = self.checkCollision(self.player, self.boxes[i]);
          self.player.reposition(direction);
        }

        // Level walls
        // for (var i = 0; i < self.levelBorders.length; i++) {
        //   var border = self.levelBorders[i];
        //   border.draw();
        //   var direction = self.checkCollision(self.player, border);
        //   self.player.reposition(direction);
        // }

        var direction = self.checkCollision(self.player, self.spinningBox);
        self.player.reposition(direction);

        // var image = new Image();
        // var imageX = 20;
        // var imageY = 40;
        // var img = self.drawImage(image, imageX, imageY);

        var testImage = self.images['test-sprite'];
        testImage.x = 40;
        testImage.y = 60;
        if (testImage.loaded) {
          self.context.drawImage(
            testImage.data,
            64 * self.frameIndex,
            64 * 2,
            64,
            64,
            testImage.x,
            testImage.y,
            64,
            64);
        }
        // var imageData = self.context.getImageData(
        //   // testImage.x, testImage.y, testImage.height || 1,
        //   // testImage.width || 1);
        //   testImage.x, testImage.y, 64, 64);
        // var pixels = imageData.data;
        // for (var i = 0; i < pixels.length; i += 4) {
        //   if (pixels[i] < 50) {
        //     pixels[i] = 255;
        //     pixels[i + 1] = 0;
        //     pixels[i + 2] = 0;
        //   }
        // }
        // self.context.putImageData(imageData, testImage.x, testImage.y);

        // Move the camera.
        //
        // if (self.player.y < self.canvas.height / 2) {
        //   self.context.translate(0, 0.7);
        // } else if (self.player.y > self.canvas.height / 2) {
        //   self.context.translate(0, -0.7);
        // }

        // Game loop
        window.requestAnimationFrame(function() {
          self.update();
        });

        // Print the FPS on the screen
        self.print(self.fps + '');

        // FPS
        self.now = Date.now();
        self.delta = (new Date().getTime() - self.last) / 1000;
        self.last = new Date().getTime();
        self.fps = 1 / self.delta;

        self.tickCount += 1;
        if (self.tickCount > self.ticksPerFrame) {
          self.tickCount = 0;
          if (self.frameIndex < self.numberOfFrames - 1) {
            self.frameIndex += 1;
          } else {
            self.frameIndex = 0;
          }
        }

        for (var i = 0; i < self.tickers.length; i++) {
          self.tickers[i]();
        };
      };

      clss.addTicker = function(options) {
        var self = this;
        options.tickCount = options.tickCount || 0;
        options.frameIndex = options.frameIndex || 0;
        self.tickers.push(function() {
          options.tickCount += 1;
          if (options.tickCount > options.ticksPerFrame) {
            options.tickCount = 0;
            if (options.frameIndex < options.numberOfFrames - 1) {
              options.frameIndex += 1;
            } else {
              options.frameIndex = 0;
            }
          }
          options.callback(options);
        });
      };

      clss.drawImage = function(path, x, y) {
        var self = this;
        var imageWidth = 0;
        var imageHeight = 0;
        var image = new Image();
        image.addEventListener('load', function() {
          self.drawImage(image, x, y);
          imageWidth = image.naturalWidth;
          imageHeight = image.naturalHeight;
        });
        image.src = path;
        self.context.drawImage(image, x, y);
        var imageData = self.context.getImageData(
          x, y, imageWidth, imageHeight);
        var pixels = imageData.data;
        for (var i = 0; i < pixels.length; i += 4) {
          if (pixels[i] < 50) {
            pixels[i] = 255;
          }
        }
        self.context.putImageData(imageData, x, y);
        return image;
      };

      clss.clear = function() {
        var self = this;
        self.context.clearRect(0, 0, self.canvas.width,
                               self.canvas.height);
        self.context.fillStyle = '#FFFFFF';
        self.context.fillRect(0, 0, self.canvas.width,
                              self.canvas.height);
      };

      clss.print = function(text) {
        var self = this;
        self.context.fillStyle = '#FFFFFF';
        self.context.fillRect(
          self.camera.x - self.canvas.width / 2,
          self.camera.y - self.canvas.height / 2 + 3,
          200, 20);
        self.context.fillStyle = '#000000';
        self.context.font = '20px Helvetica';
        self.context.fillText(
          text, self.camera.x - self.canvas.width / 2,
          self.camera.y - self.canvas.height / 2 + 20);
      };

      clss.drawRect = function() {
        var self = this;

        if (self.rectX >= 50) {
          self.rectMoveRight = false;
        } else if (self.rectX <= 0) {
          self.rectMoveRight = true;
        }
        if (self.rectY >= 50) {
          self.rectMoveLeft = false;
        } else if (self.rectY <= 0) {
          self.rectMoveLeft = true;
        }

        if (self.rectMoveRight) {
          self.rectX += self.rectSpeed;
        } else {
          self.rectX -= self.rectSpeed;
        }

        if (self.rectMoveLeft) {
          self.rectY += self.rectSpeed;
        } else {
          self.rectY -= self.rectSpeed;
        }

        self.angle += 3 * Math.PI / 180;
        self.xMove = self.radius * Math.cos(self.angle);
        self.yMove = self.radius * Math.sin(self.angle);

        // Spinning Box
        self.spinningBox.x = self.canvas.width / 3 + self.xMove;
        self.spinningBox.y = self.canvas.height - 80 + self.yMove - 40;
        self.spinningBox.draw();
      };

      clss.checkCollision = function(shapeA, shapeB) {
        var self = this;
        var vX =
          (shapeA.x + shapeA.width / 2) - (shapeB.x + shapeB.width / 2);
        var vY =
          (shapeA.y + shapeA.height / 2) - (shapeB.y + shapeB.height / 2);
        var hWidths = (shapeA.width / 2) + (shapeB.width / 2);
        var hHeights = (shapeA.height / 2) + (shapeB.height / 2);
        var direction = null;

        if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
          shapeB.color = '#CF3849';
          var oX = hWidths - Math.abs(vX);
          var oY = hHeights - Math.abs(vY);
          if (oX >= oY) {
            if (vY > 0) {
              direction = 't';
            } else {
              direction = 'b';
            }
          } else {
            if (vX > 0) {
              direction = 'l';
            } else {
              direction = 'r';
            }
          }
          self.gameEvents.handleCollision(shapeA, shapeB, direction);

	  if (direction != null) {
            try {
              shapeA.collide(shapeB, direction);
              shapeB.collide(shapeA, direction);
            } catch(error) {
              // Ignore it.
            }
	  }

          if (shapeA.solid && shapeB.solid) {
            if (direction == 't') {
              shapeA.y += oY;
            } else if (direction == 'b') {
              shapeA.y -= oY;
            } else if (direction == 'l') {
              shapeA.x += oX;
            } else if (direction == 'r') {
              shapeA.x -= oX;
            }
          } else {
            direction = null;
          }

          return direction;
        }
      };

      clss.init();
    };

    return cls;
  })();

  app.game = new app.Game();

});
