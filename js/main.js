var Game = require('./game'),
    GameView = require('./gameview');

$(function() {
  var canvasEl = document.getElementById('main');
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;
  var ctx = canvasEl.getContext("2d");
  var game = new Game();
  new GameView(game, ctx).start();
});
