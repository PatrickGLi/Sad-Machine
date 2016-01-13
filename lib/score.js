var Score = function(options) {
  this.center = options.center;
  this.score = 0;
  this.scoreScale = 1;
  this.highScore = 0;
};

Score.prototype.handleScore = function(loaded) {
  if (loaded) {
    this.highScore = this.score > this.highScore ? this.score : this.highScore;
    this.score += this.scoreScale;
  }
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
