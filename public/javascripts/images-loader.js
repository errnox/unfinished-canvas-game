document.addEventListener('DOMContentLoaded', function() {

  var app = this;

  app.ImagesLoader = (function() {

    function cls() {
      var clss = this;

      clss.init = function() {
        var self = this;
        self.loadedImages = {};
      }

      clss.loadImages = function(images) {
        var self = this;
        var imageNames = Object.keys(images);
        for (var i = 0; i < imageNames.length; i++) {
          var name = imageNames[i];
          self.loadedImages[name] = new app.Img({
            src: images[name],
            naem: name,
          });
        }
        return self.loadedImages;
      };

      clss.init();
    }

    return cls;
  })();

});
