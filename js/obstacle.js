var Constants = require('./constants');

var Obstacle = function(options) {
  this.radius = 4;
  this.center = options.center;
  this.opposite = options.opposite;
  this.speed = 1.2;
  this.lineWidth = 1;
  this.shadowBlur = 20;
  this.startAngle = Math.random() * 2 * Math.PI;
  this.endAngle = this.startAngle + 1.85 * Math.PI;
  this.color = Obstacle.COLORS[Math.floor(Math.random() * 3)];
  this.game = options.game;
};

Obstacle.COLORS = ["#ffcbd3", "#996d73", "#fff7f8"];

Obstacle.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.arc(
    this.center[0], this.center[1], this.radius, this.startAngle, this.endAngle
  );

  ctx.lineWidth = this.lineWidth;
  ctx.strokeStyle = this.color;
  ctx.shadowColor = '#999';
  ctx.shadowBlur = this.shadowBlur;
  ctx.shadowOffsetX = 15;
  ctx.shadowOffsetY = 15;
  ctx.stroke();
};

Obstacle.prototype.move = function(timeDelta) {
  var radialScale = timeDelta / Constants.NORMAL_FRAME_TIME_DELTA;

  this.radius += this.speed * radialScale;
  this.lineWidth += this.speed / 30 * radialScale;
  this.shadowBlur += (.1 * radialScale);

  if (this.opposite) {
    this.startAngle -= .005;
    this.endAngle -= .005;
  } else {
    this.startAngle += .005;
    this.endAngle += .005;
  }

  if (this.game.isOutOfBounds(this.radius)) {
    this.game.remove(this);
  }
};

Obstacle.prototype.collidedWith = function(ship) {
  var shipAngle = ship.angle();

  shipAngle = this.startAngle > shipAngle ? shipAngle + 2 * Math.PI : shipAngle;
  // calculate start angle by choosing a random radian value between 0 and 2pi
  // radians. calculate end angle by adding to start angle 1.9 pi radians.
  // in the case that start angle is greater than the ship angle, we add 2pi
  // to ship angle. this lets us accurately check if it is still between
  // the start and end angle.
  return (shipAngle > this.startAngle &&
      shipAngle < this.endAngle &&
      this.radius >= ship.travelRadius - ship.radius &&
      this.radius <= ship.travelRadius + this.lineWidth + ship.radius);
};

module.exports = Obstacle;
