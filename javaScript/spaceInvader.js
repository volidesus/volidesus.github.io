const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

// Load the images
const loadImage = (src) => {const image = new Image(); image.src = src; return image}
const player = loadImage('./imageOrIcon/laserCannon.png');
const muntz = loadImage('./imageOrIcon/muntz.png');
const wallDurOne = loadImage('./imageOrIcon/durabillityOne.png');
const wallDurTwo = loadImage('./imageOrIcon/durabillityTwo.png');
const wallDurThree = loadImage('./imageOrIcon/durabillityThree.png');

const invaderKilledImage = loadImage('./imageOrIcon/invaderkilled.png');
const russelClosed = loadImage('./imageOrIcon/russelClosed.png');
const russelOpen = loadImage('./imageOrIcon/russelOpen.png');
const dougClosed = loadImage('./imageOrIcon/dougClosed.png');
const dougOpen = loadImage('./imageOrIcon/dougOpen.png');
const carlClosed = loadImage('./imageOrIcon/carlClosed.png');
const carlOpen = loadImage('./imageOrIcon/carlOpen.png');

const enemyBullet1 = loadImage('./imageOrIcon/enemyBullet1.png');
const enemyBullet2 = loadImage('./imageOrIcon/enemyBullet2.png');

// Load the audios
const invaderShot = new Audio('./soundOrSong/invaderKilled.wav');
const playerShot = new Audio('./soundOrSong/playerShot.wav');
const playerShoot = new Audio('./soundOrSong/playerShoot.wav');

const ufoHighpitch = new Audio('./soundOrSong/ufoHighpitch.wav')
const ufoLowpitch = new Audio('./soundOrSong/ufoLowpitch.wav')

const fastInvader1 = new Audio('./soundOrSong/fastInvader1.wav')
const fastInvader2 = new Audio('./soundOrSong/fastInvader2.wav')
const fastInvader3 = new Audio('./soundOrSong/fastInvader3.wav')
const fastInvader4 = new Audio('./soundOrSong/fastInvader4.wav')

const translateBooleanToInt = { true: 1, false: 0 };
let x = canvas.width / 2;
let speedX = 0;
function action(key) {
  speedX += 0.9 * key;
  speedX *= 0.9;
  x += speedX;
  x = Math.max(0, Math.min(canvas.width - 30, x));
}

let laserCooldown = false;
let pressedKeys = { "a": false, "d": false };
document.addEventListener('keydown', function (event) {
  if (event.key in pressedKeys) {
    pressedKeys[event.key] = true;
  } else if (event.key == ' ' && laserCooldown == false) {
    const laser = new newBullet(x + 14, 750);
    playerShoot.play();
    lasers.push(laser);
    laserCooldown = true;
  }
});

document.addEventListener('keyup', function (event) {
  if (event.key in pressedKeys) {
    pressedKeys[event.key] = false;
  } else if (event.key == ' ') {
    laserCooldown = false;
  }
});

function newBullet(x, y) {
  this.x = x;
  this.y = y;
} let lasers = [];
let enemyBullets = [];

let points = 0;
const pointSystem = {0: 30, 1: 20, 2: 20, 3: 10, 4: 10}
function drawLaser(laser) {
  context.fillStyle = '#fff';
  context.fillRect(laser.x, laser.y, 3, 20);

  // Check for enemies
  for (let column = 0; column < 5; column++) {
    for (let row = 0; row < 12; row++) {
      const enemyIndex = column * 12 + row;
      if (enemies[enemyIndex]) {
        const enemyX = row * 50 + (50 + offsetX);
        const enemyY = column * 50 + 100;
        if (laser.x < enemyX + 45 && laser.x + 1.5 > enemyX && laser.y < enemyY + 95 + offsetY && laser.y + 70 + offsetY > enemyY ) {
          lasers = lasers.filter((b) => b !== laser);
          enemies[enemyIndex] = false;
          points += pointSystem[column];

          invaderKilledTime = 30;
          invaderKilledX = enemyX;
          invaderKilledY = enemyY + 50 + offsetY;
          return;
        };
      };
    };
  };

  // Check for Wall
  for (let wall = 0; wall < 4; wall++) {
    updateWallOnCollision(laser.x, laser.y, wall, 'laser', laser);
  }

  // Check for Muntz
  if (laser.x + 1.5 >= muntzX - 75 && laser.x <= muntzX && laser.y <= 120 && laser.y >= 75) {
    muntzX = 0;
    lasers = lasers.filter((b) => b !== laser);
    const muntzPoints = [50, 100, 150, 200, 300];
    points += muntzPoints[Math.floor(Math.random() * 5)];
  } laser.y -= 5;
};

