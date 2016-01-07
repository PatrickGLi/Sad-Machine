/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1),
	    GameView = __webpack_require__(5);
	
	$(function() {
	  var canvasEl = document.getElementById('main');
	  canvasEl.width = Game.DIM_X;
	        canvasEl.height = Game.DIM_Y;
	        var ctx = canvasEl.getContext("2d");
	        var game = new Game();
	        new GameView(game, ctx).start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Obstacle = __webpack_require__(2),
	    Ship = __webpack_require__(3),
	    Util = __webpack_require__(4);
	
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


/***/ },
/* 2 */
/***/ function(module, exports) {

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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	Util = __webpack_require__(4);
	
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


/***/ },
/* 4 */
/***/ function(module, exports) {

	var Util = {
	  hypotenuse: function(x, y) {
	    return (
	      Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
	    );
	  }
	};
	
	module.exports = Util;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1),
	    Ship = __webpack_require__(3);
	
	var GameView = function(game, ctx) {
	  this.game = game;
	  this.ctx = ctx;
	  this.ship = this.game.addShip();
	};
	
	GameView.prototype.start = function() {
	  var that = this;
	  setInterval(function() {
	    that.game.step();
	    that.game.draw(that.ctx);
	  }, 20);
	};
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map