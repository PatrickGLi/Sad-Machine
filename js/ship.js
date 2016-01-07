Util = require('./util');

var Ship = function(options) {
  this.travelRadius = 250;
  this.center = options.center;
  this.xPosition = 0;
  this.yPosition = this.travelRadius;
  this.game = options.game;
  this.radius = 10;
  this.color = "#FFFFFF";
};

Ship.prototype.draw = function(ctx) {
  var scaledX = this.center[0] + this.xPosition,
      scaledY = this.center[1] + this.yPosition;

  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(scaledX, scaledY, this.radius, 0, 2 * Math.PI);
  ctx.fill();

  this.angle();
};

Ship.prototype.angle = function() {
  var hypotenuse = Util.hypotenuse(this.xPosition, this.yPosition);
  var angle = Math.acos(this.xPosition / hypotenuse);

  angle = this.yPosition < 0 ? angle + Math.PI : angle;
  // since cosine only accounts for 0 to pi, add pi when y is negative
  return angle;
};

Ship.prototype.move = function() {

};



module.exports = Ship;
