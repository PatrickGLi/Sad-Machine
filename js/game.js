var Obstacle = require('./obstacle'),
    Ship = require('./ship'),
    Util = require('./util');

var Game = function () {
  this.obstacles = [];
  this.ships = [];

  this.addObstacles();
};

  Game.BG_COLOR = '#000000';
  Game.DIM_X = 1000;
  Game.DIM_Y = 600;
  Game.FPS = 32;
  Game.NUM_OBSTACLES = 1;

Game.prototype.add = function (object) {
  if (object instanceof Obstacle) {
    this.obstacles.push(object);
  } else if (object instanceof Ship) {
    this.ships.push(object);
  }
};

Game.prototype.addObstacles = function () {
  for (var i = 0; i < Game.NUM_OBSTACLES; i++) {
    this.add(new Obstacle({
                            game: this,
                            center: [Game.DIM_X/2, Game.DIM_Y/2]
                          }));
  }
};

Game.prototype.addShip = function () {
   var ship = new Ship({
     game: this,
     center: [Game.DIM_X/2, Game.DIM_Y/2]
   });

   this.add(ship);

   return ship;
};

Game.prototype.allObjects = function() {
  return this.obstacles.concat(this.ships);
};

Game.prototype.moveObjects = function () {
  this.allObjects().forEach(function (object) {
    object.move();
  });
};

Game.prototype.isOutOfBounds = function (radius) {
  var bound = Util.hypotenuse(Game.DIM_X, Game.DIM_Y) / 2;

  return (radius > bound);
};

Game.prototype.remove = function (object) {
  if (object instanceof Obstacle) {
    var idx = this.obstacles.indexOf(object);
    this.obstacles[idx] = new Obstacle({ game: this,
                                         center: [Game.DIM_X/2, Game.DIM_Y/2]
                                       });
  }
};

Game.prototype.checkCollisions = function() {
  var that = this;
  this.obstacles.forEach(function(obstacle) {
    if (obstacle.collidedWith(that.ships[0])) {
      console.log("collision");
    }
  });
};

Game.prototype.step = function() {
  this.moveObjects();
  this.checkCollisions();
};

Game.prototype.draw = function(ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.fillStyle = Game.BG_COLOR;
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

  this.allObjects().forEach(function (object) {
    object.draw(ctx);
  });
};

module.exports = Game;
