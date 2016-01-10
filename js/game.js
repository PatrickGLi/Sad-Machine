var Obstacle = require('./obstacle'),
    Ship = require('./ship'),
    Score = require('./score'),
    Util = require('./util');


var Game = function () {
  this.obstacles = [];
  this.ships = [];
  this.score = new Score({ center: [Game.DIM_X / 2, Game.DIM_Y / 2]});
  this.opposite = false;

  this.addObstacles();
};

Game.DIM_X = 1200;
Game.DIM_Y = 700;

Game.prototype.add = function (object) {
  if (object instanceof Obstacle) {
    this.obstacles.push(object);
  } else if (object instanceof Ship) {
    this.ships.push(object);
  } else if (object instanceof Score) {
    this.score = object;
  }
};

Game.prototype.reverse = function() {
  var that = this;
  this.opposite = this.opposite ? false : true;
  this.obstacles.forEach(function(obstacle){
    obstacle.opposite = that.opposite;
  });
};

Game.prototype.musicBounce = function() {
  this.obstacles.forEach(function(obstacle) {
    obstacle.lineWidth += obstacle.radius / 30;
  });

  var that = this;
  setTimeout(function() {
    that.obstacles.forEach(function(obstacle) {
      obstacle.lineWidth -= obstacle.radius / 30;
    });
  }, 100);
};

Game.prototype.addObstacles = function () {
  var that = this;

  this.add(new Obstacle({
        game: that,
        center: [Game.DIM_X / 2, Game.DIM_Y / 2],
        opposite: that.opposite
  }));
};

Game.prototype.addShip = function () {
   var ship = new Ship({
     game: this,
     center: [Game.DIM_X / 2, Game.DIM_Y / 2]
   });

   this.add(ship);

   return ship;
};

Game.prototype.allObjects = function() {
  return [].concat(this.obstacles, this.ships);
};

Game.prototype.moveObjects = function (delta) {
  this.allObjects().forEach(function (object) {
    object.move(delta);
  });
};

Game.prototype.isOutOfBounds = function (radius) {
  var bound = Util.hypotenuse(Game.DIM_X, Game.DIM_Y) / 2;

  return (radius > bound);
};

Game.prototype.remove = function (object) {
  if (object instanceof Obstacle) {
    var idx = this.obstacles.indexOf(object);
    this.obstacles.splice(idx, 1);
  }
};

Game.prototype.checkCollisions = function() {
  var that = this;
  this.obstacles.forEach(function(obstacle) {
    if (obstacle.collidedWith(that.ships[0])) {
      that.score.reset();
      that.allObjects().forEach(function(object) {
        that.remove(object);
      });
    }
  });
};

Game.prototype.step = function(delta) {
  this.score.increaseScore();
  this.moveObjects(delta);
  this.checkCollisions();
};

Game.prototype.draw = function(ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.01)';
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

  this.allObjects().forEach(function (object) {
    object.draw(ctx);
  });

  this.score.draw(ctx);
};

module.exports = Game;
