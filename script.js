let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let rows = 20; 
let cols = 20; 
let snake = [
    {x: 9 , y : 1 }];
let food;
let cellWidth = canvas.width / cols; 
let cellHeight = canvas.height / rows;
let direction = 'LEFT';
let snakeSize = {
    height : cellHeight, 
    width: cellWidth
};
let foodCollected = false;
let gamePaused = true;
let gameOver = false;
let GameStatus = 'START';
const scoreSteps = 10;
let score = 0;
let scoreLogMsg = "Punktestand:";
let dailyHighscoreMsg = "Tages Highscore: ";
let dailyHighscore = 0;

let timerMessage = "Zeit (sek): ";
let timeElapsed = 0;
let timeSeconds = 0;

let timeInterval = 200;
let gameDifficulty = 1;
let maxGameDifficulty = 5; //The game Speed will be accelerated 4 Times

placeFood();

setInterval(gameLoop, timeInterval);

document.addEventListener('keydown', keyDown);

draw();

function draw(){
    document.getElementById('score').innerHTML = scoreLogMsg;
    document.getElementById('highscore').innerHTML = dailyHighscoreMsg;
    document.getElementById('time').innerHTML = timerMessage;
    
    fillCanvas(gamePaused);

    requestAnimationFrame(draw);
}

function gameLoop(){
    
    if (gamePaused){
        return;
    }

    timeElapsed += 200;
    timeSeconds = ((timeElapsed % 60000) / 1000).toFixed(0);

    timerMessage = "Zeit (sek): " + timeSeconds;

    collisionDetect();
    testGameOver();

    if (foodCollected) {
       snake = [{
        x: snake[0].x, 
        y: snake[0].y },
        ...snake //Add the whole Snake Array
     ]
       foodCollected = false;
    }

    shiftSnake();

    if (direction == 'LEFT') {
        snake[0].x--;
    }

    if (direction == 'RIGHT') {
        snake[0].x++;
    }

    if (direction == 'UP') {
        snake[0].y--;
    }

    if (direction == 'DOWN') {
        snake[0].y++;
    }
}

function add(x,y){
    ctx.fillRect(x * cellWidth, y * snakeSize.height - 1, cellWidth - 1, cellHeight - 1);
} 

function keyDown(e){
    if (e.keyCode == 37){
        direction = 'LEFT'
    }

    if (e.keyCode == 38){
        direction = 'UP'
    }

    if (e.keyCode == 39){
        direction = 'RIGHT'
    }

    if (e.keyCode == 40){
        direction = 'DOWN'
    }

    if (e.keyCode == 32){
        gamePaused = !gamePaused;
        //Check if the Game has started
        if (GameStatus = 'START') { GameStatus = 'STARTED'};
    }
}

function placeFood(){
    let randomX = Math.floor(Math.random() * cols); 
    let randomY = Math.floor(Math.random() * rows);

    food = { 
        x : randomX, 
        y : randomY };
}

function shiftSnake() {
    for (let i =  snake.length - 1; i > 0; i--) {
        const part = snake[i];
        const lastPart = snake[i -1 ];

        part.x = lastPart.x;
        part.y = lastPart.y;

    }
}

function collisionDetect(){
    if( snake[0].x == food.x &&
        snake[0].y == food.y ){
            //Collect Food
            foodCollected = true;

            score = score + scoreSteps;
            scoreLogMsg = "Punkestand: " + score; 

            //Place Food
            placeFood();
        }
}

function testGameOver(){
    let firstPart = snake[0]; 
    let otherParts = snake.slice(1);

    let duplicatePart = otherParts.find(part => part.x == firstPart.x && part.y == firstPart.y);
    
    // 1. Snake runs against Wall
    if(snake[0].x < 0 || 
       snake[0].x > cols - 1||
       snake[0].y < 0 ||
       snake[0].y > rows - 1 || 
       duplicatePart){
          gameOver = true;
          GameStatus = 'GAMEOVER';
          resetGame();
       }
}
function resetGame(){
    placeFood();
        snake = [{
            x: 19, 
            y: 3
          }];
          direction = 'LEFT';

        if (score > dailyHighscore){
            dailyHighscore = score;
            dailyHighscoreMsg = "Tages Highscore: " + dailyHighscore;
        }
        score = 0;
        gamePaused = true;
}

function fillCanvas(isGamePaused){
    var x = canvas.width / 2;
    var y = canvas.height / 2;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';

    if (GameStatus == 'START'){
        subheader = 'Press Space to start';
    } else {
        subheader = 'Press Space to resume';
    }

    if (isGamePaused ){
    var fontDescr = "bold 18px Arial"; 
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Paused", x, y);
    ctx.font = "bold 14px Arial";
    ctx.fillText(subheader,x , ( y + 20 ));
    }
    else{

    snake.forEach(part => add(part.x, part.y));
    ctx.fillStyle = 'green';
    add(food.x, food.y); 

    }   
} 