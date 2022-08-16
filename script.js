var canvas;
var canvasContext;

const SPEED_MAG = 20;
var snakeSpeedX = SPEED_MAG;
var snakeSpeedY = 0;
const SNAKE_WIDTH = 20;
var snakeBody;

var applePosX = 250;
var applePosY = 250;
const APPLE_SIZE = 10;

var score = 0;
var showGameOverScreen = false;

class SnakeNode {
  constructor(inX, inY, next = null, parent = null) {
    (this.x = inX), (this.y = inY), (this.next = next), (this.parent = parent);
  }
}
class SnakeLinkedList {
  constructor(head = null) {
    this.head = head;
  }

  //insert first
  insertFirst(inX, inY) {
    let newNode = new SnakeNode(inX, inY, this.head);
    this.head.parent = newNode;
    this.head = newNode;
    this.size++;
  }

  //insert last
  insertLast(inX, inY) {
    let newNode = new SnakeNode(inX, inY);
    let current;

    if (!this.head) {
      this.head = node;
    } else {
      current = this.head;

      while (current.next) {
        current = current.next;
      }

      newNode.parent = current;
      current.next = newNode;
    }

    this.size++;
  }

  clearList() {
    this.head = null;
    this.size = 0;
  }
}

window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");
  var framesPerSecond = 6;

  //initialize SnakeList
  let headLink = new SnakeNode(0, 10);
  snakeBody = new SnakeLinkedList(headLink);

  if (canvasContext) {
    setInterval(function () {
      drawBoard();
      if (showGameOverScreen) {
        return;
      }
      checkSnakePosition();
      moveSnake();
      console.log(snakeBody);
    }, 1000 / framesPerSecond);
  } else {
    console.log("canvas unsupported");
  }

  document.addEventListener("keydown", keyPressed);
};

function keyPressed(evt) {
  // console.log("keypressed");
  if (showGameOverScreen) {
    showGameOverScreen = false;
    score = 0;
  }
  changeDirection(evt.key);
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

function changeDirection(direction) {
  switch (direction) {
    case "ArrowUp":
      if (snakeSpeedY > 0) {
        break;
      } else {
        snakeSpeedX = 0;
        snakeSpeedY = -SPEED_MAG;
        break;
      }
    case "ArrowDown":
      if (snakeSpeedY < 0) {
        break;
      } else {
        snakeSpeedX = 0;
        snakeSpeedY = SPEED_MAG;
        break;
      }
    case "ArrowLeft":
      if (snakeSpeedX > 0) {
        break;
      } else {
        snakeSpeedX = -SPEED_MAG;
        snakeSpeedY = 0;
        break;
      }
    case "ArrowRight":
      if (snakeSpeedX < 0) {
        break;
      } else {
        snakeSpeedX = SPEED_MAG;
        snakeSpeedY = 0;
        break;
      }
  }
}

function drawBoard() {
  // Create background
  colorRect(0, 0, canvas.width, canvas.height, "pink");
  canvasContext.fillStyle = "white";
  canvasContext.fillText("Score: " + score, canvas.width - 70, 20);

  //Game Over Screen
  if (showGameOverScreen) {
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Game Over!", 250, 200);
    canvasContext.fillText("Press any key to play again", 220, 230);
    return;
  }

  // Initial Apple
  colorRect(applePosX, applePosY, APPLE_SIZE, APPLE_SIZE, "red");
}

function moveSnake() {
  var tempLink;
  if (showGameOverScreen) {
    return;
  }

  tempLink = snakeBody.head;

  while (tempLink.next) {
    tempLink = tempLink.next;
  }

  while (tempLink.parent) {
    var parentLink = tempLink.parent;

    tempLink.x = parentLink.x;
    tempLink.y = parentLink.y;
    tempLink = tempLink.parent;
  }
  snakeBody.head.x += snakeSpeedX;
  snakeBody.head.y += snakeSpeedY;
  snakeBody.head = tempLink;
}

function checkSnakePosition() {
  // Check for collision with wall
  if (
    snakeBody.head.x < 0 ||
    snakeBody.head.y < 0 ||
    snakeBody.head.x + SNAKE_WIDTH > canvas.width ||
    snakeBody.head.y + SNAKE_WIDTH > canvas.height
  ) {
    reset();
    return;
  }

  // Check if Snake is eating apple
  if (
    collision(
      applePosX,
      applePosY,
      APPLE_SIZE,
      snakeBody.head.x,
      snakeBody.head.y,
      SNAKE_WIDTH
    )
  ) {
    addApple();
  }

  // Draw Snake &Check if eating itself
  var tempLink = snakeBody.head;
  var headX = snakeBody.head.x;
  var headY = snakeBody.head.y;
  var i = 0;

  while (tempLink) {
    //skip the first two links behind the head link
    if (
      i > 2 &&
      collision(
        snakeBody.head.x,
        snakeBody.head.y,
        SNAKE_WIDTH,
        tempLink.x,
        tempLink.y,
        SNAKE_WIDTH
      )
    ) {
      reset();
      return;
    }

    colorRect(tempLink.x, tempLink.y, SNAKE_WIDTH, SNAKE_WIDTH, "white");
    tempLink = tempLink.next;
    i++;
  }
}

function collision(x1, y1, size1, x2, y2, size2) {
  var x1Min = x1;
  var x1Max = x1 + size1;
  var y1Min = y1;
  var y1Max = y1 + size1;
  var x2Min = x2;
  var x2Max = x2 + size2;
  var y2Min = y2;
  var y2Max = y2 + size2;

  var result = false;

  if (
    ((x1Min > x2Min && x1Min < x2Max) || (x1Max > x2Min && x1Max < x2Max)) &&
    ((y1Min > y2Min && y1Min < y2Max) || (y1Max > y2Min && y1Max < y2Max))
  ) {
    result = true;
  }
  return result;
}

function reset() {
  showGameOverScreen = true;
  snakeBody.head.x = 0;
  snakeBody.head.y = 10;
  snakeBody.head.next = null;
  snakeSpeedX = SPEED_MAG;
  snakeSpeedY = 0;
  applePosX = randomInt(canvas.width - APPLE_SIZE - 1);
  applePosY = randomInt(canvas.height - APPLE_SIZE - 1);
}

function addApple() {
  applePosX = randomInt(canvas.width - APPLE_SIZE - 1);
  applePosY = randomInt(canvas.height - APPLE_SIZE - 1);
  var oldHeadLink = snakeBody.head;

  snakeBody.insertFirst(
    oldHeadLink.x + (snakeSpeedX / SPEED_MAG) * SNAKE_WIDTH,
    oldHeadLink.y + (snakeSpeedY / SPEED_MAG) * SNAKE_WIDTH
  );
  score++;
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
        snakeSpeedY = -SPEED_MAG;
        break;
      }
    case "ArrowDown":
      if (snakeSpeedY < 0) {
        break;
      } else {
        snakeSpeedX = 0;
        snakeSpeedY = SPEED_MAG;
        break;
      }
    case "ArrowLeft":
      if (snakeSpeedX > 0) {
        break;
      } else {
        snakeSpeedX = -SPEED_MAG;
        snakeSpeedY = 0;
        break;
      }
    case "ArrowRight":
      if (snakeSpeedX < 0) {
        break;
      } else {
        snakeSpeedX = SPEED_MAG;
        snakeSpeedY = 0;
        break;
      }
  }
}
