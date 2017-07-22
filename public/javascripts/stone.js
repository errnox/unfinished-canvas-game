document.addEventListener('DOMContentLoaded', function() {

  var app = this;

  app.Stone = (function(parentCls) {
    function cls(options) {
      var clss = this;

      clss.init = function() {
	var self = this;
	$.extend(self, parentCls);

	options.type = options.type || 'stone';
	options.width = 32;
	options.height = 32;
	if (!options.solid == false) {
	  options.solid = true;
	}
	options.sx = options.sx || 0;
	options.sy = 32 * 8;
	if (options.layer <= -1) {
	  options.sx = 32 * 3;
	}
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
