document.addEventListener('DOMContentLoaded', function() {

  var app = this;

  app.Chamber = (function() {
    // These are the types of chambers:
    // - `filled'
    // - `platforms'

    function cls(options) {
      var clss = this;

      clss.init = function() {
	// Initialize
	clss.type = options.type || 'filled';
	clss.blocks = options.blocks || [];
      };

      clss.init();
    }

    return cls;
  })();
  
});
