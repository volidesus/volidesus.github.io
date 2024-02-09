const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

/* Initialize Variables
====================================================================================================
==================================================================================================== */

const song = new Audio('./soundOrSong/tetrisSong.mp3');
const gameOver = new Audio('./soundOrSong/game_over.wav');
const moveBlock = new Audio('./soundOrSong/move_piece.wav');
const blockRotate = new Audio('./soundOrSong/rotate_piece.wav');
const blockLanded = new Audio('./soundOrSong/piece_landed.wav');
const tetris = new Audio('./soundOrSong/tetris_4_lines.wav');

const loadImage = (src) => { const image = new Image(); image.src = src; return image };
const tileShading = loadImage('./imageOrIcon/tetrisTexture.png');
const tetrisBlocks = loadImage('./imageOrIcon/tileBlocks.png');
const tetrisBG = loadImage('./imageOrIcon/tetrisBG.png');
const blockLocations = [
  {'X':708,'Y':642,'width':461,'height':310},{'X':1323,'Y':247,'width':461,'height':310},
  {'X':1323,'Y':642,'width':310,'height':310},{'X':136,'Y':25,'width':463,'height':310},
  {'X':136,'Y':403,'width':463,'height':310},{'X':708,'Y':249,'width':462,'height':308},
  {'X':708,'Y':25,'width':615,'height':154}];

const blocks = [
  /* Block J */ {'X':[3,3,4,5],'Y':[0,1,1,1],'color':'1'},{'X':[4,4,4,3],'Y':[0,1,2,2],'color':'1'},
  {'X':[3,4,5,5],'Y':[0,0,0,1],'color':'1'},{'X':[5,4,4,4],'Y':[0,0,1,2],'color':'1'},
  /* Block L */ {'X':[5,3,4,5],'Y':[0,1,1,1],'color':'2'},{'X':[4,4,4,5],'Y':[0,1,2,2],'color':'2'},
  {'X':[4,5,6,4],'Y':[0,0,0,1],'color':'2'},{'X':[4,5,5,5],'Y':[0,0,1,2],'color':'2'},
  /* Block O */ {'X':[3,4,3,4],'Y':[0,0,1,1],'color':'3'},{'X':[3,4,3,4],'Y':[0,0,1,1],'color':'3'},
  {'X':[3,4,3,4],'Y':[0,0,1,1],'color':'3'},{'X':[3,4,3,4],'Y':[0,0,1,1],'color':'3'},
  /* Block S */ {'X':[3,4,4,5],'Y':[0,0,1,1],'color':'4'},{'X':[5,5,4,4],'Y':[0,1,1,2],'color':'4'},
  {'X':[3,4,4,5],'Y':[0,0,1,1],'color':'4'},{'X':[5,5,4,4],'Y':[0,1,1,2],'color':'4'},
  /* Block Z */ {'X':[5,4,4,3],'Y':[0,0,1,1],'color':'5'},{'X':[4,4,5,5],'Y':[0,1,1,2],'color':'5'},
  {'X':[5,4,4,3],'Y':[0,0,1,1],'color':'5'},{'X':[4,4,5,5],'Y':[0,1,1,2],'color':'5'},
  /* Block T */ {'X':[4,3,4,5],'Y':[0,1,1,1],'color':'6'},{'X':[4,4,5,4],'Y':[0,1,1,2],'color':'6'},
  {'X':[3,4,5,4],'Y':[0,0,0,1],'color':'6'},{'X':[4,4,3,4],'Y':[0,1,1,2],'color':'6'},
  /* Block I */{'X':[2,3,4,5],'Y':[0,0,0,0],'color':'7'},{'X':[4,4,4,4],'Y':[0,1,2,3],'color':'7'},
  {'X':[2,3,4,5],'Y':[0,0,0,0],'color':'7'},{'X':[4,4,4,4],'Y':[0,1,2,3],'color':'7'}];

let tiles = Array(20).fill('0000000000');
const tileColor = [
  ['#000', '#8ef8f9', '#1c57bc', '#fff', '#8ef8f9', '#1c57bc', '#fff', '#fff'],['#000', '#2ed106', '#08300f', '#fff', '#2ed106', '#08300f', '#fff', '#fff'],
  ['#000', '#e605ff', '#471835', '#fff', '#e605ff', '#471835', '#fff', '#fff'],['#000', '#2ed106', '#1c57bc', '#fff', '#2ed106', '#1c57bc', '#fff', '#fff'],
  ['#000', '#06d143', '#e605ff', '#fff', '#06d143', '#e605ff', '#fff', '#fff'],['#000', '#06d143', '#8ef8f9', '#fff', '#06d143', '#8ef8f9', '#fff', '#fff'],
  ['#000', '#7c7c7c', '#f98909', '#fff', '#7c7c7c', '#f98909', '#fff', '#fff'],['#000', '#a32f4e', '#1d071e', '#fff', '#a32f4e', '#1d071e', '#fff', '#fff'],
  ['#000', '#fc0505', '#1e94fc', '#fff', '#fc0505', '#1e94fc', '#fff', '#fff'],['#000', '#fcb02d', '#fc0505', '#fff', '#fcb02d', '#fc0505', '#fff', '#fff']];
