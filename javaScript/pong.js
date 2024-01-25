const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
let p1Y = canvas.height / 2 - 50;
let p2Y = canvas.height / 2 - 50;

let p1Point = 0
let p2Point = 0
let mode = '#PvP'

const random = Math.random();
let bDir = Math.random()*360;
let bX = canvas.width / 2;
let bY = canvas.height / 2;
let isStart = false;

let speedPlayer1 = 0;
let speedPlayer2 = 0;
const acceleration = 0.9;

const translateBooleanToInt = { true: 1, false: 0 };
function playerMovement(key, playerID) {
  const speedArray = [speedPlayer1, speedPlayer2];
  speedArray[playerID - 1] += acceleration * key;
  speedArray[playerID - 1] *= acceleration;

  if (playerID == 1) {
    speedPlayer1 = speedArray[playerID - 1];
    p1Y += speedPlayer1;
    p1Y = Math.max(0, Math.min(canvas.height - 50, p1Y));
  }
  if (playerID == 2) {
    speedPlayer2 = speedArray[playerID - 1];
    p2Y += speedPlayer2;
    p2Y = Math.max(0, Math.min(canvas.height - 50, p2Y));
  }
}

function drawFrame() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = 'white';
  if (!isStart) {context.font = '35px Atari';context.fillText('Click Any Button to Start', 110, 50)}
  else if (p1Point>=10) {context.font = '35px Atari';context.fillText('Player 1 Won', 215, 50)}
  else if (p2Point>=10) {context.font = '35px Atari';context.fillText('Player 2 Won', 215, 50)}
  else {context.font = '55px Atari';context.fillText(`${p1Point}:${p2Point}`, 295, 50)}

  context.fillStyle = 'white';
  context.beginPath();
  context.arc(bX, bY, 10, 0, 2 * Math.PI);
  context.closePath();
  context.fill();

  context.fillRect(0, p1Y, 10, 50);
  context.fillRect(canvas.width - 10, p2Y, 10, 50);

  context.fillRect(0, 0, canvas.width, 3);
  context.fillRect(canvas.width, canvas.height, -canvas.width, -3);
  requestAnimationFrame(drawFrame);
}

let lastHitTime = Date.now();
let ballSpeed = 4;

function updateBall() {
  const currentTime = Date.now();
  const timeDifference = currentTime - lastHitTime;
  const speedMultiplier = Math.max(1, timeDifference / 1750);

  const angleInRadians = (bDir * Math.PI) / 180;

  const nextX = bX + Math.cos(angleInRadians) * ballSpeed * speedMultiplier;
  const nextY = bY + Math.sin(angleInRadians) * ballSpeed * speedMultiplier;

  if ((nextX - 10 < 10 && nextY > p1Y && nextY < p1Y + 50) || (nextX + 10 > canvas.width - 10 && nextY > p2Y && nextY < p2Y + 50)) {
    const paddleY = nextX - 10 < 10 ? p1Y : p2Y;
    const distance = nextY - (paddleY + 25);
    const normalizedDistance = distance / 25;
    const bounceAngle = normalizedDistance * 45;
    bDir = nextX - 10 < 10 ? 180 - bDir + bounceAngle : 180 - bDir - bounceAngle;
    bX += Math.cos((bDir * Math.PI) / 180) * ballSpeed * speedMultiplier;
    bY += Math.sin((bDir * Math.PI) / 180) * ballSpeed * speedMultiplier;
    lastHitTime = currentTime;
  } else if (nextY - 10 < 0 || nextY + 10 > canvas.height) {
    bDir = -bDir;
    bY = nextY - 10 < 0 ? 10 : canvas.height - 10;
    lastHitTime = currentTime;
  } else if (nextX < -20 || nextX > canvas.width + 20) {
    if (nextX < -20) p2Point++;
    else p1Point++;
    bDir = Math.random() * 270;
    bX = canvas.width / 2;
    bY = canvas.height / 2;
    lastHitTime = currentTime;
  } else {
    bX = nextX;
    bY = nextY;
  }
}

const difficultySpeed = {'#PvE1':22,'#PvE2':12,'#PvE3':2}
function moveAI() {
  const paddleCenter = p2Y + 25;
  const distanceToCenter = (paddleCenter - bY)/difficultySpeed[mode];
  const speed = Math.min(Math.abs(distanceToCenter), 5) * Math.sign(distanceToCenter);
  speedPlayer2 = -speed;
  p2Y += speedPlayer2;
}

let pressedKeys = { ArrowUp: false, ArrowDown: false, w: false, s: false };
document.addEventListener('keydown', function (event) {
  if (!isStart) isStart = true;
  pressedKeys[event.key] = true;
}); document.addEventListener('keyup', function (event) {
  pressedKeys[event.key] = false;
}); window.onhashchange = function () {
  mode = window.location.hash;
};

setInterval(function(){
  playerMovement(translateBooleanToInt[pressedKeys.s] - translateBooleanToInt[pressedKeys.w], 1);
  if (mode === '#PvP') playerMovement(translateBooleanToInt[pressedKeys.ArrowDown] - translateBooleanToInt[pressedKeys.ArrowUp], 2);
  if (mode !== '#PvP') moveAI();
  if (isStart) updateBall();
}, 16);

drawFrame();
