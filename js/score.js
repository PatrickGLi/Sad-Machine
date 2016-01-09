var Score = function(options) {
  this.center = options.center;
  this.score = 0;
  this.scoreScale = 1;
  this.highScore = 0;
};

Score.prototype.increaseScore = function() {
  this.score += this.scoreScale;
};

Score.prototype.scaleScore = function() {
  this.scoreScale ++;
};

Score.prototype.draw = function(ctx) {
  ctx.font="20px Orbitron";
  ctx.textAlign="center";
  ctx.fillText(this.score, this.center[0], 200);
  ctx.textAlign="left";
  ctx.fillText(this.highScore, 160, 50);
  ctx.fillText("by patrick li", 20, 50);
  ctx.fillText("nero - the thrill (porter robinson remix)", 20, 100);
};

Score.prototype.reset = function() {
  this.highScore = this.score > this.highScore ? this.score : this.highScore;
  this.score = 0;
  this.scoreScale = 1;
};

module.exports = Score;