function updateWallOnCollision(x, y, wallIndex, laserOrEnemyBullet, object) {
  const wallSize = 8;
  const wallRow = Math.floor((y - 620) / wallSize);
  const wallCol = Math.floor((x - (70 + wallIndex * 160)) / wallSize);
  if (individualWall[wallIndex][wallRow] && individualWall[wallIndex][wallRow][wallCol] === 'x') {
    individualWall[wallIndex][wallRow] = individualWall[wallIndex][wallRow].substring(0, wallCol) + ' ' + individualWall[wallIndex][wallRow].substring(wallCol + 1);
    if (laserOrEnemyBullet == 'laser') lasers = lasers.filter((b) => b !== object);
    else if (laserOrEnemyBullet == 'enemyBullet') enemyBullets = enemyBullets.filter((b) => b !== object);
  }
}

const enemyBulletFrames = [enemyBullet1, enemyBullet2]
function drawEnemyBullets() {
  context.fillStyle = '#fff';
  enemyBullets.forEach(enemyBullet => {
    context.drawImage(enemyBulletFrames[openOrClosed], enemyBullet.x, enemyBullet.y, 4, 20)

    // Check for Wall
    for (let wall = 0; wall < 4; wall++) {
      updateWallOnCollision(enemyBullet.x, enemyBullet.y, wall, 'enemyBullet', enemyBullet);
    }

    // Check for player
    if (enemyBullet.x + 3.5 < x + 30 && enemyBullet.x + 3.5 > x && enemyBullet.y > 770) {
      enemyBullets = enemyBullets.filter((b) => b !== enemyBullet);
      playerShot.play();
      lives -= 1;
    } enemyBullet.y += 5;
  });
};

// Create variables to calculate the sprites
const enemySprite = {1: carlClosed, 2:  carlOpen,
3: russelClosed, 4: russelOpen,
5: dougClosed, 6: dougOpen}
const columnConnection = {0: 1, 1: 2, 2: 2, 3: 3, 4: 3}
let openOrClosed = 0;
let enemyImage;

let invaderKilledX = 0;
let invaderKilledY = 0;
let invaderKilledTime = 0;
function drawInvaderKilled() {
  if (invaderKilledTime > 0) {
    context.drawImage(invaderKilledImage, invaderKilledX, invaderKilledY, 50, 30);
    invaderKilledTime -= 1;
  }
}

// Define method to draw the enemies
let offsetY = 0;
let offsetX = 0;
let offsetAmount = 5;
let enemies = [];
const possibleInvaderSounds = [fastInvader1, fastInvader2, fastInvader3, fastInvader4]
for (let i = 0; i < 60; i++) {
  enemies.push(true);
} function drawSpaceInvaders() {
  for (let column = 0; column < 5; column++) {
    for (let row = 0; row < 12; row++) {
      enemyImage = enemySprite[columnConnection[column] * 2 - openOrClosed]
      if (column * 50 + 130 + offsetY > 750) window.top.location.reload(true);
      if (enemies[column * 12 + row]) {
        context.drawImage(enemyImage, row * 50 + (50 + offsetX), column * 50 + 150 + offsetY, 40, 30);
        if (Math.random() * 1000 <= 1) {
          const enemyBullet = new newBullet(row * 50 + (77.5 + offsetX), column * 50 + 50);
          possibleInvaderSounds[Math.floor(Math.random()*4)].play();
          enemyBullets.push(enemyBullet);
        }
      }
    }
  } if (offsetAmount == 5 && offsetX == 40) {offsetAmount = -5; offsetY += 20}
  else if (offsetAmount == -5 && offsetX == -40) {offsetAmount = 5; offsetY += 20};
} let muntzX = 0;

// Define method to draw the walls
let wall1 = ['  xxxxxxx', ' xxxxxxxxx', 'xxxxxxxxxxx', 'xxxxxxxxxxx', 'xxxxxxxxxxx', 'xxx     xxx', 'xx       xx'];
let wall2 = ['  xxxxxxx', ' xxxxxxxxx', 'xxxxxxxxxxx', 'xxxxxxxxxxx', 'xxxxxxxxxxx', 'xxx     xxx', 'xx       xx'];
let wall3 = ['  xxxxxxx', ' xxxxxxxxx', 'xxxxxxxxxxx', 'xxxxxxxxxxx', 'xxxxxxxxxxx', 'xxx     xxx', 'xx       xx'];
let wall4 = ['  xxxxxxx', ' xxxxxxxxx', 'xxxxxxxxxxx', 'xxxxxxxxxxx', 'xxxxxxxxxxx', 'xxx     xxx', 'xx       xx'];
const individualWall = [wall1, wall2, wall3, wall4];