let stats = {0:0,1:0,2:0,3:0,4:0,5:0,6:0}

let nextBlock = Math.floor(Math.random()*blockLocations.length);
let prevBlock = nextBlock;
let curRotation = 0;
let curBlock = null;

let level, droppingTime;
let lines = 0;
let dropping = false;
let points = 0;
let linesToPoints = [0,100,300,500,800]
let lastCombo = false;
let combo = 0;

let currentY = 0;
let currentX = 0;
let currentYs = [];
let currentXs = [];

/* Draw display
====================================================================================================
==================================================================================================== */

function drawStatsDisplay() {
  ctx.fillStyle="#989799";ctx.fillRect(75,251,220,430)
  ctx.fillStyle = '#C1FFFF'; ctx.fillRect(85, 261, 200, 410);
  ctx.fillStyle = '#000'; ctx.fillRect(90, 266, 190, 400);

  let divideAmount=2; while (true) {
    if(blockLocations[nextBlock]['height']/divideAmount<35) {break}
    else {divideAmount++};
  };
  
  ctx.fillStyle = '#fff'; ctx.font = '30px Atari'; 
  ctx.fillText('STATISTICS', 105, 300);
  for (let i = 0; i < 7; i++) {
    let divideAmount=2; while (true) {
      if(blockLocations[i]['height']/divideAmount<35 &&
      blockLocations[i]['width']/divideAmount<80) {break}
      else {divideAmount++};
    }; 

    ctx.fillStyle=tileColor[level%10][i+1];
    if (i===2){ctx.fillRect(110, i*50+330,blockLocations[i]['width']/divideAmount*0.66,
    blockLocations[i]['height']/divideAmount)};
    if (i===6){ctx.fillRect(110, i*50+330,blockLocations[i]['width']/divideAmount,
    blockLocations[i]['height']/divideAmount*0.5)};
    
    ctx.fillRect(110, i*50+330,blockLocations[i]['width']/divideAmount,
    blockLocations[i]['height']/divideAmount)
    
    ctx.drawImage(tetrisBlocks, blockLocations[i]['X'],blockLocations[i]['Y'],
    blockLocations[i]['width'],blockLocations[i]['height'], 110, i*50+330, 
    blockLocations[i]['width']/divideAmount+2,blockLocations[i]['height']/divideAmount+2)
    
    ctx.fillStyle = '#f00'; ctx.font = '33px Atari'; 
    ctx.fillText(String(stats[i]).padStart(3, '0'), 205, i*50+355);
  }
}

function drawLinesDisplay() {
  ctx.fillStyle="#989799";ctx.fillRect(305,55,290,70)
  ctx.fillStyle='#C1FFFF';ctx.fillRect(315,65,270,50)
  ctx.fillStyle='#000';ctx.fillRect(320,70,260,40)
  const formattedLines = String(lines).padStart(3, '0');
  ctx.fillStyle = '#fff'; ctx.font = '30px Atari'; ctx.fillText(`LINES = ${formattedLines}`, 330, 99);
}

function drawBlocksDisplay() {
  ctx.fillStyle='#989799';ctx.fillRect(305,135,290,540)
  ctx.fillStyle='#C1FFFF';ctx.fillRect(315,146,270,520)
  for (let row = 0; row < tiles.length; row++) {
    for (let column = 0; column < tiles[row].length; column++) {
      ctx.fillStyle = tileColor[level%10][tiles[row][column]];
      ctx.fillRect(column * 25+325, row * 25+156, 25, 25);
      ctx.drawImage(tileShading, column * 25+325, row * 25+156, 28, 28);
    }
  } 
}

function drawScoreDisplay() {
  ctx.fillStyle="#989799";ctx.fillRect(605,56,220,230)
  ctx.fillStyle = '#C1FFFF'; ctx.fillRect(615, 66, 200, 210);
  ctx.fillStyle = '#000'; ctx.fillRect(620, 71, 190, 200);

  ctx.fillStyle = '#fff'; ctx.font = '30px Atari'; ctx.fillText('TOP', 630, 104);
  const highScore = getHighScore(); const formattedHighScore = String(highScore).padStart(6, '0');
  ctx.fillText(formattedHighScore, 630, 138);

  ctx.fillText('SCORE', 630, 202);
  const formattedScore = String(points).padStart(6, '0');
  ctx.fillText(formattedScore, 630, 236)
}

