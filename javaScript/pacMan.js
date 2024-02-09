const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const tileSize = 20;
let tiles = ['xxxxxxxxxxxxxxxxxxxxxxxxxxxx','xooooooooooooxxoooooooooooox',
'xoxxxxoxxxxxoxxoxxxxxoxxxxox','xOxxxxoxxxxxoxxoxxxxxoxxxxOx','xoxxxxoxxxxxoxxoxxxxxoxxxxox',
'xoooooooooooooooooooooooooox','xoxxxxoxxoxxxxxxxxoxxoxxxxox','xoxxxxoxxoxxxxxxxxoxxoxxxxox',
'xooooooxxooooxxooooxxoooooox','xxxxxxoxxxxx xx xxxxxoxxxxxx','xxxxxxoxxxxx xx xxxxxoxxxxxx',
'xxxxxxoxx          xxoxxxxxx','xxxxxxoxx xxxxxxxx xxoxxxxxx','xxxxxxoxx x      x xxoxxxxxx',
'      o   x      x   o      ','xxxxxxoxx x      x xxoxxxxxx','xxxxxxoxx xxxxxxxx xxoxxxxxx',
'xxxxxxoxx          xxoxxxxxx','xxxxxxoxx xxxxxxxx xxoxxxxxx','xxxxxxoxx xxxxxxxx xxoxxxxxx',
'xooooooooooooxxoooooooooooox','xoxxxxoxxxxxoxxoxxxxxoxxxxox','xoxxxxoxxxxxoxxoxxxxxoxxxxox',
'xOooxxoooooooo oooooooxxooOx','xxxoxxoxxoxxxxxxxxoxxoxxoxxx','xxxoxxoxxoxxxxxxxxoxxoxxoxxx',
'xooooooxxooooxxooooxxoooooox','xoxxxxxxxxxxoxxoxxxxxxxxxxox','xoxxxxxxxxxxoxxoxxxxxxxxxxox',
'xoooooooooooooooooooooooooox','xxxxxxxxxxxxxxxxxxxxxxxxxxxx'];
let ghostPositionX = [13,11.5,13.5,15.5];
let ghostPositionY = [11,13.5,14.5,13.5];
let ghostReleased = [true,false,false,false];
let ghostSprite = [3,1,1,1];
let ghostState = 1;

let ghostIsScared = [false,false,false,false];
let ghostScaredTimer= 0;

canvas.width = tiles[0].length * tileSize;
canvas.height = tiles.length * tileSize+200;

const loadImage = (src) => { const image = new Image(); image.src = src; return image };
const mapImage = loadImage('./imageOrIcon/pacmanMap.jpeg');
const ghosts = loadImage('./imageOrIcon/spritesGhosts.png');
const readyText = loadImage('./imageOrIcon/readyText.png');
const gui = loadImage('./imageOrIcon/spritesGUI.png');

let x = 290;
let y = 470;
let direction = -89;
const playerSize = 15;
let waitForMovement = 4;

const checkY = (variable) => (variable === 0) ? 1 : (variable === 180) ? -1 : 0;
const checkX = (variable) => (variable === 90) ? 1 : (variable === -90) ? -1 : 0;
const checkFront = () => (direction === 90) ? tiles[row][column + 1] !== 'x' : (direction === -90) ? tiles[row][column - 1] !== 'x' : 
(direction === 0) ? tiles[row + 1][column] !== 'x' : (direction === 180) ? tiles[row - 1][column] !== 'x' : false;

let playerFrame = 0
const playerFrameToSize = [45,75,89]
function drawPlayer() {
  context.fillStyle = 'yellow';
  context.beginPath();
  context.moveTo(x, y+100);
  context.arc(x, y+100, playerSize, (Math.PI / 180) * (-direction + 180-playerFrameToSize[playerFrame]), (Math.PI / 180) * (-direction + playerFrameToSize[playerFrame]));
  context.lineTo(x, y+100);
  context.closePath();
  context.fill();
}

let ghostsFrame = 0;
function drawGhosts() {
  for (let ghostID = 0; ghostID < 4; ghostID++) {
    if (ghostIsScared[ghostID]) {
      if (ghostScaredTimer>=2) {
        context.drawImage(ghosts, ghostsFrame * 20, 80, 14, 14, 
        ghostPositionX[ghostID] * tileSize, ghostPositionY[ghostID] * tileSize+100, 25, 25)
      } else {
        context.drawImage(ghosts, ghostsFrame * 60, 80, 14, 14, 
        ghostPositionX[ghostID] * tileSize, ghostPositionY[ghostID] * tileSize+100, 25, 25)
      }
    } else {
    context.drawImage(ghosts, (ghostSprite[ghostID] * 2-ghostsFrame-1) * 20, ghostID * 20, 14, 14, 
    ghostPositionX[ghostID] * tileSize, ghostPositionY[ghostID] * tileSize+100, 25, 25)}
  }
} 

