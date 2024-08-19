const canvas = document.getElementById('game'), ctx = canvas.getContext('2d');
const blocks = [
  [[3,3,4,5],[0,1,1,1]], [[4,4,4,3],[0,1,2,2]], [[3,4,5,5],[0,0,0,1]], [[5,4,4,4],[0,0,1,2]],
  [[5,3,4,5],[0,1,1,1]], [[4,4,4,5],[0,1,2,2]], [[4,5,6,4],[0,0,0,1]], [[4,5,5,5],[0,0,1,2]],
  [[3,4,3,4],[0,0,1,1]], [[3,4,3,4],[0,0,1,1]], [[3,4,3,4],[0,0,1,1]], [[3,4,3,4],[0,0,1,1]],
  [[3,4,4,5],[0,0,1,1]], [[5,5,4,4],[0,1,1,2]], [[3,4,4,5],[0,0,1,1]], [[5,5,4,4],[0,1,1,2]],
  [[5,4,4,3],[0,0,1,1]], [[4,4,5,5],[0,1,1,2]], [[5,4,4,3],[0,0,1,1]], [[4,4,5,5],[0,1,1,2]],
  [[4,3,4,5],[0,1,1,1]], [[4,4,5,4],[0,1,1,2]], [[3,4,5,4],[0,0,0,1]], [[4,4,3,4],[0,1,1,2]],
  [[2,3,4,5],[0,0,0,0]], [[4,4,4,4],[0,1,2,3]], [[2,3,4,5],[0,0,0,0]], [[4,4,4,4],[0,1,2,3]]
];

const sounds = {
  gameOver: new Audio('./soundOrSong/game_over.wav'),
  moveBlock: new Audio('./soundOrSong/move_piece.wav'),
  blockRotate: new Audio('./soundOrSong/rotate_piece.wav'),
  blockLanded: new Audio('./soundOrSong/piece_landed.wav'),
  tetris: new Audio('./soundOrSong/tetris_4_lines.wav')
};

let stats = Array(7).fill(0), dynamicTiles = Array(20).fill('0000000000'), staticTiles = Array(20).fill('0000000000');
let nextBlock = Math.floor(Math.random() * blocks.length / 4), prevBlock = nextBlock, currentX, currentY, curRotation = 0, curBlock = null;
let points = 0, lines = 0;

function updateFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawStatsDisplay(); drawLinesDisplay(); drawCurBlocksDisplay(); drawPointsDisplay(); drawNextBlocksDisplay();
  requestAnimationFrame(updateFrame);
}

function drawStatsDisplay() {
  ctx.strokeStyle = '#FFF'; ctx.lineWidth = 4; ctx.strokeRect(0, 200, 190, 350);
  ctx.fillStyle = '#fff'; ctx.font = '30px Atari'; ctx.fillText("STATISTICS", 20, 245);
  for (let i1 = 0; i1 < blocks.length / 4; i1++) {
    blocks[i1 * 4][0].forEach((x, i2) => ctx.fillRect(x * 12 - 10, blocks[i1 * 4][1][i2] * 12 + i1 * 38 + 270, 12, 12));
    ctx.fillText(String(stats[i1]).padStart(3, '0'), 120, i1 * 38 + 290);
  }
}

function drawLinesDisplay() {
  ctx.strokeStyle = '#FFF'; ctx.lineWidth = 4; ctx.strokeRect(190, 0, 250, 50);
  ctx.fillStyle = '#fff'; ctx.font = '30px Atari'; ctx.fillText("LINES = " + lines, 210, 35);
}

function drawCurBlocksDisplay() {
  ctx.strokeStyle = '#FFF'; ctx.lineWidth = 4; ctx.strokeRect(190, 50, 250, 500);
  [dynamicTiles, staticTiles].forEach(tiles => {
    ctx.fillStyle = '#FFF'; tiles.forEach((row, r) => row.split('').forEach((col, c) => { if (col === '1') ctx.fillRect(c * 25 + 190, r * 25 + 50, 25, 25); }));
  });
}

function drawPointsDisplay() {
  ctx.strokeStyle = ctx.fillStyle = '#FFF'; ctx.lineWidth = 4; ctx.strokeRect(440, 0, 175, 210);
  ctx.fillStyle = '#fff'; ctx.font = '30px Atari'; ctx.fillText("TOP", 455, 50); 
  ctx.fillText(String(getHighScore()), 455, 80);
  ctx.fillText("SCORE", 455, 130); ctx.fillText(String(points).padStart(6, '0'), 455, 165);
}

function drawNextBlocksDisplay() {
  ctx.strokeStyle = ctx.fillStyle = '#FFF'; ctx.lineWidth = 4; ctx.strokeRect(440, 250, 130, 150);
  ctx.fillStyle = '#fff'; ctx.font = '30px Atari'; ctx.fillText("NEXT", 455, 295);
  const xpadding = (nextBlock == 6 || nextBlock == 2) ? 405 : 390;
  blocks[nextBlock * 4][0].forEach((x, i) => ctx.fillRect(x * 25 + xpadding, blocks[nextBlock * 4][1][i] * 25 + 320, 25, 25));
}

