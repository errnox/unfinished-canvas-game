document.addEventListener('DOMContentLoaded', function() {

  var app = this;

  app.Dirt = (function(parentCls) {
    function cls(options) {
      var clss = this;

      clss.init = function() {
	var self = this;
	$.extend(self, parentCls);

	options.type = 'dirt';
	options.width = 32;
	options.height = 32;
	if (!options.solid == false) {
	  options.solid = true;
	}
	options.sx = 0;
	if (options.layer < 0) {
	  options.sx = 32 * 3;
	}
	options.sy = 32 * 7;
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
