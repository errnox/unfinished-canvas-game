document.addEventListener('DOMContentLoaded', function(e) {

  var app = this;
  var helpers = new app.Helpers();

  app.BlueRectangle = (function() {

    function cls(context) {
      var clss = this;
      var options = {
        context: context,
      };

      clss.init = function(options) {
        var self = this;
        self.context = options.context;
        self.speed = 1; // Has to be fixed.
        self.newX = helpers.randomInt(0, 100);
        self.randX = helpers.randomInt(0, 100);
        self.newY = helpers.randomInt(0, 100);
        self.randY = helpers.randomInt(0, 100);
        self.moving = false;
      };

      clss.draw = function() {
        var self = this;

        if (!self.moving) {
          self.moving = true;
          self.randX = helpers.randomInt(0, 100);
          self.randY = helpers.randomInt(0, 100);
        } else {
          // Animate between positions
          if (self.randX > self.newX && self.moving) {
            self.newX += 1 * self.speed;
          }
          if (self.randX < self.newX && self.moving) {
            self.newX -= 1 * self.speed;
          }
          if (self.randY > self.newY && self.moving) {
            self.newY += 1 * self.speed;
          }
          if (self.randY < self.newY && self.moving) {
            self.newY -= 1 * self.speed;
          }
        }

        if (self.newX == self.randX &&
            self.newY == self.randY) {
          self.moving = false;
        }

        self.context.fillStyle = 'rgba(0, 0, 255, 0.3)';
        self.context.fillRect(30 + self.newX, 40 + self.newY, 80, 90);
      };

      clss.hello = function() {
        console.log('HELLO!');  // DEBUG
      };

      clss.init(options);
    };


    return cls;
  })();

});
