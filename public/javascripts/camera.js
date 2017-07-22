document.addEventListener('DOMContentLoaded', function() {

  var app = this;
  var helpers = new app.Helpers();

  app.Camera = (function() {
    function cls(options) {
      var clss = this;

      clss.init = function() {
        var self = this;
        clss.context = options.context;
        clss.canvas = options.canvas;
        clss.game = options.game;
        clss.player = options.player || null;
        clss.x = options.x + self.canvas.width / 2 ||
          self.canvas.width / 2;
        clss.y = options.y + self.canvas.height / 2 ||
          self.canvas.height / 2;
        clss.paddingX = self.canvas.width / 15;
        clss.paddingY = self.canvas.height / 15;
        clss.speed = 5;
        clss.destinationX = self.x;
        clss.destinationY = self.y;
        clss.hudCallbacks = [];

        clss.zoomOut = false;
        clss.zoomIn = false;
        clss.zoomInScaleFactor = 0.91;
        clss.zoomMax = 4;
        clss.zoomMin = -4;
        clss.zoomState = 0;
        clss.beforeZoomX = 0;
        clss.beforeZoomY = 0;

        clss.animating = false;
      };

      clss.initialize = function() {
        var self = this;
        var diff = 1;
        var more = 1;
        self.game.addTicker({
          ticksPerFrame: 4,
          numberOfFrames: 6,
          callback: function(ticker) {

            if (self.x < self.destinationX - self.paddingX) {
              clss.animating = true;
              diff = Math.abs(self.destinationX - self.x) / 2;
              ticker.numberOfFrames = diff / 10;
              ticker.ticksPerFrame = ticker.numberOfFrames;
              self.x += 1 * ticker.frameIndex * self.speed;
              self.context.translate(-self.speed * ticker.frameIndex, 0);
            } else if (self.x > self.destinationX + self.paddingX) {
              clss.animating = true;
              diff = Math.abs(self.destinationX - self.x) / 2;
              ticker.numberOfFrames = diff / 10;
              ticker.ticksPerFrame = ticker.numberOfFrames;
              self.x -= 1 * ticker.frameIndex * self.speed;
              self.context.translate(self.speed * ticker.frameIndex, 0);
            }

            if (self.y < self.destinationY - self.paddingY) {
              clss.animating = true;
              diff = Math.abs(self.destinationY - self.y) / 2;
              ticker.numberOfFrames = diff / 10;
              ticker.ticksPerFrame = ticker.numberOfFrames;
              self.y += 1 * ticker.frameIndex * self.speed;
              self.context.translate(0, -self.speed * ticker.frameIndex);
            } else if (self.y > self.destinationY + self.paddingY) {
              clss.animating = true;
              diff = Math.abs(self.destinationY - self.y) / 2;
              ticker.numberOfFrames = diff / 10;
              ticker.ticksPerFrame = ticker.numberOfFrames;
              self.y -= 1 * ticker.frameIndex * self.speed;
              self.context.translate(0, self.speed * ticker.frameIndex);
            }

            if (self.zoomIn) {
              if (self.zoomState < self.zoomMax) {
                self.zoomState += 1;
                self.context.translate(self.player.x,
                                       self.player.y);
                self.context.save();
                self.context.scale(-1.1, -1.1);
                self.update(self.player.x, self.player.y);
              }
            } else {
              if (self.zoomState > 0 ) {
                self.zoomState -= 1;
                self.context.restore();
                self.context.translate(-self.player.x,
                                       -self.player.y);
                self.update(self.player.x, self.player.y);
              }
            }

            if (self.zoomOut) {
              if (self.zoomState > self.zoomMin) {
                self.zoomState -= 1;
                self.context.translate(30, 30);
                self.beforeZoomX = self.x;
                self.beforeZoomY = self.y;
                self.context.save();
                self.context.scale(self.zoomInScaleFactor,
                                   self.zoomInScaleFactor);
                self.zoomInScaleFactor -= 0.025;
                self.update(self.player.x, self.player.y);
              }
            } else {
              if (self.zoomState < 0 ) {
                self.zoomState += 1;
                self.zoomInScaleFactor = 0.91;
                self.context.restore();
                self.update(self.player.x, self.player.y);
                self.context.translate(self.beforeZoomX - self.x,
                                       self.beforeZoomY - self.y);
                self.context.translate(-30, -30);

              }
            }

            clss.animating = false;

          }
        });
      };

      clss.update = function(x, y) {
        var self = this;
        self.destinationX = x;
        self.destinationY = y;
      };

      clss.recenter = function() {
        var self = this;
        // self.update(self.canvas.width / 2, self.canvas.height / 2);
        self.x = self.canvas.width / 2;
        self.y = self.canvas.height / 2;
      };

      clss.draw = function() {
        var self = this;
        self.context.fillStyle = '#00FF00';
        // Padding X
        self.context.fillRect(
          self.x - self.paddingX, self.y - 1, self.paddingX * 2, 1);
        // Padding Y
        self.context.fillRect(
          self.x - 1, self.y - self.paddingY, 1, self.paddingY * 2);
        // Center
        self.context.fillStyle = '#FF0000';
        self.context.fillRect(self.x - 2.5, self.y - 2.5, 5, 5);

        // HUD
        for (var i = 0; i < self.hudCallbacks.length; i++) {
          self.hudCallbacks[i](self);
        }
      };

      clss.hud = function(callback) {
        var self = this;
        self.hudCallbacks.push(callback);
      };

      clss.init();
    }

    return cls;
  })();

});
