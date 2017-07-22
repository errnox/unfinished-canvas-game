document.addEventListener('DOMContentLoaded', function() {

  var app = this;

  app.Ladder = (function(parentCls) {
    function cls(options) {
      var clss = this;

      clss.init = function() {
	var self = this;
	$.extend(self, parentCls);

	options.type = options.type || 'ladder';
	options.width = 22;
	options.height = 32;
	options.layer = -1;
	if (!options.solid == false) {
	  options.solid = true;
	}
	options.sx = options.sx || 32 * 4;
	options.sy = options.xy || 32 * 9;
	options.dx = options.x + 10;

	options.sw = options.width;
	options.sh = options.height;
	options.dw = options.width;
	options.dh = options.height;

	parentCls.call(self, options);
      };

      clss.init();
    };

    return cls;
  })(app.Box);

});
