document.addEventListener('DOMContentLoaded', function() {

  var app = this;

  app.Coin = (function() {

    function cls(options) {
      var clss = this;

      clss.init = function() {
        var self = this;
        self.image = options.image;
        self.context = options.context;
        self.imageLoaded = false;
        self.game = options.game;
	clss.x = options.x || 0;
	clss.y = options.y || 0;
	clss.type = 'coin';
	clss.width = 32 / 2;
	clss.height = 32 / 2;
	clss.doShow = true;

        self.numberOfFrames = 10;
        self.ticksPerFrame = 3;
        self.image.onload(function() {
          self.imageLoaded = true;
        });
        self.game.addTicker({
          ticksPerFrame: self.ticksPerFrame,
          numberOfFrames: self.numberOfFrames,
          callback: function(ticker) {
            if (self.imageLoaded && self.doShow) {
              self.context.drawImage(
                self.image.data,
                32 * ticker.frameIndex, 32 * 6, 32, 32,
                self.x, self.y, 32, 32);
            }
          },
        });
      };

      clss.hide = function() {
	var self = this;
	self.doShow = false;
	self.y -= 20;
	setTimeout(function() {
	  // self.doShow = true;
	  self.doShow = false;
	  // self.y += 20;
	}, 2000);

	self.game.player.moveUp();
	// self.game.player.x = self.game.canvas.width / 2;
	// self.game.player.y = self.game.canvas.height - self.game.player.height;
      };

      clss.init();
    }

    return cls;
  })();

});