function drawNextBlockDisplay() {
  let divideAmount=2; while (true) {
    if(blockLocations[nextBlock]['width']/divideAmount<130) {break}
    else {divideAmount+=0.01};
  };

  ctx.fillStyle="#989799";ctx.fillRect(605,325,220,220)
  ctx.fillStyle = '#C1FFFF'; ctx.fillRect(615, 335, 200, 200);
  ctx.fillStyle = '#000'; ctx.fillRect(620, 340, 190, 190);
  ctx.fillStyle = 'white'; ctx.font = '35px Atari'; ctx.fillText('NEXT', 680, 380);

  ctx.fillStyle=tileColor[level%10][nextBlock+1];
  ctx.fillRect(630,390,blockLocations[nextBlock]['width']/divideAmount,
  blockLocations[nextBlock]['height']/divideAmount)

  ctx.drawImage(tetrisBlocks,blockLocations[nextBlock]['X'],
  blockLocations[nextBlock]['Y'],blockLocations[nextBlock]['width'],
  blockLocations[nextBlock]['height'],
  
  630,390,blockLocations[nextBlock]['width']/divideAmount,
  blockLocations[nextBlock]['height']/divideAmount);
}

function drawLevelDisplay() {
  ctx.fillStyle="#989799";ctx.fillRect(605,555,140,90);
  ctx.fillStyle='#C1FFFF';ctx.fillRect(615,565,120,70);
  ctx.fillStyle='#000';ctx.fillRect(620,570,110,60);
  const formattedLevel = String(level).padStart(2, '0');
  ctx.fillStyle = '#fff'; ctx.font = '27px Atari'; ctx.fillText('LEVEL', 630, 593);
  ctx.fillStyle = '#fff'; ctx.font = '28px Atari'; ctx.fillText(formattedLevel, 660, 623);
}

function drawFrame() {
  level = Math.floor(lines/10);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(tetrisBG,-4,-4,canvas.width/3+8,canvas.height+8)
  ctx.drawImage(tetrisBG,296,-4,canvas.width/3+8,canvas.height+8)
  ctx.drawImage(tetrisBG,596,-4,canvas.width/3+8,canvas.height+8)

  ctx.fillStyle='#000';ctx.fillRect(65,241,240,450);
  ctx.fillRect(295,45,310,642);ctx.fillRect(595,45,240,250);
  ctx.fillRect(595,315,240,240); ctx.fillRect(595,555,160,100);
  drawStatsDisplay(); drawLinesDisplay(); drawBlocksDisplay();
  drawScoreDisplay(); drawNextBlockDisplay(); drawLevelDisplay();
  requestAnimationFrame(drawFrame);
} drawFrame(); createBlock();

function getHighScore() {
  const currentHighScore = Number(localStorage.getItem('highScore'));
  if (points > currentHighScore) {
    localStorage.setItem('highScore', String(points));
  } return localStorage.getItem('highScore');
}

/* Create and destroy blocks
====================================================================================================
==================================================================================================== */

function createBlock() {
  droppingTime = 0;
  curRotation = 0;
  curBlock = nextBlock;
  while (true) {
    const generatedBlock = Math.floor(Math.random()*blockLocations.length)
    if (generatedBlock!==prevBlock)
    {prevBlock=nextBlock;nextBlock=generatedBlock;break}
  } const color = blocks[curBlock*4+curRotation]['color'];
  for(let i = 0; i < 4; i++) {
    const x = blocks[curBlock*4+curRotation]['X'][i];
    const y = blocks[curBlock*4+curRotation]['Y'][i];
    tiles[y] = tiles[y].substring(0, x) + color + tiles[y].substring(x + 1);
  }
}

function clearLine() {
  let lineNumber = 0;
  for (let y = 0; y < tiles.length; y++) {
    let numberOfFilledLines = 0;
    for (let x = 0; x < tiles[0].length; x++) {
      if (tiles[y][x] !== '0') {
        numberOfFilledLines++;
      }
    }
    if (numberOfFilledLines >= tiles[0].length) {
      tiles.splice(y, 1);
      tiles.unshift('0000000000');
      lineNumber++;
    }
  } 
  
  if (lineNumber > 0) {
    lines += lineNumber;
    points += linesToPoints[lineNumber] * (level + 1);
    points += combo * 50 * (level + 1);
    if (lastCombo) {combo++};
    lastCombo = true;
    if (lineNumber === 4) {tetris.play()};
  } else {
    combo = 0;
    lastCombo = false;
  }
}

function calculatePlayerSpeed() {
  const initialSpeed = 0.01667;
  const growthRate = 0.16502

  const speed = initialSpeed * Math.pow(growthRate, level+1);
  const interval = 1000-1000*speed;
  return interval;
}

