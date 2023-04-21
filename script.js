const APPLE_SIZE = 20;
const SNAKE_WIDTH = 20;
const SPEED_MAG = 20;

var canvas;
var canvasContext;

const snake = {
  speedMag: SPEED_MAG,
  speedX: SPEED_MAG,
  speedY: 0,
  width: SNAKE_WIDTH,
  body: null,
};

const apple = {
  posX: 200,
  posY: 200,
  size: APPLE_SIZE,
};

var score = 0;
var showGameOverScreen = false;

window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");
  var framesPerSecond = 6;

  //initialize SnakeList
  let headLink = new SnakeNode(0, 20);
  snake.body = new SnakeLinkedList(headLink);

  if (canvasContext) {
    setInterval(function () {
      GameBoard.drawBoard(
        canvas,
        showGameOverScreen,
        apple.posX,
        apple.posY,
        apple.size
      );
      if (showGameOverScreen) {
        return;
      }
      checkSnakePosition();
      moveSnake();
    }, 1000 / framesPerSecond);
  } else {
    console.log("canvas unsupported");
  }

  document.addEventListener("keydown", keyPressed);
};

function keyPressed(evt) {
  if (showGameOverScreen) {
    showGameOverScreen = false;
    score = 0;
  }
  changeDirection(evt.key);
}

function changeDirection(direction) {
  switch (direction) {
    case "ArrowUp":
      if (snake.speedY > 0) {
        break;
      } else {
        snake.speedX = 0;
        snake.speedY = -snake.speedMag;
        break;
      }
    case "ArrowDown":
      if (snake.speedY < 0) {
        break;
      } else {
        snake.speedX = 0;
        snake.speedY = snake.speedMag;
        break;
      }
    case "ArrowLeft":
      if (snake.speedX > 0) {
        break;
      } else {
        snake.speedX = -snake.speedMag;
        snake.speedY = 0;
        break;
      }
    case "ArrowRight":
      if (snake.speedX < 0) {
        break;
      } else {
        snake.speedX = snake.speedMag;
        snake.speedY = 0;
        break;
      }
  }
}

function moveSnake() {
  var tempLink;
  if (showGameOverScreen) {
    return;
  }

  tempLink = snake.body.head;

  while (tempLink.next) {
    tempLink = tempLink.next;
  }

  while (tempLink.parent) {
    var parentLink = tempLink.parent;

    tempLink.x = parentLink.x;
    tempLink.y = parentLink.y;
    tempLink = tempLink.parent;
  }
  snake.body.head.x += snake.speedX;
  snake.body.head.y += snake.speedY;
  snake.body.head = tempLink;
}

function checkSnakePosition() {
  // Check for collision with wall
  if (
    snake.body.head.x < 0 ||
    snake.body.head.y < 0 ||
    snake.body.head.x + snake.width > canvas.width ||
    snake.body.head.y + snake.width > canvas.height
  ) {
    reset();
    return;
  }

  // Check if Snake is eating apple
  if (collision(apple.posX, apple.posY, snake.body.head.x, snake.body.head.y)) {
    addApple();
  }

  // Draw Snake &Check if eating itself
  var tempLink = snake.body.head;
  var headX = snake.body.head.x;
  var headY = snake.body.head.y;
  var i = 0;

  while (tempLink) {
    //skip the first two links behind the head link
    if (
      i > 2 &&
      collision(snake.body.head.x, snake.body.head.y, tempLink.x, tempLink.y)
    ) {
      reset();
      return;
    }

    GameBoard.colorRect(
      tempLink.x,
      tempLink.y,
      snake.width,
      snake.width,
      "white",
      canvasContext
    );
    tempLink = tempLink.next;
    i++;
  }
}

function collision(object1X, object1Y, object2X, object2Y) {
  return object1X === object2X && object1Y === object2Y;
}

function reset() {
  showGameOverScreen = true;
  snake.body.head.x = 0;
  snake.body.head.y = 20;
  snake.body.head.next = null;
  snake.speedX = snake.speedMag;
  snake.speedY = 0;
  apple.posX = randomInt(canvas.width - apple.size - 1);
  apple.posY = randomInt(canvas.height - apple.size - 1);
}

function addApple() {
  apple.posX = randomInt(canvas.width - apple.size - 1);
  apple.posY = randomInt(canvas.height - apple.size - 1);
  var oldHeadLink = snake.body.head;

  snake.body.insertFirst(
    oldHeadLink.x + (snake.speedX / snake.speedMag) * snake.width,
    oldHeadLink.y + (snake.speedY / snake.speedMag) * snake.width
  );
  score++;
}

function randomInt(max) {
  return Math.floor((Math.random() * max) / 20) * 20;
}
