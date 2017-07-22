document.addEventListener('DOMContentLoaded', function() {

  var app = this;

  app.Box = (function() {

    function cls(options) {
      var clss = this;

      clss.init = function() {
	var self = this;
	clss.context = options.context;
	clss.color = options.color;
	clss.solid = options.solid || false;
	clss.hidden = options.hidden || false;

	clss.x = options.x;
	clss.y = options.y;
	clss.width = options.width;
	clss.height = options.height;

	clss.image = options.image || null;
	clss.type = options.type || 'box';
	clss.layer = options.layer || 0;
	clss.halfBlock = options.halfBlock || false;

	clss.sx = options.sx || 0;
	clss.sy = options.sy || 0;
	clss.sw = options.sw || 0;
	clss.sh = options.sh || 0;

	clss.dx = options.dx || options.x || 0;
	clss.dy = options.dy || options.y || 0;
	clss.dw = options.dw || 0;
	clss.dh = options.dh || 0;
      };

      clss.draw = function() {
        var self = this;
	if (self.image != null && !self.hidden) {
	  self.context.drawImage(
	    self.image.data, self.sx, self.sy, self.sw,
	    self.sh, self.dx, self.dy, self.dw, self.dh);
	} else {
          self.context.fillStyle = self.color;
          self.context.fillRect(self.x, self.y, self.width, self.height);
	}
      };

      clss.hide = function() {
	var self = this;
	self.hidden = true;
      };

      clss.init();
    };

    return cls;
  })();

});
