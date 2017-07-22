document.addEventListener('DOMContentLoaded', function(e) {

  var app = this;
  helpers = new app.Helpers();

  app.Input = (function() {
    function cls(options) {
      var clss = this;

      clss.init = function() {
        var self = this;
        clss.player = options.player;
        clss.keys = [];
	clss.camera = options.camera;
	clss.level = options.level;
	clss.earthquake = options.earthquake;
        document.addEventListener('keydown', function(e) {
          self.keys[e.keyCode] = true;

	  // q
          if (e.keyCode == 81) {
	    if (!self.camera.animating) {
              self.camera.zoomOut = !self.camera.zoomOut;
	    }
          }

	  // Up
          if (e.keyCode == 38) {
	    if (self.player.climbing) {
	      self.player.doClimb = true;
	    }
          }

	  // Down
          if (e.keyCode == 40) {
	    self.player.doClimbDown = true;
          }
        });
        document.addEventListener('keyup', function(e) {
          self.keys[e.keyCode] = false;
          self.player.singleSpeed();

          // Up (double jump)
          if (e.keyCode == (38 || 32) && self.player.jumping == true) {
            if (!self.player.canDoubleJump) {
              self.player.canDoubleJump = true;
            } else {
              self.player.canDoubleJump = false;
            }
	    self.player.doClimb = false;
	    if (self.player.climbing) {
	    }
          }

          // Wall jump
          // (`e.keyCode' does not work well without being abstracted away
          // through a library like jQuery.)
          // if (e.keyCode == (37 || 38 || 39 || 40 || 32)) {
          if (self.player.onWall) {
            self.player.onWall = false;
            self.player.jumping = false;
          }
          // }

	  // Down
	  if (e.keyCode == 40) {
	    self.player.stopCrouching();
	    self.player.doClimbDown = false;
	  }

          self.player.decelerate();
        });
      };

      clss.dispatch = function() {
        var self = this;
        // Left
        if (self.keys[37]) {
          if (!self.camera.zoomOut) {
            self.player.moveLeft();
	  } else {
	    self.level.moveLeft();
	  }
        }
        // Up
        if (self.keys[38] || self.keys[32]) {
          if (!self.camera.zoomOut) {
            self.player.moveUp();
	    // self.earthquake.shake({intensity: 0.1, time: 50});
	  } else {
	    self.level.moveUp();
	  }
        }
        // Right
        if (self.keys[39]) {
          if (!self.camera.zoomOut) {
            self.player.moveRight();
	  } else {
	    self.level.moveRight();
	  }
        }
        // Down
        if (self.keys[40]) {
          if (!self.camera.zoomOut) {
            self.player.moveDown();
	  } else {
	    self.level.moveDown();
	  }
        }
        // Ctrl
        if (self.keys[17]) {
          self.player.doubleSpeed();
        }
	// // q
        // if (self.keys[81]) {
        //   self.camera.zoomIn = true;
        // }

	// // w
        // if (self.keys[87]) {
        //   // self.camera.zoomIn = false;
        //   self.camera.zoomOut = false;
        // }
      };

      clss.init();
    };

    return cls;
  })();

});
