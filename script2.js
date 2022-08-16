var canvas;
var canvasContext;

const SPEED_MAG = 7;
var snakeSpeedX = SPEED_MAG;
var snakeSpeedY = 0;
const SNAKE_WIDTH = 20;
var snakeBody;
var headLink;

var applePosX = 250;
var applePosY = 250;
const APPLE_SIZE = 10;

var score;
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

  headLink = new ListNode([0, 10]);
  snakeBody = new LinkedList(headLink);
  snakeLength++;

  var framesPerSecond = 30;

  drawSnake();

  if (canvasContext) {
    setInterval(function () {
      drawEverything();
      checkSnakePosition();
      moveSnake();
    }, 1000 / framesPerSecond);
  } else {
    // canvas-unsupported code here
    console.log("canvas unsupported");
  }

  document.addEventListener("keydown", keyPressed);
};

function keyPressed(evt) {
  // console.log("keypressed");
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
  drawSnake();

  // Apple
  colorRect(applePosX, applePosY, APPLE_SIZE, APPLE_SIZE, "red");
}

function drawSnake() {
  var tempLink = snakeBody.head;
  // console.log(snakeBody);

  while (tempLink) {
    // console.log(tempLink.data[0], tempLink.data[1]);
    colorRect(
      tempLink.data[0],
      tempLink.data[1],
      SNAKE_WIDTH,
      SNAKE_WIDTH,
      "white"
    );
    tempLink = tempLink.next;
  }
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
  var tempLink;
  if (showGameOverScreen) {
    return;
  }

  headLink.data[0] += snakeSpeedX;
  headLink.data[1] += snakeSpeedY;
  tempLink = headLink;

  while (tempLink.next) {
    tempLink = tempLink.next;
  }

  while (tempLink.parent) {
    var parentLink = tempLink.parent;
    if (parentLink.data[0] - tempLink.data[0] === 0) {
      if (parentLink.data[1] > tempLink.data[1]) {
        tempLink.data[1] += SPEED_MAG;
      } else if (parentLink.data[1] < tempLink.data[1]) {
        tempLink.data[1] -= SPEED_MAG;
      }
    } else if (parentLink.data[1] - tempLink.data[1] === 0) {
      if (parentLink.data[0] > tempLink.data[0]) {
        tempLink.data[0] += SPEED_MAG;
      } else if (parentLink.data[0] < tempLink.data[0]) {
        tempLink.data[0] -= SPEED_MAG;
      }
    }
    parentLink.next = tempLink;
    tempLink = tempLink.parent;
  }

  headLink = tempLink;
  snakeBody.head = headLink;
}

function checkSnakePosition() {
  var snakeMinX = snakeBody.head.data[0];
  var snakeMaxX = snakeBody.head.data[0] + SNAKE_WIDTH;
  var snakeMinY = snakeBody.head.data[1];
  var snakeMaxY = snakeBody.head.data[1] + SNAKE_WIDTH;
  var appleMinX = applePosX;
  var appleMaxX = applePosX + 10;
  var appleMinY = applePosY;
  var appleMaxY = applePosY + 10;

  // Check for collision with wall
  if (
    snakeBody.head.data[0] < 0 ||
    snakeBody.head.data[1] < 0 ||
    snakeBody.head.data[0] > canvas.width - SNAKE_WIDTH ||
    snakeBody.head.data[1] > canvas.height - SNAKE_WIDTH
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
  showGameOverScreen = true;
  snakeBody.head.data[0] = 0;
  snakeBody.head.data[1] = 10;
  snakeBody.head.next = null;
  snakeSpeedX = SPEED_MAG;
  snakeSpeedY = 0;
  applePosX = randomInt(canvas.width - 11);
  applePosY = randomInt(canvas.height - 11);
}

function addApple() {
  applePosX = randomInt(canvas.width - 11);
  applePosY = randomInt(canvas.height - 11);
  var oldHeadLink = headLink;

  var newLink = new ListNode([
    oldHeadLink.data[0] + (snakeSpeedX / SPEED_MAG) * SNAKE_WIDTH,
    oldHeadLink.data[1] + (snakeSpeedX / SPEED_MAG) * SNAKE_WIDTH,
  ]);

  oldHeadLink.parent = newLink;
  newLink.next = oldHeadLink;
  headLink = newLink;
  snakeBody = new LinkedList(headLink);
  // console.log(snakeBody);
  snakeLength++;
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
