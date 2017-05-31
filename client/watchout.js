gameOptions = {
  height: 750,
  width: 500,
  nEnemies: 20,
  padding: 20  
};
  
gameStats = {
  highScore: 0,
  currentScore: 0,
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
    .attr('r', 10)
    .attr('class', 'player');

var move = function(x, y) {
  return function(event) {
    event.preventDefault();
    momentum = [momentum[0] + x, momentum[1] + y];
  };
};

d3.select('body').call(d3.keybinding()
    .on('a', move(-2.5, 0))
    .on('q', move(-2.5, -2.5))
    .on('w', move(0, -2.5))
    .on('e', move(2.5, -2.5))
    .on('c', move(2.5, 2.5))
    .on('d', move(2.5, 0))
    .on('x', move(0, 2.5))
    .on('z', move(-2.5, 2.5)));

// key('a', function() {
//   d3.select('body').call(d3.keybinding()
//     .on('←', move(-4, 0)));
// });



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
  
  enemy.transition().duration(3000)
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
}, 3000);

var updateScore = function() {
  d3.select('#currentScore').text(gameStats.currentScore.toString());
  d3.select('#highScore').text(gameStats.highScore.toString());
  return;
};



setInterval(function() {
  gameStats.currentScore++;
  updateScore();
}, 50);


var checkCollision = function() {
  d3.selectAll(".enemy").each( function(d, i){
    var xCoord = Math.floor(d3.select(this).attr("x"));
    var yCoord = Math.floor(d3.select(this).attr("y"));
    // console.log(xCoord, yCoord);
    var playerCoord = d3.transform(d3.select('.player').attr("transform")).translate;
    var playerCoordX = Math.floor(playerCoord[0]);
    var playerCoordY = Math.floor(playerCoord[1]);
    var closeToX = _.range(xCoord - 25, xCoord + 25);
    var closeToY = _.range(yCoord - 25, yCoord + 25);
    
    // console.log(xCoord === Math.floor(playerCoord[0]) ));
    if (_.contains(closeToX, playerCoordX) && _.contains(closeToY, playerCoordY)) {
      if (gameStats.currentScore > gameStats.highScore) {
        gameStats.highScore = gameStats.currentScore;
      }
      gameStats.currentScore = 0;
    }
    
    
  });
};

setInterval(function() {
  checkCollision();
}, 50);










