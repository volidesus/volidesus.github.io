const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
let pX = canvas.width / 2 - 50;
let bY = canvas.height - 18;
let bX = canvas.width / 2;
let isStart = false;

let tiles = [
  'xxxxxxxxxxxxxx', 'xxxxxxxxxxxxxx',
  'xxxxxxxxxxxxxx', 'xxxxxxxxxxxxxx',
  'xxxxxxxxxxxxxx', 'xxxxxxxxxxxxxx',
  'xxxxxxxxxxxxxx', 'xxxxxxxxxxxxxx'
];


const highBounce = new Audio('./soundOrSong/paddle.m4a');
const midBounce = new Audio('./soundOrSong/wall.m4a');
const lowBounce = new Audio('./soundOrSong/brick.m4a');

let speedPlayer = 0;
const acceleration = 0.9;
const translateBooleanToInt = { true: 1, false: 0 };

function playerMovement(key) {
  speedPlayer += acceleration * key;
  speedPlayer *= acceleration;

  pX += speedPlayer;
  pX = Math.max(0, Math.min(canvas.width - 100, pX));
}

let ballSpeedX = Math.random() > 0.5 ? -2.5 : 2.5;
let ballSpeedY = -2.5;

function updateBall() {
  const nextX = bX + ballSpeedX;
  const nextY = bY + ballSpeedY;

  if (nextX - 8 < 0 || nextX + 8 > canvas.width) {
    midBounce.play();
    ballSpeedX = -ballSpeedX;
  }
  if (nextY - 8 < 0) {
    midBounce.play();
    ballSpeedY = -ballSpeedY;
  }

  if (nextY + 8 > canvas.height - 10 && nextX >= pX && nextX <= pX + 100) {
    highBounce.play();
    const collidePoint = nextX - (pX + 50);
    const normalizedCollidePoint = collidePoint / 50;
    const bounceAngle = normalizedCollidePoint * Math.PI / 3;
    const speedMagnitude = Math.sqrt(ballSpeedX * ballSpeedX + ballSpeedY * ballSpeedY);
    ballSpeedX = speedMagnitude * Math.sin(bounceAngle);
    ballSpeedY = -speedMagnitude * Math.cos(bounceAngle);
  }

  const tileWidth = 50;
  const tileHeight = 30;
  const numRows = tiles.length;
  const numCols = tiles[0].length;

  const ballLeft = nextX - 8;
  const ballRight = nextX + 8;
  const ballTop = nextY - 8;
  const ballBottom = nextY + 8;

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (tiles[row][col] === 'x') {
        const tileLeft = col * tileWidth + 1;
        const tileRight = tileLeft + tileWidth + 1;
        const tileTop = row * tileHeight + 100;
        const tileBottom = tileTop + tileHeight;

        if (
          ballBottom >= tileTop &&
          ballTop <= tileBottom &&
          ballRight >= tileLeft &&
          ballLeft <= tileRight
        ) {
          lowBounce.play();
          tiles[row] = tiles[row].substring(0, col) + ' ' + tiles[row].substring(col + 1);
        
          const tileCenterX = tileLeft + tileWidth / 2;
          const tileCenterY = tileTop + tileHeight / 2;
          const distanceFromCenterX = nextX - tileCenterX;
          const distanceFromCenterY = nextY - tileCenterY;
        
          if (Math.abs(distanceFromCenterX) > Math.abs(distanceFromCenterY)) {
            ballSpeedX = -ballSpeedX;
          } else {
            ballSpeedY = -ballSpeedY;
          } break;
        }        
      }
    }
  }

  bX += ballSpeedX;
  bY += ballSpeedY;

  if (bY - 8 > canvas.height) {
    window.top.location.reload(true);
  } let remainingTiles = 0;
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (tiles[row][col] === 'x') remainingTiles++}
  } if (remainingTiles === 0) {
    alert('You Won!');
    window.top.location.reload(true);
  }
}

const colColor = { 0: 'red', 1: 'red', 2: 'orange', 3: 'orange', 4: 'green', 5: 'green', 6: 'yellow', 7: 'yellow' };

function drawTiles() {
  for (let tilesY = 0; tilesY < 8; tilesY++) {
    for (let tilesX = 0; tilesX < 14; tilesX++) {
      if (tiles[tilesY][tilesX] == 'x') {
        context.fillStyle = colColor[tilesY];
        context.fillRect(tilesX * 50 + 1, tilesY * 30 + 100, 45, 18);
      }
    }
  }
}

function drawFrame() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = 'red'; context.fillRect(0, 100, canvas.width, 60);
  context.fillStyle = 'orange'; context.fillRect(0, 160, canvas.width, 60);
  context.fillStyle = 'green'; context.fillRect(0, 220, canvas.width, 60);
  context.fillStyle = 'yellow'; context.fillRect(0, 280, canvas.width, 60);
  context.fillStyle = 'black'; context.fillRect(5, 5, canvas.width - 10, canvas.height - 5);

  drawTiles();
  context.fillStyle = 'white';
  if (!isStart) {
    context.font = '35px Atari';
    context.fillText('Click Any Button to Start', 110, 55);
  }

  context.beginPath();
  context.arc(bX, bY, 8, 0, 2 * Math.PI);
  context.closePath();
  context.fill();

  context.fillRect(pX, canvas.height, 100, -10);
  requestAnimationFrame(drawFrame);
}
drawFrame();

let pressedKeys = { ArrowLeft: false, ArrowRight: false };
document.addEventListener('keydown', function (event) {
  if (!isStart) isStart = true;
  pressedKeys[event.key] = true;
});
document.addEventListener('keyup', function (event) {
  pressedKeys[event.key] = false;
});

setInterval(function () {
  playerMovement(translateBooleanToInt[pressedKeys.ArrowRight] - translateBooleanToInt[pressedKeys.ArrowLeft], 1);
  if (isStart) updateBall();
}, 16);