let points = 0;
function drawOrb() {
  for (let row = 0; row < tiles.length; row++) {
    for (let col = 0; col < tiles[row].length; col++) {
      if (tiles[row][col] === 'o'||tiles[row][col] === 'O') {
        context.beginPath();
        context.fillStyle = 'yellow';
        if(tiles[row][col]==='o'){context.arc(col * tileSize + tileSize / 2, row * tileSize + tileSize / 2+100, 2, 0, 2 * Math.PI)};
        if(tiles[row][col]==='O'){context.arc(col * tileSize + tileSize / 2, row * tileSize + tileSize / 2+100, 8, 0, 2 * Math.PI)};
        context.closePath();
        context.fill();

        if (row === Math.floor(y / tileSize) && col === Math.floor(x / tileSize)) {
          if (tiles[Math.floor(y / tileSize)][Math.floor(x / tileSize)]==='o') {points += 10};
          if (tiles[Math.floor(y / tileSize)][Math.floor(x / tileSize)]==='O') {points += 50;
            ghostScaredTimer = 9;
            for (let ghostID = 0; ghostID < 4; ghostID++) {
              ghostIsScared[ghostID] = true}
          }; tiles[row] = tiles[row].substring(0, col) + ' ' + tiles[row].substring(col + 1);
        }
      }
    }
  }
}

let lives = 3;
function drawGUI() {
  context.font = '35px Atari';
  context.fillStyle = 'white'
  context.fillText('POINTS', 35, 34);
  context.fillText(String(points).padStart(4, '0'), 35, 84);

  for (let guiPacman = 0; guiPacman < lives; guiPacman++)
  {context.drawImage(gui,322,62,52,52,35+(50*guiPacman),730,35,35)};
}

/*START OF GHOST CODE
====================================================================================================
====================================================================================================*/

const scatterTargetsX = [1,26,26,1]
const scatterTargetsY = [1,1,29,29]
function updateGhostsPosition() {
  const sprites = [4, 3, 2, 1];
  for (let ghostID = 0; ghostID < 4; ghostID++) {
    if (ghostPositionY[ghostID] == 13.5 || ghostPositionY[ghostID] == 14.5) {
      ghostPositionY[ghostID] = (ghostPositionY[ghostID] == 13.5) ? 14.5 : 13.5;
      ghostSprite[ghostID] = (ghostPositionY[ghostID] == 13.5) ? 1 : 2;
    } else {
      let path = findPath(ghostPositionX[ghostID], ghostPositionY[ghostID], setTarget(ghostID, 'x'), setTarget(ghostID, 'y'));
      for (let otherGhostID = 0; otherGhostID < 4; otherGhostID++) {
        if (otherGhostID !== ghostID && ghostPositionX[ghostID] === ghostPositionX[otherGhostID] && ghostPositionY[ghostID] === ghostPositionY[otherGhostID]) {
          const newX = ghostPositionX[ghostID] - checkX(direction);
          const newY = ghostPositionY[ghostID] - checkY(direction);
          if (isValidTile(newX, newY)) {
            ghostPositionX[ghostID] = newX;
            ghostPositionY[ghostID] = newY;
          }
        }
      }

      if (path.length > 1) {
        let oppositeDirection = 3;
        if (ghostSprite[ghostID]==1) {oppositeDirection=2}
        else if (ghostSprite[ghostID]==2) {oppositeDirection=1}
        else if (ghostSprite[ghostID]==3) {oppositeDirection=4}

        ghostSprite[ghostID] = sprites[getDirection(ghostPositionX[ghostID], ghostPositionY[ghostID], path[1].x, path[1].y)];
        if (!ghostIsScared[ghostID]) {
          if (path[1].x==Math.floor(x / tileSize)&&path[1].y==Math.floor(y / tileSize) || ghostPositionX[ghostID]==Math.floor(x / tileSize)&&ghostPositionY[ghostID]==Math.floor(y / tileSize)) {
            if(lives<=0){window.top.location.reload(true)}; playerDeath()
          }
        } else {
          if (path[1].x==Math.floor(x / tileSize)&&path[1].y==Math.floor(y / tileSize) || ghostPositionX[ghostID]==Math.floor(x / tileSize)&&ghostPositionY[ghostID]==Math.floor(y / tileSize)) {
            points += 100
          }
        }
        
        ghostPositionX[ghostID] = path[1].x;
        ghostPositionY[ghostID] = path[1].y;
      }
    }
  }
}

