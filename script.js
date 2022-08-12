var canvas;
var canvasContext;
var snakeHeadX = 0;
var snakeHeadY = 10;
var snakeSpeedX = 7;
var snakeSpeedY = 0;
var snakeLength = 20;
const SNAKE_WIDTH = 20;

var applePosX = 250;
var applePosY = 250;

var score;

var showGameOverScreen = false;

window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");

  var framesPerSecond = 30;

  if (canvasContext) {
    setInterval(function () {
      drawEverything();
      moveSnake();
      checkSnakePosition();
    }, 1000 / framesPerSecond);
  } else {
    // canvas-unsupported code here
    console.log("canvas unsupported");
  }

  document.addEventListener("keydown", keyPressed);
};

function keyPressed(evt) {
  console.log("keypressed");
  if (showGameOverScreen) {
    showGameOverScreen = false;
  }
  changeDirection(evt.key);
}

function drawEverything() {
  // Create background
  colorRect(0, 0, canvas.width, canvas.height, "pink");

  if (showGameOverScreen) {
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Game Over!", 350, 200);
    canvasContext.fillText("Press any key to play again", 320, 230);
    return;
  }

  // Create Snake
  colorRect(snakeHeadX, snakeHeadY, SNAKE_WIDTH, 20, "white");

  // Apple
  colorRect(applePosX, applePosY, 10, 10, "red");
}

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}

function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

function moveSnake() {
  if (showGameOverScreen) {
    return;
  }

  // Snake Movement
  snakeHeadX += snakeSpeedX;
  snakeHeadY += snakeSpeedY;
}

function checkSnakePosition() {
  var snakeMinX = snakeHeadX;
  var snakeMaxX = snakeHeadX + SNAKE_WIDTH;
  var snakeMinY = snakeHeadY;
  var snakeMaxY = snakeHeadY + SNAKE_WIDTH;
  var appleMinX = applePosX;
  var appleMaxX = applePosX + 10;
  var appleMinY = applePosY;
  var appleMaxY = applePosY + 10;

  // Check for collision with wall
  if (
    snakeHeadX < 0 ||
    snakeHeadY < 0 ||
    snakeHeadX > canvas.width - SNAKE_WIDTH ||
    snakeHeadY > canvas.height - SNAKE_WIDTH
  ) {
    reset();
    return;
  }
  // Check if Snake is eating apple
  if (
    ((appleMinX >= snakeMinX && appleMinX <= snakeMaxX) ||
      (appleMaxX >= snakeMinX && appleMaxX <= snakeMaxX)) &&
    ((appleMinY >= snakeMinY && appleMinY <= snakeMaxY) ||
      (appleMaxY >= snakeMinY && appleMaxY <= snakeMaxY))
  ) {
    addApple();
  }

  // Check if Snake is eating itself
  //
}

function reset() {
  snakeHeadX = 10;
  snakeHeadY = 10;
  snakeSpeedX = 7;
  snakeSpeedY = 0;
  applePosX = random(canvas.width - 11);
  applePosY = random(canvas.height - 11);
}

function addApple() {
  applePosX = randomInt(canvas.width - 11);
  applePosY = randomInt(canvas.height - 11);
}

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function changeDirection(direction) {
  switch (direction) {
    case "ArrowUp":
      if (snakeSpeedY > 0) {
        break;
      } else {
        snakeSpeedX = 0;
        snakeSpeedY = -7;
        break;
      }
    case "ArrowDown":
      if (snakeSpeedY < 0) {
        break;
      } else {
        snakeSpeedX = 0;
        snakeSpeedY = 7;
        break;
      }
    case "ArrowLeft":
      if (snakeSpeedX > 0) {
        break;
      } else {
        snakeSpeedX = -7;
        snakeSpeedY = 0;
        break;
      }
    case "ArrowRight":
      if (snakeSpeedX < 0) {
        break;
      } else {
        snakeSpeedX = 7;
        snakeSpeedY = 0;
        break;
      }
  }
}
