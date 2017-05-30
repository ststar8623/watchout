gameOptions = {
  height: 750,
  width: 500,
  nEnemies: 50,
  padding: 20  
};
  
gameStats = {
  highScore: 0,
  currentScore: 0,
  collisions: 0
};


var width = 500;
var height = 800;
var svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height).style({'border': '2px solid black'})
  .append('g')
    .attr('transform', 'translate(0,0)');

var point = [width / 2, height / 2];
var momentum = [0, 0];

var circle = svg.append('circle')
    .datum(point)
    .attr('r', 10);

var move = function(x, y) {
  return function(event) {
    event.preventDefault();
    momentum = [momentum[0] + x, momentum[1] + y];
  };
};

d3.select('body').call(d3.keybinding()
    .on('←', move(-2, 0))
    .on('↑', move(0, -2))
    .on('→', move(2, 0))
    .on('↓', move(0, 2)));

d3.timer(function() {
  point[0] = Math.min(width, Math.max(0, momentum[0] + point[0]));
  point[1] = Math.min(height, Math.max(0, momentum[1] + point[1]));
  circle
    .datum(point)
    .attr('transform', function(d) { return 'translate(' + d + ')'; });
  momentum[0] *= 0.9;
  momentum[1] *= 0.9;
});

var createEnemies = function() {
  return _.range(0, gameOptions.nEnemies).map(function(i) {
    return {
      id: i,
      x: Math.random() * gameOptions.width,
      y: Math.random() * gameOptions.height
    };
  });
};

var updateEnemies = function(data) {
  var enemy = d3.select('svg').selectAll('.enemy').data(data);

  
  enemy.enter().append('image').attr('class', 'enemy').attr('x', function(data) { 
    return data.x;
  }).attr('y', function(data) {
    return data.y;
  }).attr('width', 40)
  .attr('height', 40)
  .attr('xlink:href', 'https://media.giphy.com/media/yytwTf0Oy7umc/giphy.gif');
  
};
  
  
var transitionEnemies = function(data) {
  var enemy = d3.select('svg').selectAll('.enemy').data(data);
  
  enemy.transition().duration(2000)
    .attr('x', function(data) {
      return Math.random() * gameOptions.width;
    })
    .attr('y', function(data) {
      return Math.random() * gameOptions.height;
    });
};  


updateEnemies(createEnemies);

  
setInterval(function() {
  transitionEnemies(createEnemies());
}, 2000);



