function setTarget(ghostID,findWhich) {
  if (ghostIsScared[ghostID]){

  } else if (updateGhostState()=='chase') {
    let targetX, targetY;
    targetX = Math.floor(x / tileSize);
    targetY = Math.floor(y / tileSize);
    if (ghostID === 1) {
      targetX = Math.floor(x / tileSize) + checkX(direction) * 2;
      targetY = Math.floor(y / tileSize) + checkY(direction) * 2;
    } else if (ghostID === 2) {
      targetX = Math.floor(x / tileSize) + checkX(direction) * 4;
      targetY = Math.floor(y / tileSize) + checkY(direction) * 4;
    } else if (ghostID === 3 && (ghostPositionX[ghostID]-Math.floor(x / tileSize))+(ghostPositionY[ghostID]-Math.floor(y / tileSize)) <= 8) {
      targetX = scatterTargetsX[3];
      targetY = scatterTargetsY[3];
    }

    if (!isValidTile(targetX,targetY)) {
      let moveInstance = 1;
      let dir = -90;
      while (true) {
        if (isValidTile(targetX+checkX(dir)*moveInstance,targetY+checkY(dir)*moveInstance)) {
          targetX+=checkX(dir)*moveInstance;
          targetY+=checkY(dir)*moveInstance; break
        } else if (dir == 180) {dir = -180;moveInstance++}
        dir += 90;
      }
    }

    if (findWhich=='x') return targetX;
    if (findWhich=='y') return targetY;
  } else if (updateGhostState()=='scatter') {
    if (findWhich=='x') return scatterTargetsX[ghostID];
    if (findWhich=='y') return scatterTargetsY[ghostID];
  }
}

const ghostStates = [0,7,20,7,20,5,20,5]
function updateGhostState() {
  let states = 0;
  let statesIndex = 0;
  while (states < ghostState) {
    states += ghostStates[statesIndex]; statesIndex++;
  } return Number.isInteger(statesIndex / 2) ? 'scatter' : 'chase';
}

function getDirection(fromX, fromY, toX, toY, currentDirection) {
  const dx = toX - fromX;
  const dy = toY - fromY;

  const validDirections = [];

  if (dx === 1 && currentDirection !== 1) {validDirections.push(0);}
  if (dx === -1 && currentDirection !== 0) {validDirections.push(1);}
  if (dy === 1 && currentDirection !== 3) {validDirections.push(2);}
  if (dy === -1 && currentDirection !== 2) {validDirections.push(3);}

  if (validDirections.length > 0) {
    const randomIndex = Math.floor(Math.random() * validDirections.length);
    return validDirections[randomIndex];
  }

  return currentDirection;
}

function findPath(startX, startY, targetX, targetY) {
  const openSet = [];
  const closedSet = [];
  const cameFrom = {};

  const startNode = { x: startX, y: startY, g: 0, h: heuristic(startX, startY, targetX, targetY) };
  openSet.push(startNode);

  while (openSet.length > 0) {
    const current = getLowestFScoreNode(openSet);

    if (current.x === targetX && current.y === targetY) {
      return reconstructPath(cameFrom, current);
    }

    openSet.splice(openSet.indexOf(current), 1);
    closedSet.push(current);
    const neighbors = getNeighbors(current.x, current.y);

    for (const neighbor of neighbors) {
      if (closedSet.some(node => node.x === neighbor.x && node.y === neighbor.y)) {
        continue;
      } const tentativeG = current.g + 1;
      if (!openSet.includes(neighbor) || tentativeG < neighbor.g) {
        cameFrom[`${neighbor.x}-${neighbor.y}`] = current;
        if (!openSet.includes(neighbor)) {
          neighbor.g = tentativeG;
          neighbor.h = heuristic(neighbor.x, neighbor.y, targetX, targetY);
          openSet.push(neighbor);
        }
      }
    }
  }

  return [];
}

function getLowestFScoreNode(nodes) {
  return nodes.reduce((minNode, node) => (node.f < minNode.f ? node : minNode), nodes[0]);
} function heuristic(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
} function getNeighbors(x, y) {
  const neighbors = [];
  const directions = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
  for (const dir of directions) {
    const neighborX = x + dir.x;
    const neighborY = y + dir.y;
    if (isValidTile(neighborX, neighborY)) {
    neighbors.push({ x: neighborX, y: neighborY })}
  } return neighbors;
}

function isValidTile(x, y) {
  return x >= 0 && y >= 0 && x < tiles[0].length && y < tiles.length && tiles[y][x] !== 'x';
} function reconstructPath(cameFrom, current) {
  const path = [{ x: current.x, y: current.y }];
  while (cameFrom[`${current.x}-${current.y}`]) {
    current = cameFrom[`${current.x}-${current.y}`];
    path.push({ x: current.x, y: current.y });
  } return path.reverse();
}

/*END OF GHOST CODE
====================================================================================================
====================================================================================================*/

