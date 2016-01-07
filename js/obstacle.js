var Obstacle = function(options) {
  this.radius = 4;
  this.center = options.center;
  this.speed = 4;
  this.lineWidth = 15;
  this.startAngle = Math.random() * 2 * Math.PI;
  this.endAngle = this.startAngle + 1.8 * Math.PI;
  this.color = "#FEFEFB";
  this.game = options.game;
};

Obstacle.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.arc(
    this.center[0], this.center[1], this.radius, this.startAngle, this.endAngle
  );

  // console.log(this.startAngle, this.endAngle);
  ctx.lineWidth = this.lineWidth;
  ctx.strokeStyle = this.color;
  ctx.stroke();
};

Obstacle.prototype.move = function() {
  this.radius += this.speed;

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
      this.radius >= ship.travelRadius &&
      this.radius <= ship.travelRadius + this.lineWidth);
};

module.exports = Obstacle;
