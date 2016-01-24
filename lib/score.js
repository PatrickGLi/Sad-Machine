var Score = function(options) {
  this.center = options.center;
  this.score = 0;
  this.scoreScale = 1;
  this.highScore = 0;
  this.instruction = "Use the left and right arrow keys to accelerate.";
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
  ctx.fillText(this.instruction, this.center[0], this.center[1] + 250)
  ctx.textAlign="left";
  ctx.fillText("by patrick li", 20, 50);
  ctx.fillText("nero - the thrill (porter robinson remix)", 20, 100);

};

Score.prototype.removeInstruction = function() {
  this.instruction = "";
};

Score.prototype.reset = function() {
  this.score = 0;
  this.scoreScale = 1;
};

module.exports = Score;
