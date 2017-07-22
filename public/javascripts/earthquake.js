document.addEventListener('DOMContentLoaded', function() {

  var app = this;
  var helpers = new app.Helpers();

  app.Earthquake = (function() {
    function cls(options) {
      var clss = this;

      clss.init = function() {
        var self = this;
        clss.game = options.game;
        clss.context = options.context;
        clss.doShake = false;
        clss.originalShakeIntensity = 0.5;
        clss.shakeIntensity = self.originalShakeIntensity;
        clss.originalShakeTimer = 30;
        clss.shakeTimer = 0;
        clss.shakeRandX = 0;
        clss.shakeRandY = 0;
        clss.doSaveContext = false;

        self.game.addTicker({
          ticksPerFrame: 6,
          numberOfFrames: 4,
          callback: function(ticker) {
            if (self.doSaveContext) {
              self.doSaveContext = false;
              // self.context.save();
            }
            if (self.shakeTimer > 0) {
              self.context.save();
              for (var i = 0; i < ticker.frameIndex;
                   i++) {
                self.shakeRandX = helpers.randomInt(
                    -self.shakeIntensity / 2, self.shakeIntensity / 2);
                self.shakeRandY = helpers.randomInt(
                    -self.shakeIntensity / 2, self.shakeIntensity / 2);
                self.context.translate(self.shakeRandX, self.shakeRandY);
              }
	      setTimeout(function() {
		self.context.restore();
	      }, 10);
              self.doShake = false;
              self.shakeIntensity = self.originalShakeIntensity;
              self.shakeTimer -= 1;
            }
            if (self.shakeTimer == 1) {
              // self.context.restore();
              self.shakeTimer = 0;
              self.doShake = false;
            }
          },
        });
      }

      clss.shake = function(options) {
        var self = this;
	var options = options || {};
        var intensity = options.intensity || self.originalShakeIntensity;
        var time = options.time || self.originalShakeTimer;
        self.doShake = true;
        self.doSaveContext = true;
        self.shakeIntensity = intensity;
        self.shakeTimer = time;
      };

      clss.init();
    };

    return cls;
  })();

});