document.addEventListener('keydown', function (event) {
  if (event.key === 'a') moveBlockLeft();
  if (event.key === 'd') moveBlockRight();
  if (event.key === 'w') rotateBlock();
  if (event.key === 's') moveBlockDown();
});

setInterval(moveBlockDown, calculatePlayerSpeed());

/* Movement of blocks
====================================================================================================
==================================================================================================== */

function moveBlockDown() {
  const color = blocks[curBlock*4+curRotation]['color'];
  for (let i = 0; i < 4; i++) {
    currentYs[i] = blocks[curBlock*4+curRotation]['Y'][i] + currentY;
    currentXs[i] = blocks[curBlock*4+curRotation]['X'][i] + currentX;
  }
  currentY++;

  let canMove = true;
  for (let i = 0; i < 4; i++) {
    if (currentYs.includes(currentYs[i] + 1)) {continue;console.log('weeee')};
    if (currentYs[i] + 1 >= tiles.length || tiles[currentYs[i] + 1][currentXs[i]] !== '0') {
      canMove = false;
      break;
    }
  }

  if (canMove) {
    droppingTime++;
    for (let i = 0; i < 4; i++) {
      let y = currentYs[i];
      const x = currentXs[i];
      tiles[y] = tiles[y].substring(0, x) + '0' + tiles[y].substring(x + 1);
    }

    for (let i = 0; i < 4; i++) {
      let y = currentYs[i] + 1;
      const x = currentXs[i];
      tiles[y] = tiles[y].substring(0, x) + color + tiles[y].substring(x + 1);
      currentYs[i] = y;
    }
  } else {
    if(droppingTime===0){
      gameOver.play();
      setTimeout(function(){window.top.location.reload(true)},1000)
    } blockLanded.play();
    clearLine(); stats[curBlock]++; 
    dropping = false; currentY = 0; 
    currentX = 0;
    createBlock();
  }
}

function moveBlockLeft() {
  if (currentY===1) return;
  currentX--;
  const mostLeftTile = Math.min.apply(null, currentXs);
  for (let i = 0; i < 4; i++) {
    if (currentXs[i] !== mostLeftTile) continue;
    if (currentXs[i] - 1 < 0 ||
    tiles[currentYs[i]][currentXs[i] - 1] !== '0') {
      currentX++;
      return;
    }
  } 

  moveBlock.play();
  const color = blocks[curBlock*4+curRotation]['color'];
  for (let i = 0; i < 4; i++) {
    let x = currentXs[i];
    const y = currentYs[i];
    tiles[y] = tiles[y].substring(0, x) + '0' + tiles[y].substring(x + 1);
    x--;
    currentXs[i] = x;
  }

  for (let i = 0; i < 4; i++) {
    let x = currentXs[i];
    const y = currentYs[i];
    tiles[y] = tiles[y].substring(0, x) + color + tiles[y].substring(x + 1);
  }
}

function moveBlockRight() {
  if (currentY===0) return;
  currentX++;
  const mostRightTile = Math.max.apply(null, currentXs);
  for (let i = 0; i < 4; i++) {
    if (currentXs[i] !== mostRightTile) continue;
    if (currentXs[i] + 1 >= tiles[0].length || 
    tiles[currentYs[i]][currentXs[i] + 1] !== '0') {
      currentX--;
      return;
    }
  }

  moveBlock.play();
  const color = blocks[curBlock*4+curRotation]['color'];
  for (let i = 0; i < 4; i++) {
    let x = currentXs[i];
    const y = currentYs[i];
    tiles[y] = tiles[y].substring(0, x) + '0' + tiles[y].substring(x + 1);
    x++;
    currentXs[i] = x;
  }

  for (let i = 0; i < 4; i++) {
    let x = currentXs[i];
    const y = currentYs[i];
    tiles[y] = tiles[y].substring(0, x) + color + tiles[y].substring(x + 1);
  }
}

function rotateBlock() {
  blockRotate.play();
  curRotation = (curRotation + 1) % 4;

  const color = blocks[curBlock * 4 + curRotation]['color'];
  for (let i = 0; i < 4; i++) {
    const prevX = blocks[curBlock * 4 + ((curRotation + 3) % 4)]['X'][i] + currentX;
    const prevY = blocks[curBlock * 4 + ((curRotation + 3) % 4)]['Y'][i] + currentY;
    tiles[prevY] = tiles[prevY].substring(0, prevX) + '0' + tiles[prevY].substring(prevX + 1);
  }

  for (let i = 0; i < 4; i++) {
    const x = blocks[curBlock * 4 + curRotation]['X'][i] + currentX;
    const y = blocks[curBlock * 4 + curRotation]['Y'][i] + currentY;
    tiles[y] = tiles[y].substring(0, x) + color + tiles[y].substring(x + 1);
    currentXs[i] = x;
    currentYs[i] = y;
  }
}