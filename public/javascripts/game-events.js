document.addEventListener('DOMContentLoaded', function() {

  var app = this;

  app.GameEvents = (function() {
    function cls(options) {
      var clss = this;

      clss.init = function() {
        var self = this;
        clss.context = options.context;
        clss.game = options.game;
      };

      clss.handleCollision = function(entityA, entityB, direction) {
        var self = this;
        var direction = direction || null;

        // The player crouches in grass.
        if(entityA.crouching && entityB.type == 'grass') {
          self.context.fillStyle = 'rgba(255, 0, 255, 0.3)';
          self.context.fillRect(entityA.x, entityA.y,
                                entityB.width, entityB.height)
        }

        // The player touches a coin.
        if (entityA.type == 'player' && entityB.type == 'coin') {
          self.context.fillStyle = 'rgba(255, 255, 0, 0.3)';
          self.context.fillRect(entityA.x, entityA.y,
                                entityB.width, entityB.height)
          entityB.hide();
        }

        // The player is in water.
        if (entityA.type == 'player' && entityB.type == 'water') {
          entityA.inWater = true;
          // entityA.speed = entityA.originalSpeed / 10;;
          // entityA.gravity = 0.001;
        }

        // The player climbs a ladder.
        if (entityA.type == 'player' && entityB.type == 'ladder') {
          if (direction != 'b') {
            if (!entityA.lockedToLadder) {
              entityA.x = entityB.x + entityA.width / 2;
              entityA.lockedToLadder = true;
            }
            entityA.climbing = true;
          }
        }
      };

      clss.init();
    };
    return cls;
  })();

});
