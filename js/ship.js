var Util = require('./util'),
    Constants = require('./constants');

var Ship = function(options) {
  this.radius = 10;
  this.sideLength = 30;
  this.travelRadius = 300;
  this.center = options.center;
  this.xPosition = 0;
  this.yPosition = this.travelRadius;
  this.theta = Math.PI / 2;
  this.deltaTheta = 0;
  this.maxSpeed = 0.03;
  this.color = "#FFFFFF";
  this.game = options.game;
};

Ship.prototype.draw = function(ctx) {
  var scaledX = this.center[0] + this.xPosition,
      scaledY = this.center[1] + this.yPosition;

  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(scaledX, scaledY, this.radius, 0, 2 * Math.PI);
  ctx.fill();
};

Ship.prototype.angle = function() {
  var hypotenuse = Util.hypotenuse(this.xPosition, this.yPosition);
  var angle = Math.acos(this.xPosition / hypotenuse);

  angle = this.yPosition < 0 ? 2 * Math.PI - angle : angle;
  // since cosine only accounts for 0 to pi;
  return angle;
};


Ship.prototype.move = function(timeDelta) {
  var thetaScale = timeDelta / Constants.NORMAL_FRAME_TIME_DELTA;
  this.theta = (this.theta + this.deltaTheta * thetaScale) % (2 * Math.PI);

  this.calculatePosition(this.theta);
};


Ship.prototype.calculatePosition = function (theta) {
  this.xPosition = this.travelRadius * Math.cos(theta);
  this.yPosition = this.travelRadius * Math.sin(theta);
};

Ship.prototype.power = function (direction) {
  this.deltaTheta = direction === Constants.CLOCKWISE ?
  this.deltaTheta + Constants.HALF_DEGREE_IN_RAD :
  this.deltaTheta - Constants.HALF_DEGREE_IN_RAD;

  if (this.deltaTheta >= this.maxSpeed) {
    this.deltaTheta = this.maxSpeed;
  } else if (this.deltaTheta <= - this.maxSpeed) {
    this.deltaTheta = -this.maxSpeed;
  }
};


module.exports = Ship;
