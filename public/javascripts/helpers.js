$(document).ready(function(e) {

  var app = this;

  app.Helpers = (function() {

    function cls() {
      var clss = this;

      clss.init = function() {
        // Initialize
      };

      clss.randomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
      };

      clss.imageDataToArray = function(
        imageData, sx, sy, sw, sh, dx, dy, dw, dh) {
        var canvas = $('<canvas/>');
        var x = x || 0;
        var y = y || 0;
        canvas.width(dw);
        canvas.height(dh);
        $('body').append(canvas);
        canvas.hide();
        var context = canvas[0].getContext('2d');
        context.drawImage(imageData, sx, sy, sw, sh, dx, dy, dw, dh);
        var array = context.getImageData(0, 0, dw, dh).data;
        canvas.remove();
        // Remove the DOM element.
        return array;
      };

      clss.imageDataAsDataURL = function(imageData, width, height) {
        var canvas = $('<canvas/>');
        canvas.width(width);
        canvas.height(height);
        $('body').append(canvas);
        canvas.hide();
        var context = canvas[0].getContext('2d');
        context.putImageData(imageData, 0, 0);
        canvas.remove();
        var dataURL = canvas[0].toDataURL();
        return dataURL;
      };

      clss.drawImage = function(
        context, image, sx, sy, sw, sh, dx, dy, dw, dh) {
        // var self = this;
        // var newImage = new Image();
        // // newImage.src = self.imageDataAsDataURL(imageData, 32, 32);
        // // newImage.data = self.imageDataAsDataURL(imageData, 32, 32);
        // self.context.drawImage(newImage, self.x - self.width / 2,
        //                        self.y - scaleFactor * 32);
      }

      clss.choice = function(array) {
	return array[clss.randomInt(0, array.length - 1)];
      };

      clss.init();
    };

    return cls;
  })();

});