function getHighScore() {
  let highScore = localStorage.getItem('tetrisHighScore') || '000000';
  if (points > +highScore) localStorage.setItem('tetrisHighScore', highScore = String(points).padStart(6, '0'));
  return highScore;
}

function handleKeyDown(event) {
  const actions = {
    'w': rotateBlock, 'ArrowUp': rotateBlock,
    's': moveBlockDown, 'ArrowDown': moveBlockDown,
    'a': () => moveBlockSideways('left'), 'ArrowLeft': () => moveBlockSideways('left'),
    'd': () => moveBlockSideways('right'), 'ArrowRight': () => moveBlockSideways('right')
  };
  if (actions[event.key]) actions[event.key]();
}

function createBlock() {
  curRotation = currentX = currentY = 0; curBlock = nextBlock;
  while ((nextBlock = Math.floor(Math.random() * blocks.length / 4)) === prevBlock);
  prevBlock = nextBlock;
  blocks[curBlock * 4 + curRotation][0].forEach((x, i) => {
    dynamicTiles[blocks[curBlock * 4 + curRotation][1][i]] = dynamicTiles[blocks[curBlock * 4 + curRotation][1][i]].substring(0, x) + '1' + dynamicTiles[blocks[curBlock * 4 + curRotation][1][i]].substring(x + 1);
  });
}

function rotateBlock() {
  sounds.blockRotate.play();
  let nextRotation = (curRotation + 1) % 4, nextTiles = Array(20).fill('0000000000');
  for (let i = 0; i < 4; i++) {
    const x = blocks[curBlock * 4 + nextRotation][0][i] + currentX, y = blocks[curBlock * 4 + nextRotation][1][i] + currentY;
    if (y >= 20 || x >= 10 || x < 0 || staticTiles[y][x] === '1') return;
  }
  curRotation = nextRotation;
  blocks[curBlock * 4 + curRotation][0].forEach((x, i) => {
    const y = blocks[curBlock * 4 + curRotation][1][i] + currentY;
    nextTiles[y] = nextTiles[y].substring(0, x) + '1' + nextTiles[y].substring(x + 1);
  });
  dynamicTiles = nextTiles;
}

function moveBlockDown() {
  let nextTiles = [...dynamicTiles];
  for (let r = 19; r >= 0; r--) {
    for (let c = 0; c < 10; c++) {
      if (dynamicTiles[r][c] === '1') {
        if (r === 19 || staticTiles[r + 1][c] === '1') {
          stats[curBlock]++; pieceLand(); 
          if (String(staticTiles[0]).includes('1')) {
            sounds.gameOver.play();
            sounds.gameOver.onended = () => {
              location.reload();
            };
            return;
          }
          createBlock();
          return;
        }
        nextTiles[r] = nextTiles[r].substring(0, c) + '0' + nextTiles[r].substring(c + 1);
        nextTiles[r + 1] = nextTiles[r + 1].substring(0, c) + '1' + nextTiles[r + 1].substring(c + 1);
      }
    }
  }
  dynamicTiles = nextTiles; currentY++;
}

function moveBlockSideways(dir) {
  sounds.moveBlock.play();
  const offset = dir === 'left' ? -1 : 1; currentX += offset;
  for (let r = 0; r < 20; r++) {
    for (let c = 0; c < 10; c++) {
      if (dynamicTiles[r][c] === '1' && (c + offset < 0 || c + offset >= 10 || staticTiles[r][c + offset] === '1')) {
        currentX -= offset; return;
      }
    }
  }
  let nextTiles = Array(20).fill('0000000000');
  dynamicTiles.forEach((row, r) => row.split('').forEach((col, c) => {
    if (col === '1') nextTiles[r] = nextTiles[r].substring(0, c + offset) + '1' + nextTiles[r].substring(c + offset + 1);
  }));
  dynamicTiles = nextTiles;
}

function pieceLand() {
  sounds.blockLanded.play();
  dynamicTiles.forEach((row, r) => row.split('').forEach((col, c) => {
    if (col === '1') {
      staticTiles[r] = staticTiles[r].substring(0, c) + '1' + staticTiles[r].substring(c + 1);
      dynamicTiles[r] = dynamicTiles[r].substring(0, c) + '0' + dynamicTiles[r].substring(c + 1);
    }
  }));
}

function clearLine() {
  let linesCleared = 0;
  staticTiles = staticTiles.filter(row => !/^[^0]+$/.test(row) ? true : (linesCleared++, false));
  while (staticTiles.length < 20) staticTiles.unshift('0000000000');
  if (linesCleared == 4) sounds.tetris.play();
  points += [0, 100, 300, 500, 800][linesCleared] || 0; lines += linesCleared;
}

createBlock();
setInterval(() => { moveBlockDown(); clearLine(); }, 500);
document.addEventListener('keydown', handleKeyDown);
updateFrame();