function drawWall() {
  const wallSize = 8;  // Adjust the size of each block
  const wallColor = '#41e063'; // Adjust the color
  for (let i = 0; i < 4; i++) {
    for (let row = 0; row < individualWall[i].length; row++) {
      for (let col = 0; col < individualWall[i][row].length; col++) {
        if (individualWall[i][row][col] === 'x') {
          const wallX = col * wallSize + 70 + i*160;
          const wallY = row * wallSize + 620;
          context.fillStyle = wallColor;
          context.fillRect(wallX, wallY, wallSize, wallSize);
        }
      }
    }
  }
}

let highScore = localStorage.getItem('highScore') || 0;
function updateHighScore() {
  if (points > highScore) {
    highScore = points;
    localStorage.setItem('highScore', highScore);
  }
}

let lives = 2;
function drawGUI() {
  context.font = '35px Atari';
  const formattedScore = String(points).padStart(4, '0');
  context.fillText('SCORE', 140, 50);
  context.fillText(formattedScore, 140, 90);

  const formattedHighScore = String(highScore).padStart(4, '0');
  context.fillText('HI-SCORE', 400, 50);
  context.fillText(formattedHighScore, 430, 90);

  context.fillStyle = '#41e063';
  context.fillRect(0, 800, 700, 3)

  context.fillText(lives+1, 50, 840);
  for (let i = 0; i < lives; i++) {
    context.drawImage(player, 110-i*-50, 843, 30, -30)
  } if (lives < 0) window.top.location.reload(true);
}

function checkWin() {
  let numberKilled = 0;
  for (let i = 0; i < 60; i++) {
    if (!enemies[i]) numberKilled++;
  } if (numberKilled == 60) handleWin();
};

function handleWin() {
  if (lives != 3) lives++;
  for (let i = 0; i < 60; i++) {
    enemies[i] = true
  } offsetY = 0;
  x = canvas.width / 2
  wall1 = ['  xxxxxxx', ' xxxxxxxxx', 'xxxxxxxxxxx', 'xxxxxxxxxxx', 'xxxxxxxxxxx', 'xxx     xxx', 'xx       xx'];
  wall2 = ['  xxxxxxx', ' xxxxxxxxx', 'xxxxxxxxxxx', 'xxxxxxxxxxx', 'xxxxxxxxxxx', 'xxx     xxx', 'xx       xx'];
  wall3 = ['  xxxxxxx', ' xxxxxxxxx', 'xxxxxxxxxxx', 'xxxxxxxxxxx', 'xxxxxxxxxxx', 'xxx     xxx', 'xx       xx'];
  wall4 = ['  xxxxxxx', ' xxxxxxxxx', 'xxxxxxxxxxx', 'xxxxxxxxxxx', 'xxxxxxxxxxx', 'xxx     xxx', 'xx       xx'];
}

const possibleMuntzSounds = [ufoHighpitch, ufoLowpitch]
let muntzSoundToPlay;
function updateCanvas() {
  action(translateBooleanToInt[pressedKeys["d"]] - translateBooleanToInt[pressedKeys["a"]]);
  context.clearRect(0, 0, canvas.width, canvas.height);

  drawWall();
  context.drawImage(player, x, 800, 30, -30);
  drawSpaceInvaders();
  drawInvaderKilled();

  context.drawImage(muntz, muntzX, 75, -75, 45);
  if (Math.random() * 2000 <= 1 && muntzX == 0) {
    muntzSoundToPlay = possibleMuntzSounds[Math.floor(Math.random()*2)];
    muntzX = 775;
  } if (muntzX !== 0) muntzSoundToPlay.play();

  updateHighScore();
  drawGUI();

  lasers = lasers.filter(laser => laser.y > 0);
  lasers.forEach(laser => drawLaser(laser));
  enemyBullets = enemyBullets.filter(enemyBullet => enemyBullet.y < canvas.height);
  drawEnemyBullets();
}

setInterval(function () {
  offsetX += offsetAmount;
  if (openOrClosed == 0) openOrClosed = 1;
  else if (openOrClosed == 1) openOrClosed = 0;
  if (muntzX !== 0) muntzX -= 10;
}, 500);
setInterval(updateCanvas, 1000 / 60);
setInterval(checkWin, 2000)