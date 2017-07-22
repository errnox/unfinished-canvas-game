document.addEventListener('DOMContentLoaded', function() {

  var app = this;

  app.HalfStone = (function(parentCls) {
    function cls(options) {
      var clss = this;

      clss.init = function() {
        var self = this;

        $.extend(self, parentCls);

        options.type = 'half-stone';
        options.width = 32;
        options.height = 32 / 2;

        if (!options.solid == false) {
          options.solid = true;
        }

	options.halfBlock = true;
        options.y += 16;
        options.sx = 32;
        options.sy = 32 * 8;
        options.sw = options.width;
        options.sh = 32 / 2;
        options.dw = options.width;
        options.dh = options.height;

        parentCls.call(self, options);
      };

      clss.init();
    };

    return cls;
  })(app.Stone);

});
