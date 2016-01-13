var Game = require('./game'),
    GameView = require('./gameview');

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
