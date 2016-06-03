
// Enemies our player must avoid
var Enemy = function(y) {

    var yCoord = [130, 220, 310];

    this.x = 100;
    this.y = randY = yCoord[Math.floor(Math.random() * yCoord.length)];
    this.sprite = 'images/enemy-bug.png';
    

};



// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  //  allEnemies.push(new Enemy());

    //enemy speed 

    var time = new Date().getTime() * (0.0002);

    for (var i = 0, len = allEnemies.length; i < len; i++) {

        allEnemies[i].x = (Math.tan(time) * 600 + 10);

        var speed = (Math.tan(time) * 600 + 100);

        allEnemies[0].x = speed + 1000;
        allEnemies[1].x = speed - 1000;
        allEnemies[3].x = (Math.tan(time * 0.05) * 600 + 100);
        allEnemies[4].x = (Math.tan(time * 2.05) * 600 + 100);
        allEnemies[i].x = speed - (time * 500);
    }
};


Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite),
        this.x, this.y);
};


var Player = function() {

    this.sprite = ['images/char-cat-girl.png'];
    this.x = 200;
    this.y = 400;
};

Player.prototype.update = function(dt) {
    this.collisionDetection();
};


//detects if there is a collision between the player and either the
//water or an enemy/obstacle by comparing each's x and y coordinates.
//if they all equal the same values, then it initiates the startOver
//function, resetting the player's x and y coordinates and adding to
//either the Losses or the Levels value

Player.prototype.collisionDetection = function() {
    for (var c = 0, len = allEnemies.length; c < len; c++) {
        var en = allEnemies[c];

        var plCoord = [this.x, this.y];
        var enCoord = [en.x, en.y];

        if (this.x == Math.floor(en.x) && this.y == en.y) {
            this.youLose();
        } else {
            if (this.x == Math.ceil(en.x) && this.y == en.y) {
                this.youLose();
            }
            if (this.y == -50) {
                this.youWin();
            }
        }
    }
    for (c = 0, len = allObstacles.length; c < len; c++) {

        var ob = allObstacles[c];

        if (this.x == Math.floor(ob.x) && this.y == (ob.y - 90)) {
            this.youLose();
        } else {
            if (this.x == Math.ceil(ob.x) && this.y == (ob.y - 90)) {
                this.youLose();
            }
        }
    }
    for (c = 0, len = allMowers.length; c < len; c++) {

        var mow = allMowers[c];

        if (this.x == Math.floor(mow.x) && this.y == (mow.y)) {
            this.youLose();
        } else {
            if (this.x == Math.ceil(mow.x) && this.y == (mow.y)) {
                this.youLose();
            }
        }
    }
};



//detects when the collision is with an enemy or obstacle and
//quickly toggles the 'loser' graphic

Player.prototype.youLose = function() {
    this.startOver();
    if ($('#loser').css('display') == 'none') {
        $('#loser').toggle(1000);
    }
    if ($('#loser').css('display') == 'block') {
        $('#loser').toggle(1000);
    }

    var currentValue = parseInt($('#losses').text(), 10);
    var newValue = currentValue + 1;
    $('#losses').text(newValue);

    allLives.pop();

    if (newValue == 3) {
        this.gameOver();
    }
};


//displays the 'Game Over' graphic
Player.prototype.gameOver = function() {
    $('body').append('#gameOver');
    if ($('#gameOver').css('display') == 'none') {
        $('#gameOver').toggle(2000);
    }
};

//detects if the collision is with water, toggles the 'winner winner'
//graphic; invokes the levelUp function; adds a life if you reach level
// 5, displays the champion graphic if you get to level 10
//also invokes the levelFour function which adds lawn mower enemies
// at level four and beyond

Player.prototype.youWin = function() {
    this.startOver();
    if ($('#winner').css('display') == 'none') {
        $('#winner').toggle(1500);
    }
    if ($('#winner').css('display') == 'block') {
        $('#winner').toggle(1500);
    }
    var currentValue = parseInt($('#wins').text(), 10);
    var newValue = currentValue + 1;
    $('#wins').text(newValue);

    this.levelUp();

    if (newValue == 5) {
        allLives.push(new Life(400, 500));
    }
    if (newValue == 10) {
        if ($('#champion').css('display') == 'none') {
            $('#champion').toggle(2500);
        }
    }

    if (newValue > 3) {
        this.levelFour();
    }
};

Player.prototype.startOver = function() {
    this.x = 200;
    this.y = 400;

};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


//controls player movement
Player.prototype.handleInput = function() {

    if (event.keyCode == 37) {
        this.x -= 100;
    }
    if (event.keyCode == 39) {
        this.x += 100;
    }
    if (event.keyCode == 38) {
        this.y -= 90;
    }
    if (event.keyCode == 40) {
        this.y += 90;
    }

    //ensures player remains on the screen
    if (this.x > 490) {
        this.x = 400;
    }
    if (this.x < 0) {
        this.x = 0;
    }
    if (this.y > 400) {
        this.y = 400;
    }
};

//with each levelUp, a new obstacle is added at a random x and y coordinate

Player.prototype.levelUp = function() {
    allObstacles.push(new Obstacle());
};

var Obstacle = function(randX, randY) {
    var xCoord = [0, 100, 200, 300, 400];
    var yCoord = [130, 220, 310];
    this.sprite = 'images/enemy.png';
    this.x = randX = xCoord[Math.floor(Math.random() * xCoord.length)];
    this.y = randY = yCoord[Math.floor(Math.random() * yCoord.length)];
};

Obstacle.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

    

//adds lawn mower enemies that work on the grass tiles and come from
//right to left
Player.prototype.levelFour = function() {
    allMowers.push(new Mower());
};
    
var Mower = function(randX, randY) {
    var xCoord = [130, 50, 0, 350];
    var yCoord = [310, 400];
    this.sprite = 'images/mower.png';
    this.x = randX = xCoord[Math.floor(Math.random() * xCoord.length)];
    this.y = randY = yCoord[Math.floor(Math.random() * yCoord.length)];
};

Mower.prototype.update = function(dt) {
    var time = new Date().getTime() * (0.0002);

    for (i = 0, len = allMowers.length; i < len; i++) {

        allMowers[i].x = -(Math.tan(time) * 600 + 100 * [i]);
    }
};

Mower.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};





//displays number of lives left in the lower right hand corner
var Life = function(x, y) {

    this.sprite = 'images/lives.png';
    this.x = x;
    this.y = y;

};



Life.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


//the following works to set up the Game Menu, where you can select
// a character and start the game
var Menu = function(x, y) {

    this.sprite = 'images/char-boy.png';
    this.x = x;
    this.y = y;

};
Menu.prototype.render = function() {
    ctx2.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var menu = new Menu();

var allEnemies = [new Enemy(40), new Enemy(220), new Enemy(130),
    new Enemy(40), new Enemy(220), new Enemy(130), new Enemy()
];

var player = new Player();

var allObstacles = [];

var allMowers = [];

var allLives = [new Life(475, 500), new Life(450, 500),
    new Life(425, 500)
];


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);

});