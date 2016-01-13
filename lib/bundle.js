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
/******/ 	__webpack_require__.p = "/lib/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1),
	    GameView = __webpack_require__(7);
	
	$(function() {
	  var canvasEl = document.getElementById('main');
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	  var ctx = canvasEl.getContext("2d");
	  var game = new Game();
	  var vid = document.getElementById('music');
	  vid.onloadeddata = function() {
	    new GameView(game, ctx).start();
	  }
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Obstacle = __webpack_require__(2),
	    Ship = __webpack_require__(4),
	    Score = __webpack_require__(6),
	    Util = __webpack_require__(5);
	
	
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
	      that.allObjects().forEach(function(object) {
	        that.score.reset();
	        that.remove(object);
	      });
	    }
	  });
	};
	
	Game.prototype.step = function(delta) {
	  this.score.handleScore();
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Constants = __webpack_require__(3);
	
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


/***/ },
/* 3 */
/***/ function(module, exports) {

	var Constants = {
	  CLOCKWISE: "CLOCKWISE",
	  COUNTER_CLOCKWISE: "COUNTER_CLOCKWISE",
	  HALF_DEGREE_IN_RAD: 0.00872665,
	  NORMAL_FRAME_TIME_DELTA: 1000/60
	};
	
	module.exports = Constants;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(5),
	    Constants = __webpack_require__(3);
	
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


/***/ },
/* 5 */
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
/* 6 */
/***/ function(module, exports) {

	var Score = function(options) {
	  this.center = options.center;
	  this.score = 0;
	  this.scoreScale = 1;
	  this.highScore = 0;
	};
	
	Score.prototype.handleScore = function() {
	  this.highScore = this.score > this.highScore ? this.score : this.highScore;
	  this.score += this.scoreScale;
	};
	
	Score.prototype.scaleScore = function() {
	  this.scoreScale ++;
	};
	
	Score.prototype.draw = function(ctx) {
	  ctx.font="20px Orbitron";
	  ctx.textAlign="center";
	  ctx.fillText(this.score, this.center[0], 200);
	  ctx.fillText(this.highScore, this.center[0], 100);
	  ctx.textAlign="left";
	  ctx.fillText("by patrick li", 20, 50);
	  ctx.fillText("nero - the thrill (porter robinson remix)", 20, 100);
	};
	
	Score.prototype.reset = function() {
	  this.score = 0;
	  this.scoreScale = 1;
	};
	
	module.exports = Score;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1),
	    Ship = __webpack_require__(4),
	    Constants = __webpack_require__(3);
	
	var GameView = function(game, ctx) {
	  this.game = game;
	  this.ctx = ctx;
	  this.ship = this.game.addShip();
	};
	
	GameView.prototype.bindKeyHandlers = function () {
	  var ship = this.ship;
	
	  key("left", function() { ship.power(Constants.CLOCKWISE); });
	  key("right", function() { ship.power(Constants.COUNTER_CLOCKWISE); });
	};
	
	GameView.prototype.start = function() {
	  this.bindKeyHandlers();
	  this.lastTime = 0;
	  var that = this;
	
	  setTimeout(function() {
	    that.addMusic();
	    setInterval(function() {
	      that.game.musicBounce();
	      that.game.score.scaleScore();
	    }, 1500);
	
	  }, 2300);
	
	  setInterval(this.game.reverse.bind(this.game), 6000);
	  setInterval(this.game.addObstacles.bind(this.game), 3000);
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	GameView.prototype.addMusic = function() {
	  document.getElementById('music').play();
	};
	
	GameView.prototype.animate = function(time){
	  var timeDelta = time - this.lastTime;
	
	  this.game.step(timeDelta);
	  this.game.draw(this.ctx);
	  this.lastTime = time;
	
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map