let column = Math.floor(x / tileSize);
let row = Math.floor(y / tileSize);
let pressedKeys = {"a": false, "d": false, "s": false, "w": false};
document.addEventListener('keydown', function (event) {
  if (readyUp||playerDeathAnim) return;
  pressedKeys['a'] = (event.key === 'a' && tiles[row][column - 1] !== 'x');
  pressedKeys['d'] = (event.key === 'd' && tiles[row][column + 1] !== 'x');
  pressedKeys['w'] = (event.key === 'w' && tiles[row - 1][column] !== 'x');
  pressedKeys['s'] = (event.key === 's' && tiles[row + 1][column] !== 'x');

  if (pressedKeys['a'] || pressedKeys['d'] || pressedKeys['w'] || pressedKeys['s']) {
    if (pressedKeys['a']) {direction = -90};
    if (pressedKeys['d']) {direction = 90};
    if (pressedKeys['w']) {direction = 180};
    if (pressedKeys['s']) {direction = 0};
  }
});

let playerDeathAnim = false;
let readyUp = true;
function updateDrawing() {
  if (!playerDeathAnim) {context.fillStyle = 'black';context.fillRect(0, 0, canvas.width, canvas.height)} else {return};
  context.drawImage(mapImage, 0, 100, canvas.width, canvas.height-200);
  drawPlayer(); drawGUI();
  drawGhosts(); drawOrb();
  if (readyUp) {context.drawImage(readyText, 200,437,164,25)};
  requestAnimationFrame(updateDrawing);
} function updatePlayerPosition() {
  if (x > canvas.width) { x = -playerSize; direction = 90 }
  else if (x < 0) { x = canvas.width + playerSize; direction = -90 };
  waitForMovement = (waitForMovement > 0) ? waitForMovement-1 : 4;
  playerFrame = (playerFrame + 1) % 3;
  column = Math.floor(x / tileSize);
  row = Math.floor(y / tileSize);

  if (checkFront() && waitForMovement == 0) {
    x += checkX(direction) * tileSize;
    y += checkY(direction) * tileSize;
  } 
}

let updatePlayer;
let updateGhosts;
let updateGhostsFrame;
let releaseGhosts;
let drawPlayerDeath;

function playerDeath() {
  clearInterval(updatePlayer);
  clearInterval(updateGhosts);
  clearInterval(updateGhostsFrame);
  clearInterval(releaseGhosts);

  lives--;
  playerDeathAnim = true;
  let angleDeath = 1;
  const sprites = {'90':90,'-90':-90,'180':0,'0':180}
  drawPlayerDeath = setInterval(function () {
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(mapImage, 0, 100, canvas.width, canvas.height-200);
    drawGUI(); drawGhosts(); drawOrb();
    context.fillStyle = 'yellow';
    context.beginPath(); context.moveTo(x, y + 100);
    context.arc(x, y + 100, playerSize, (Math.PI / 180)*(sprites[String(direction)]+(angleDeath*10-90)), (Math.PI / 180) * (sprites[String(direction)]+(180-angleDeath*10+90)));
    context.lineTo(x, y + 100); context.closePath(); context.fill();
    angleDeath++; if (angleDeath > 18) {
      resetPlayerAndGhostPositions();
      clearInterval(drawPlayerDeath);
    }
  }, 150);
}

function resetPlayerAndGhostPositions() {
  direction = -89;
  x = 290;  y = 470;
  ghostPositionX = [13, 11.5, 13.5, 15.5];
  ghostPositionY = [11, 13.5, 14.5, 13.5];
  ghostReleased = [true, false, false, false];
  ghostSprite = [3, 1, 1, 1];
  playerDeathAnim = false
  readyUp = true;
  updateDrawing();
  setTimeout(function(){start();readyUp=false},2000)
}


function start() {
  ghostState = 1;
  updatePlayer = setInterval(updatePlayerPosition, 100);
  updateGhosts = setInterval(updateGhostsPosition, 500);
  updateGhostsFrame = setInterval(function () {
    ghostsFrame = (ghostsFrame === 1) ? 0 : 1;
  }, 150);
  releaseGhosts = setInterval(function () {
    let allGhostsReleased = true;
    for (let i = 0; i < 4; i++) {
      if (!ghostReleased[i]) {
        ghostReleased[i] = true;
        ghostPositionX[i] = 13;
        ghostPositionY[i] = 11;
        ghostSprite[i] = 3;
        allGhostsReleased = false;
        return;
      }
    }
    if (allGhostsReleased) {clearInterval(releaseGhosts)};
  }, 5000);
} updateDrawing();
setTimeout(function(){start();readyUp=false},2000)
setInterval(function(){ghostState++;
if (ghostScaredTimer!==0) {ghostScaredTimer--}}, 1000);