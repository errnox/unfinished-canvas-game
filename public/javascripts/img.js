document.addEventListener('DOMContentLoaded', function(e) {

  var app = this;

  app.Img = (function() {

    function cls(options) {
      var clss = this;

      clss.init = function() {
        var self = this;
        self.data = new Image();
        self.data.src = options.src || '';
        self.name = options.name || '';
        self.x = options.x || 0;
        self.y = options.y || 0;
        self.width = options.width || 0;
        self.height = options.height || 0;
        self.loaded = false;

        // self.data.addEventListener('load', function() {
        //   self.width = self.data.naturalWidth;
        //   self.height = self.data.naturalHeight;
        //   self.loaded = true;
        // });
      };

      clss.onload = function(callback) {
        var self = this;
        var callback = callback || function() { /* Do nothing. */ };
        self.data.addEventListener('load', function() {
          self.width = self.data.naturalWidth;
          self.height = self.data.naturalHeight;
          self.loaded = true;
          callback();
        });
      };

      clss.init();
    }

    return cls;
  })();

});
