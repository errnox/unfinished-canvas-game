document.addEventListener('DOMContentLoaded', function() {

  var app = this;

  app.Grass = (function(parentCls) {
    function cls(options) {
      var clss = this;

      clss.init = function() {
	var self = this;
	$.extend(self, parentCls);

	options.type = 'grass';
	options.width = 32;
	options.height = 32;
	if (!options.solid == false) {
	  options.solid = true;
	}
	options.halfBlock = true;
	options.solid = false;
	options.y += 16;
	options.sx = 32 * 2;
	options.sy = 32 * 8;
	options.sw = options.width;
	options.sh = options.height / 2;
	options.dw = options.width;
	options.dh = options.height / 2;

	parentCls.call(self, options);
      };

      clss.init();
    };

    return cls;
  })(app.Box);

});
