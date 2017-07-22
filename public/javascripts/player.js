document.addEventListener('DOMContentLoaded', function(e) {

  var app = this;
  var helpers = new app.Helpers();

  app.Player = (function() {
    function cls(options) {
      var clss = this;

      clss.init = function(options) {
        var self = this;
        self.solid = true;
        self.width = 15;
        self.originalHeight = 10 * 3;
        self.height = self.originalHeight;
        self.canvas = options.canvas;
        self.x = options.x || self.canvas.width / 2 + self.width / 2;
        self.y = options.y || self.canvas.height - self.height;
        self.velX = 0;
        self.velY = 0;
        self.weight = 1.1;
        self.friction = options.friction;
        self.gravity = options.gravity;
        self.originalSpeed = 0.9;
        self.speed = self.originalSpeed;
        self.crouchingSpeed = 1.0;
        self.dblSpeed = false;
        self.jumping = false;
        self.dblJumping = false;
        self.onWall = false;
        self.canDoubleJump = false;
        self.crouching = false;
        self.cantStandUp = false;
        self.grounded = false;
        self.ducking = false;
        self.justLanded = false;
        self.inWater = false;
        self.climbing = false;
        self.doClimb = false;
        self.doClimbDown = false;
        self.lockedToLadder = false;
        self.jumpStrength = 7;
        self.context = options.context;
        self.imageLoaded = false;
        self.image = options.images['spritesheet'];
        self.image.onload(function() {
          self.imageLoaded = true;
        });
        self.game = options.game;
        self.camera = options.camera;
        self.type = 'player';

        // self.game.addTicker({
        //   numberOfFrames: 3,
        //   ticksPerFrame: 6,
        //   callback: function(ticker) {
        //     var x = self.x - 32 / 2;
        //     if (self.imageLoaded) {
        //       if (self.mirrorSprite) {
        //         self.context.save();
        //         self.context.translate(self.canvas.width, 0);
        //         self.context.scale(-1, 1);
        //         x = -self.x - 32 / 2 + self.canvas.width;
        //       }

        //       self.context.drawImage(
        //         self.image.data,
        //         // 32 * ticker.frameIndex,
        //         // 32,
        //         32 * ticker.frameIndex,
        //         32,
        //         32,
        //         32,
        //         x,
        //         self.y - 32 + self.height,
        //         32,
        //         32);

        //       // var scaleFactor = 1.5;
        //       // var width = 32 * scaleFactor;
        //       // var height = 32 * scaleFactor;
        //       // var offset = 0;
        //       // var imageData = self.context.createImageData(width, height);
        //       // var pixels = imageData.data;
        //       // var srcIndex = 0;
        //       // var dstIndex = 0;
        //       // var source = self.context.getImageData(
        //       //   self.x - self.width / 2 - 10, self.y - 32 + self.height,
        //       //        32, 32).data;

        //       // var source = helpers.imageDataToArray(
        //       //   self.image.data,
        //       //   0,
        //       //   0,
        //       //   32,
        //       //   32,
        //       //   0,
        //       //   0,
        //       //   32,
        //       //   32);
        //       // for (var y = 0; y < height; y++) {
        //       //   offset = ((y * 32 / height) | 0) * 32;
        //       //   for (var x = 0; x < width; x++) {
        //       //     srcIndex = (offset + x * (32 / width)) << 2;

        //       //     if (!(source[srcIndex] == 255 &&
        //       //           source[srcIndex + 1] == 255 &&
        //       //           source[srcIndex + 2] == 255)) {
        //       //       pixels[dstIndex] = source[srcIndex];
        //       //       pixels[dstIndex + 1] = source[srcIndex + 1];
        //       //       pixels[dstIndex + 2] = source[srcIndex + 2];
        //       //       pixels[dstIndex + 3] = source[srcIndex + 3];
        //       //     } else {
        //       //       pixels[dstIndex] = source[srcIndex];
        //       //       pixels[dstIndex + 3] = 0;
        //       //     }
        //       //     dstIndex += 4;
        //       //   }
        //       // }

        //       // self.context.putImageData(
        //       //   imageData, self.x,
        //       //   self.y - 32 * scaleFactor + self.height);

        //       // var newImage = new Image();
        //       // newImage.src = helpers.imageDataAsDataURL(imageData, 32, 32);
        //       // self.context.drawImage(newImage, self.x - self.width / 2,
        //       //                        self.y - scaleFactor * 32);

        //       // Draw a scaled test image.
        //       //
        //       // self.context.imageSmoothingEnabled = false;
        //       // self.context.webkitImageSmoothingEnabled = false;
        //       // self.context.mozImageSmoothingEnabled = false;
        //       // var sF = 8;
        //       // self.context.drawImage(self.image.data, 0, 0, 32, 32, 50, 50, 32 * sF, 32 * sF);

        //       // var newImage = new Image();
        //       // newImage.src = imageData;
        //       // newImage.data = imageData.data;
        //       // self.context.drawImage(
        //       //   newImage, self.x,
        //       //   self.y - 32 * scaleFactor + self.height);

        //       // self.context.drawImage(
        //       //   self.image.data,
        //       //   // 32 * ticker.frameIndex,
        //       //   // 32,
        //       //   32 * ticker.frameIndex,
        //       //   32,
        //       //   32,
        //       //   32,
        //       //   x,
        //       //   self.y - 32 + self.height,
        //       //   32,
        //       //   32);
        //       if (self.mirrorSprite) {
        //         self.context.restore();
        //       }
        //     }
        //   },
        // }
        // );

        self.numberOfFramesWalking = 3;
        self.ticksPerFrameWalking = self.numberOfFramesWalking * 2;
        self.game.addTicker({
          ticksPerFrame: self.ticksPerFrameWalking,
          numberOfFrames: self.numberOfFramesWalking,
          callback: function(ticker) {
            if (self.imageLoaded) {
              self.animateWalking(ticker);
            }
          },
        });

        self.numberOfFramesStanding = 16;
        self.ticksPerFrameStanding = self.numberOfFramesStanding * 8;
        self.game.addTicker({
          ticksPerFrame: self.ticksPerFrameStanding,
          numberOfFrames: self.numberOfFramesStanding,
          callback: function(ticker) {
            if (self.imageLoaded) {
              self.animateStanding(ticker);
            }
          },
        });

        self.numberOfFramesCrouching = 2;
        self.ticksPerFrameCrouching = self.numberOfFramesCrouching * 4;
        self.game.addTicker({
          ticksPerFrame: self.ticksPerFrameCrouching,
          numberOfFrames: self.numberOfFramesCrouching,
          callback: function(ticker) {
            if (self.imageLoaded) {
              self.animateCrouching(ticker);
            }
          },
        });
      };

      clss.animateWalking = function(ticker) {
        // Do not animate by default;
      };

      clss.animateStanding = function() {
        // Do not animate by default;
      }

      clss.animateCrouching = function() {
        // Do not animate by default;
      }

      clss.draw = function() {
        var self = this;
        self.animateWalking = function(ticker) { /* Draw nothing. */ };
        self.animateStanding = function(ticker) { /* Draw nothing. */ };
        self.animateCrouching = function(ticker) { /* Draw nothing. */ };
        self.velX *= self.friction;
        self.velY += self.gravity * self.weight;
        if (self.inWater) {
	  self.stopCrouching();
          self.x += self.velX / 10;
          self.y += self.velY / 10;
        } else if (self.climbing && self.doClimb) {
	  self.lockedToLadder = false;
          self.x += self.velX / 5;
          self.y += self.velY / 5;
        } else {
          self.x += self.velX;
	  if (!self.climbing) {
            self.y += self.velY;
	  }
	  // Climb down
	  if (self.climbing && self.doClimbDown) {
	    self.lockedToLadder = false;
            self.y += self.velY / 5;
	  }
	}

        // Do not let the player fall through the floor without relying on
        // actual level limit boxes.
        //
        // if (self.y >= (options.canvas.height - self.height)) {
        //   self.y = options.canvas.height - self.height;
        //   self.jumping = false;
        // }

        // Draw bounding box
        //
        // self.context.fillStyle = '#FF0000';
        // self.context.fillRect(self.x, self.y, self.width, self.height);

        if (self.climbing) {
	  // Climb
          self.context.drawImage(self.image.data, 32 * 6, 0, 31, 31,
                                 self.x - self.width / 2 + 3 + self.width / 2,
                                 self.y - 32 + self.height,
                                 32, 32);
        } else {

          if (self.ducking) {
            // Strike landing pose
            self.context.drawImage(self.image.data, 32 * 2, 0, 31, 31,
                                   self.x + 5,
                                   self.y - 32 + self.height,
                                   32, 32);
          } else if (self.crouching && !self.justLanded && !self.onWall && self.velX > 0 && self.velY >= 0) {
            // Crouch to the right
            self.animateCrouching = function(ticker) {
              self.context.drawImage(self.image.data, 32 * ticker.frameIndex, 32 * 3, 31, 31,
                                     self.x - self.width / 2 + 3 - self.width + 9,
                                     self.y - 32 + self.height,
                                     32, 32);
            };
          } else if (!self.justLanded && !self.onWall && self.velX > 0 && self.velY >= 0) {
            // Walk to the right
            if (!self.inWater) {
              self.animateWalking = function(ticker) {
		self.context.drawImage(self.image.data, 32 * ticker.frameIndex, 32, 31, 31,
                                       self.x - 3,
                                       self.y - 32 + self.height,
                                       32, 32);
              };
            } else {
              self.context.drawImage(self.image.data, 32, 32 * 4, 31, 31,
                                     self.x, self.y, 32, 32);
            }
          } else if(!self.onWall && self.velY < 0 && self.velX > 0) {
            // Jump to the top right
            self.context.drawImage(self.image.data, 32 * 4, 0, 31, 31,
                                   self.x - self.width / 2 + 3 + self.width / 2,
                                   self.y - 32 + self.height,
                                   32, 32);
          } else if(!self.onWall && self.velY < 0 && self.velX < 0) {
            // Jump to the top left
            self.context.save();
            self.context.translate(self.canvas.width, 0);
            self.context.scale(-1, 1);
            self.context.drawImage(self.image.data, 32 * 4, 0, 31, 31,
                                   self.canvas.width - (self.x + self.width / 2 + 5),
                                   self.y - 32 + self.height,
                                   32, 32);
            self.context.restore();
          } else if (self.crouching && !self.onWall && self.velX < 0) {
            // Crouch to the left
            self.animateCrouching = function(ticker) {
              self.context.save();
              self.context.translate(self.canvas.width, 0);
              self.context.scale(-1, 1);
              self.context.drawImage(self.image.data, 32 * ticker.frameIndex, 32 * 3, 31, 31,
                                     self.canvas.width - (self.x - self.width / 2 + 3) - self.width - 12,
                                     self.y - 32 + self.height,
                                     32, 32);
              self.context.restore();
            };
          } else if (!self.onWall && self.velX < 0) {
            // Walk to the left
            if (!self.inWater) {
              self.animateWalking = function(ticker) {
		self.context.save();
		self.context.translate(self.canvas.width, 0);
		self.context.scale(-1, 1);
		self.context.drawImage(self.image.data, 32 * ticker.frameIndex, 32, 31, 31,
                                       self.canvas.width - (self.x - self.width / 2 + 3) - self.width - 5,
                                       self.y - 32 + self.height,
                                       32, 32);
		self.context.restore();
              };
            } else {
              self.context.drawImage(self.image.data, 32 * 2, 32 * 4, 31, 31,
                                     self.x, self.y, 32, 32);
            }

          } else if(self.onWall && !self.crouching && self.velX > 0) {
            // Hold on to wall on the right
            self.context.save();
            self.context.translate(self.canvas.width, 0);
            self.context.scale(-1, 1);
            self.context.drawImage(self.image.data, 32 * 3, 0, 31, 31,
                                   self.canvas.width + self.width - (self.x - self.width / 5) - self.width * 2,
                                   self.y - 32 + self.height,
                                   32, 32);
            self.context.restore();
          } else if(self.onWall && !self.crouching && self.velX < 0) {
            // Hold on to wall on the left
            self.context.drawImage(self.image.data, 32 * 3, 0, 31, 31,
                                   self.x - self.width / 2 + 3 + self.width / 2,
                                   self.y - 32 + self.height,
                                   32, 32);
          } else if(!self.onWall && self.velY < 0 && self.velX == 0) {
            // Jump straight up
            if (!self.inWater) {
              self.context.drawImage(self.image.data, 32, 0, 31, 31,
                                     self.x - self.width / 2 + 3 + self.width / 2,
                                     self.y - 32 + self.height,
                                     32, 32);
            } else {
              self.context.drawImage(self.image.data, 32 * 2, 32 * 3, 31, 31,
                                     self.x - self.width / 2 + 3 + self.width / 2,
                                     self.y - 32 + self.height,
                                     32, 32);
            }
          } else if(self.crouching && !self.onWall && !self.jumping && (self.velY > 0 || self.velX != 0)) {
            // Crouch
            self.context.drawImage(self.image.data, 32 * 2, 0, 31, 31,
                                   self.x - self.width / 2 + self.width / 2 - 3,
                                   self.y - 32 + self.height,
                                   32, 32);
          } else if(!self.onWall && !self.jumping && self.grounded && (self.velY > 0 || self.velX != 0)) {
            // Stand still
            if (!self.inWater) {
              self.animateStanding = function(ticker) {
		self.context.drawImage(self.image.data, 32 * ticker.frameIndex, 32 * 2, 31, 31,
                                       self.x + self.width / 3 - 3,
                                       self.y - 32 + self.height,
                                       32, 32);
              };
            } else {
              self.context.drawImage(self.image.data, 0, 32 * 4, 31, 31,
                                     self.x, self.y, 32, 32)
            };
          } else {
            // Fall down
            if (!self.inWater) {
              self.camera.update(self.x, self.y + self.canvas.height / 4);
              self.context.drawImage(self.image.data, 32 * 5, 0, 31, 31,
                                     self.x - self.width / 2 + self.width / 2 - 3,
                                     self.y - 32 + self.height,
                                     32, 32);
            } else {
              self.context.drawImage(self.image.data, 0, 32 * 4, 31, 31,
                                     self.x, self.y, 32, 32)
            };
          }

        }

        // Do not sink into the ground (especially when crouching).
        if (!self.jumping && self.grounded) {
          self.velY = -self.speed + 2;
        }

        if (!self.jumping && !self.grounded) {
          self.cantStandUp = false;
        }

        // Walk off a ledge
        if (!self.jumping && self.grounded && self.velY > 0) {
          self.jumping = true;
        }

        self.moveCameraToPlayer();

        // Move the camera down when crouching.
        if (self.crouching) {
          self.camera.update(self.x, self.y + self.canvas.height / 2 - self.height * 2);
        }

        self.inWater = false;
	self.climbing = false;
      };

      clss.moveCameraToPlayer =  function() {
        // var self = this;
        // var n = 6;
        // if (
        //   Math.abs(self.camera.x - self.x) > self.canvas.width / n ||
        //     Math.abs(self.x - self.camera.x) > self.canvas.width / n ||
        //     Math.abs(self.camera.y - self.y) > self.canvas.height / n ||
        //     Math.abs(self.y - self.camera.y) > self.canvas.height / n
        // ) {
        //   self.camera.update(self.x, self.y);

        //   // self.camera.zoomOut = false;
        //   // self.camera.zoomIn = true;
        // } else {
        //   // self.camera.zoomIn = false;
        //   // self.camera.zoomOut = true;
        // }
      };

      clss.moveRight = function() {
        var self = this;
        // self.camera.update(self.x + self.canvas.width / 4, self.y);
        self.camera.update(self.x + self.width, self.y);
        if (self.onWall) {
          self.jumping = false;
          self.dblJumping = false;
          self.canDoubleJump = true;
        }
        if (self.velX < self.speed * 4) {
          if (self.dblSpeed) {
            self.velX += 8.4;
          } else {
            // self.velX += 1.4;
            if (self.crouching) {
              self.velX += self.crouchingSpeed;
            } else {
              self.velX += 5;
            }
          }
        }
      };

      clss.moveLeft = function() {
        var self = this;
        // self.camera.update(self.x - self.canvas.width / 4, self.y);
        self.camera.update(self.x - self.width, self.y);
        if (self.onWall) {
          self.jumping = false;
          self.dblJumping = false;
          self.canDoubleJump = true;
        }
        if (self.velX > -self.speed * 4) {
          if (self.dblSpeed) {
            self.velX -= 8.4;
          } else {
            // self.velX -= 1.4;
            if (self.crouching) {
              self.velX -= self.crouchingSpeed;
            } else {
              self.velX -= 5;
            }
          }
        }
      };

      clss.moveDown = function() {
        var self = this;
        // self.camera.update(self.x, self.y + self.canvas.height / 4);
	if (!self.climbing) {
          self.camera.update(self.x, self.y + self.height);
          self.startCrouching();
          self.velY += self.gravity * 2;
	}
      };

      clss.moveUp = function() {
        var self = this;
        // self.camera.update(self.x, self.y - self.canvas.height / 4);

	// Allow double jumping when climbing.
        if (self.climbing) {
          self.jumping = true;
          self.canDoubleJump = true;
        }

        self.camera.update(self.x, self.y - self.height);
        if (!self.onWall &&
	    !self.inWater &&
	    !self.climbing) {
          if (!self.jumping) {
            self.jumping = true;
            self.velY = -self.speed * self.jumpStrength;
          } else if (!self.dblJumping && self.jumping &&
                     self.canDoubleJump) {
            self.velY = -self.speed * self.jumpStrength;
            self.dblJumping = true;
            self.canDoubleJump = false;
          }
          self.canDoubleJump = false;
          self.y -= 1 * self.speed;
        } else if (self.inWater &&
		   !self.climbing) {
          self.jumping = true;
          self.velY = -self.speed * self.jumpStrength / 0.8;
	} else if (self.climbing && self.doClimb) {
	  self.lockedToLadder = false;
          self.velY = -self.speed * self.jumpStrength / 0.8;
	  // Wiggle
	  if (helpers.choice([true, false, false, false])) {
	    self.x += helpers.randomInt(-1, 1);
	  }
	  if (helpers.choice([true, false, false, false])) {
	    self.y += helpers.randomInt(-1, 1);
	  }
	}
        if (!self.cantStandUp) {
          self.stopCrouching();
          self.cantStandUp = true;
        } else {
          self.startCrouching();
          self.cantStandUp = false;
        }
      };

      clss.startCrouching = function() {
        var self = this;
        if (!self.jumping &&
            !self.dblJumping &&
            !self.onWall &&
            self.grounded &&
	    !self.inWater) {
          self.crouching = true;
          self.height = self.originalHeight / 2;
        }
        self.cantStandUp = true;
      };

      clss.stopCrouching = function() {
        var self = this;
        if (!self.cantStandUp) {
          self.crouching = false;
          self.height = self.originalHeight;
        }
      };

      clss.doubleSpeed = function() {
        var self = this;
        self.dblSpeed = true;
      };

      clss.singleSpeed = function() {
        var self = this;
        self.dblSpeed = false;
      };

      clss.reposition = function(direction) {
        var self = this;
        if (direction == 'l' || direction == 'r') {
          self.velX = 0;
          self.velY = -0.2;
	  if (!self.inWater) {
            self.jumping = true;
            self.onWall = true;
	  }
        } else if (direction == 'b') {
          self.grounded = true;
          self.jumping = false;
          self.dblJumping = false;
          self.onWall = false;
          self.canDoubleJump = true;

          if (self.velY > 8) {
            setTimeout(function() {
              self.justLanded = true;
              setTimeout(function() {
                self.justLanded = false;
              }, 400);
            }, 50);
          }

          // if (self.velY > 5) {
          //   self.context.fillStyle = '#3412AF';
          //   self.context.fillRect(
          //     self.x - self.width * 5 - (2 * self.velY),
          //     self.y - self.height * 5 - (2 * self.velY),
          //     self.width * 10 + (4 * self.velY),
          //     self.height * 10 + (4 * self.velY));
          // }
        } else if (direction == 't') {
          self.velY *= -1;
          self.cantStandUp = true;
        }
      };

      clss.decelerate = function() {
        var self = this;
        // self.velX /= 1.5;
        // self.velY /= 1.5;

        setTimeout(function() {
          self.velX = 0;
          self.velY = 0;
        }, 20);
      };

      clss.collide = function(object, direction) {
	var self = this;
	// Walk up small objects and climb up ledges.
	if (object.solid &&
	    object.height <= 32 &&
	    (direction == 'l' || direction == 'r') &&
	    !object.y <= self.y - self.height &&
	    !self.climbing &&
	    !self.onWall
	    // self.game.checkCollision({x: self.x, y: object.y - self.y - 3, width: self.width, height: self.height},
	    // 			     {x: object.x, y: object.y - 32, width: 32, height: 32}) == null
	   ) {
	  self.x -= 3 * self.speed;
	  self.y -= 3 * self.speed;
	  if (!self.onWall) {
            // self.y -= Math.abs(self.velX * self.speed);
            self.y -= Math.abs(self.velX * 2);
            self.context.fillStyle = '#FF00FF';
            self.context.fillRect(self.x - 5, self.y - 20, 20, 10);
	  }
	}

	if (object.type == 'grass') {
	  var self = this;
	  // self.startCrouching();
          // self.cantStandUp = false;
	  self.crouching = true;
	}
      };

      clss.init(options);
    };
    return cls;
  })();

});
