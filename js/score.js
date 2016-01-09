var Score = function(options) {
  this.center = options.center;
  this.score = 0;
  this.scoreScale = 1;
};

Score.prototype.increaseScore = function() {
  this.score += this.scoreScale;
};

Score.prototype.scaleScore = function() {
  this.scoreScale ++;
};

Score.prototype.draw = function(ctx) {
  // debugger
  var that = this;
  ctx.font="20px Orbitron";
  ctx.fillText(that.score, this.center[0], this.center[1]);
  ctx.textAlign="center"; 
};

Score.prototype.reset = function() {
  this.score = 0;
  this.scoreScale = 1;
};


module.exports = Score;
