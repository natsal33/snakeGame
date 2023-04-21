const GameBoard = (function () {
  return {
    colorRect: function (leftX, topY, width, height, drawColor, canvasContext) {
      canvasContext.fillStyle = drawColor;
      canvasContext.fillRect(leftX, topY, width, height);
    },
    drawBoard: function (
      canvas,
      showGameOverScreen,
      applePosX,
      applePosY,
      APPLE_SIZE
    ) {
      const canvasContext = canvas.getContext("2d");
      // Create background
      GameBoard.colorRect(
        0,
        0,
        canvas.width,
        canvas.height,
        "pink",
        canvasContext
      );
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
      GameBoard.colorRect(
        apple.posX,
        apple.posY,
        apple.size,
        apple.size,
        "red",
        canvasContext
      );
    },
  };
})();
