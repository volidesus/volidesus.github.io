const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const tilesHitboxes = [
  {'x':24,'y':649,'length':15,'dir':'left'},{'x':384,'y':645,'length':3,'dir':'left'},{'x':456,'y':641,'length':3,'dir':'left'},
  {'x':528,'y':637,'length':3,'dir':'left'},{'x':600,'y':633,'length':3,'dir':'left'},{'x':672,'y':629,'length':3,'dir':'left'},

  {'x':600,'y':557,'length':3,'dir':'right'},{'x':528,'y':553,'length':3,'dir':'right'},{'x':456,'y':549,'length':3,'dir':'right'},
  {'x':384,'y':545,'length':3,'dir':'right'},{'x':312,'y':541,'length':3,'dir':'right'},{'x':240,'y':537,'length':3,'dir':'right'},
  {'x':168,'y':533,'length':3,'dir':'right'},{'x':96,'y':529,'length':3,'dir':'right'},{'x':48,'y':525,'length':2,'dir':'right'},

  {'x':96,'y':453,'length':3,'dir':'left'},{'x':168,'y':449,'length':3,'dir':'left'},{'x':240,'y':445,'length':3,'dir':'left'},
  {'x':312,'y':441,'length':3,'dir':'left'},{'x':384,'y':437,'length':3,'dir':'left'},{'x':456,'y':433,'length':3,'dir':'left'},
  {'x':528,'y':429,'length':3,'dir':'left'},{'x':600,'y':425,'length':3,'dir':'left'},{'x':672,'y':421,'length':2,'dir':'left'},

  {'x':600,'y':349,'length':3,'dir':'right'},{'x':528,'y':345,'length':3,'dir':'right'},{'x':456,'y':341,'length':3,'dir':'right'},
  {'x':384,'y':337,'length':3,'dir':'right'},{'x':312,'y':333,'length':3,'dir':'right'},{'x':240,'y':329,'length':3,'dir':'right'},
  {'x':168,'y':325,'length':3,'dir':'right'},{'x':96,'y':321,'length':3,'dir':'right'},{'x':48,'y':317,'length':2,'dir':'right'},

  {'x':96,'y':245,'length':3,'dir':'left'},{'x':168,'y':241,'length':3,'dir':'left'},{'x':240,'y':237,'length':3,'dir':'left'},
  {'x':312,'y':233,'length':3,'dir':'left'},{'x':384,'y':229,'length':3,'dir':'left'},{'x':456,'y':225,'length':3,'dir':'left'},
  {'x':528,'y':221,'length':3,'dir':'left'},{'x':600,'y':217,'length':3,'dir':'left'},{'x':672,'y':213,'length':2,'dir':'left'},

  {'x':24,'y':125,'length':15,'dir':'right'},{'x':384,'y':129,'length':3,'dir':'right'},{'x':456,'y':133,'length':3,'dir':'right'},
  {'x':528,'y':137,'length':3,'dir':'right'},{'x':600,'y':141,'length':3,'dir':'right'},{'x':312,'y':53,'length':6},
  {'x':240,'y':77,'length':3}
]

const ladderHitboxes = [
  {'x':600,'y':637,'length':5},{'x':337,'y':545,'length':6},{'x':144,'y':530,'length':4},
  {'x':384,'y':441,'length':6},{'x':600,'y':426,'length':4},{'x':264,'y':331,'length':5},
  {'x':144,'y':324,'length':4},{'x':600,'y':218,'length':4},{'x':432,'y':130,'length':4},
  {'x':240,'y':125,'length':2},{'x':288,'y':125,'length':2},{'x':240,'y':77,'length':6},
  {'x':288,'y':77,'length':6}
]

let playerX = 216;
let playerY = 649;
let playerDir = 'right';
let playerState = 0;

let isJumping = false;
let onLadder = false;

let jumpTimer = 0;
const jumpStrength = 42;
const gravityStrength = 1;


const loadImage = (src) => { const image = new Image(); image.src = src; return image };
const spriteSheet = loadImage('./imageOrIcon/donkeyKongSpriteSheet.png');
const ladder = loadImage('./imageOrIcon/donkeyKongLadder.png');
const barrel = loadImage('./imageOrIcon/donkeyKongBarrel.png');
const tile = loadImage('./imageOrIcon/donkeyKongTile.png');
let donkeyKongState = 1;
let girlState = 0;

const pressedKeys = {'a': 0, 'd': 0, 'w': 0, 's': 0};
document.addEventListener('keydown', function(event){
  if (event.key === 's') pressedKeys['s'] = 1;
  if (event.key === 'w') pressedKeys['w'] = 1;
  if (event.key === 'a') pressedKeys['a'] = 1;
  if (event.key === 'd') pressedKeys['d'] = 1;
  if (event.key === ' ') jump();
});

document.addEventListener('keyup', function(event) {
  if (event.key === 's') pressedKeys['s'] = 0;
  if (event.key === 'w') pressedKeys['w'] = 0;
  if (event.key === 'a') pressedKeys['a'] = 0;
  if (event.key === 'd') pressedKeys['d'] = 0;
})

/* Draw display
====================================================================================================
==================================================================================================== */

function drawDecors() {
  const boxLoc = [{'x':24,'y':86},{'x':24,'y':125},{'x':50,'y':86},{'x':50,'y':125}];
  for (let decorID = 0; decorID < 4; decorID++) {
    ctx.drawImage(spriteSheet, 178, 130, 10, 16, 
    boxLoc[decorID].x, boxLoc[decorID].y, 26, -39);
  };
};

function drawDonkeyKong() {
  const donkeyKongLocation = [{'x':1,'y':91,'width':43,'height':32},{'x':49,'y':91,'width':40,'height':32},{'x':1,'y':91,'width':43,'height':32}]
  if(donkeyKongState===2) {
    ctx.translate(76, 125); ctx.scale(-1, 1);
    ctx.drawImage(spriteSheet, donkeyKongLocation[2].x, donkeyKongLocation[2].y,
    donkeyKongLocation[2].width, donkeyKongLocation[2].height, 0, 0, -120, -78);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  } else {
    ctx.drawImage(spriteSheet,donkeyKongLocation[donkeyKongState].x,donkeyKongLocation[donkeyKongState].y,
    donkeyKongLocation[donkeyKongState].width,donkeyKongLocation[donkeyKongState].height,76,125,120,-78)
  };
};

function drawGirl() {
  if (girlState===0) {
    ctx.drawImage(spriteSheet,92,28,15,21,321,53,24,-36);
  } if (girlState===1) {
    ctx.drawImage(spriteSheet,112,28,15,21,321,53,24,-36);
    ctx.drawImage(spriteSheet,132,28,24,8,348,17,24,12);
  } if (girlState===2) {
    ctx.drawImage(spriteSheet,92,28,15,21,321,53,24,-36)
    ctx.drawImage(spriteSheet,132,28,24,8,348,17,24,12);
  }
};

function drawLadderAndTiles() {
  for (let ladderID = 0; ladderID < ladderHitboxes.length; ladderID++) {
    for (let i = 0; i < ladderHitboxes[ladderID]['length']; i++) {
      ctx.drawImage(ladder, ladderHitboxes[ladderID]['x'], ladderHitboxes[ladderID]['y']-i*14,24,-14);
    };
  };

  for (let blockID = 0; blockID < tilesHitboxes.length; blockID++) {
    for (let i = 0; i < tilesHitboxes[blockID]['length']; i++) {
      ctx.drawImage(tile,tilesHitboxes[blockID]['x']+i*24, tilesHitboxes[blockID]['y'], 24, 24);
    };
  };
};

function drawBarrel() {
  moveBarrel();
  for (let barrelID = 0; barrelID < barrels.length; barrelID++) {
    if (barrels[barrelID].holding) {
      ctx.drawImage(spriteSheet,178,151,16,10,112,92,47,26)
      setTimeout(function(){barrels[barrelID]['holding']=false},1166)
    } else {
      ctx.drawImage(barrel,barrelRotationLocation[barrelRotation]['x'],barrelRotationLocation[barrelRotation]['y'],
      barrelRotationLocation[barrelRotation]['width'],barrelRotationLocation[barrelRotation]['height'],
      barrels[barrelID].x,barrels[barrelID].y,24,-24)
    }
  }
};

function drawPlayer() {
  const playerLocation = [
    {'x':1,'y':141,'width':12,'height':16},{'x':18,'y':141,'width':15,'height':16},
    {'x':38,'y':142,'width':15,'height':15},{'x':1,'y':183,'width':16,'height':15},

    {'x':1,'y':162,'width':16,'height':15},{'x':1,'y':162,'width':16,'height':15},
    {'x':19,'y':162,'width':14,'height':15},{'x':38,'y':162,'width':16,'height':12},]
    
  if (playerState === 4) {
    ctx.translate(playerX+24, playerY); ctx.scale(-1, 1);
    ctx.drawImage(spriteSheet, playerLocation[playerState].x, playerLocation[playerState].y,
    playerLocation[playerState].width, playerLocation[playerState].height, 
    0, 0, playerLocation[playerState].width*2, -playerLocation[playerState].height*2.4);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    return;
  } else if (playerState >= 5 && playerState <= 8){
    ctx.drawImage(spriteSheet, playerLocation[playerState].x,playerLocation[playerState].y,
    playerLocation[playerState].width,playerLocation[playerState].height,
    playerX,playerY,playerLocation[playerState].width*2,-playerLocation[playerState].height*2.4)
    return;
  }

  if (playerDir === 'right') {
    ctx.translate(playerX+24, playerY); ctx.scale(-1, 1);
    ctx.drawImage(spriteSheet, playerLocation[playerState].x, playerLocation[playerState].y,
    playerLocation[playerState].width, playerLocation[playerState].height, 
    0, 0, playerLocation[playerState].width*2, -playerLocation[playerState].height*2.4);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  } else if (playerDir === 'left') {
    ctx.drawImage(spriteSheet, playerLocation[playerState].x,playerLocation[playerState].y,
    playerLocation[playerState].width,playerLocation[playerState].height,
    playerX,playerY,playerLocation[playerState].width*2,-playerLocation[playerState].height*2.4)
  }
}

function drawFrame() {
  ctx.fillStyle = '#000';ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawDecors(); drawDonkeyKong(); drawLadderAndTiles(); 
  drawBarrel(); drawGirl(); drawPlayer();
  requestAnimationFrame(drawFrame);
}

/* Barrel Code
====================================================================================================
==================================================================================================== */

function newBarrel() {
  this.x = 80;
  this.y = 125;
  this.holding = true;
} let barrels = [];

let barrelRotation = 3;
const barrelRotationLocation = [
  {'x':2,'y':1,'width':152,'height':152},
  {'x':214,'y':1,'width':152,'height':152},
  {'x':214,'y':201,'width':152,'height':152},
  {'x':2,'y':201,'width':152,'height':152}
]; function moveBarrel() {
  for (let tileID = 0; tileID < tilesHitboxes.length; tileID++) {
    const box = tilesHitboxes[tileID];
    for (let barrelID = 0; barrelID < barrels.length; barrelID++) {
      const barrel = barrels[barrelID];
      if (barrel.x > box.x && barrel.x < box.x + box['length'] * 24) {
        if (barrel.y > box.y && barrel.y < box.y + 24) {
          if (box.dir === 'right') {barrels[barrelID]['x'] += 2}
          else if (box.dir === 'left') {barrels[barrelID]['x'] -= 2};
          barrels[barrelID]['y']--;
          continue;
        } else if (barrel.y > box.y - 75 && barrel.y < box.y + 24) {
          barrels[barrelID]['x'] += 0.1;
          barrels[barrelID]['y']++;
          continue;
        }
      }
    }
  }
}

/* Player Code
====================================================================================================
==================================================================================================== */

function gravity() {
  for (let i = 0; i < ladderHitboxes.length; i++) {
    const box = ladderHitboxes[i];
    if (playerX + 25 > box.x && playerX < box.x + 24) {
      if (playerY > box.y - (box.length*14)-18 && 
      playerY < box.y-5) {return};
    }
  }
  if (!isJumping) {
    for (let tileID = 0; tileID < tilesHitboxes.length; tileID++) {
      const box = tilesHitboxes[tileID];
      if (playerX < box.x + box.length * 24 + 25 &&
      playerX + 25 > box.x && playerY > box.y && playerY - 40 < box.y) {
        playerY -= gravityStrength; return;
      } else if (playerX + 25< box.x + box.length * 24 &&
      playerX > box.x && playerY > box.y-74 && playerY - 40 < box.y) {
        playerY += gravityStrength; return;
      } 
    }
  } else {
    playerState = 3;
    playerY -= (jumpTimer < jumpStrength) ? -1 : 1;
    isJumping = (jumpTimer < 0) ? false : true;
    jumpTimer--;

    if (jumpTimer === 0) {
      isJumping = false;
      playerState = 0;
    }
  }
}

function jump() {
  if (!isJumping) {
    jumpTimer = jumpStrength*2;
    isJumping = true;
  };
}

let speedX = 0;
function movePlayer(key) {
  for (let i = 0; i < ladderHitboxes.length; i++) {
    const box = ladderHitboxes[i];
    if (playerX + 25 > box.x && playerX < box.x + 24) {
      if (playerY > box.y - (box.length*14)-24 && 
      playerY < box.y-5 && pressedKeys['s']===1) {playerY += 1.1}
      else if (playerY > box.y - (box.length*14)-18 && 
      playerY < box.y && pressedKeys['w']===1) {playerY -= 1.1};
    }
  }

  playerDir = (String(speedX).includes('-'))?'left':'right';
  speedX += 0.9 * key; speedX *= 0.9;
  playerX += speedX * 0.2;
}


function playerDeathCheck() {
  for (let barrelID = 0; barrelID < barrels.length; barrelID++) {
    const barrel = barrels[barrelID]
    if (playerX > barrel.x && playerX < barrel.x+24 &&
    playerY > barrel.y-24 && playerY < barrel.y) {
      barrels = [];
      setTimeout(function(){
        window.top.location.reload(true);
      },1500);
    }
  }
}

function levelEndCheck() {
  if (playerY < 53) {
    window.top.location.reload(true);
  }
}

/* Interval
====================================================================================================
==================================================================================================== */

drawFrame();
setInterval(function(){
  gravity(); playerDeathCheck(); levelEndCheck();
  movePlayer(pressedKeys['d'] - pressedKeys['a']);
},1000/60);

setInterval(function(){
  barrelRotation++;
  barrelRotation = barrelRotation % 4;
  if ((playerState>= 0&&playerState<=2)||((playerState===4||playerState===5)&&!onLadder)) {
    if (pressedKeys['d'] - pressedKeys['a'] !== 0) {
      playerState = (playerState === 0 || playerState === 2) ? 1 : 2;
    } else {playerState = 0}
  } if (onLadder&&(pressedKeys['w']!==0||pressedKeys['s']!==0)) {
    if (pressedKeys['w'] - pressedKeys['s'] !== 0) {
      playerState = (playerState === 0 || playerState === 5) ? 4 : 5;
    }
  }
},100)


setInterval(() => {
  for (let i = 0; i < ladderHitboxes.length; i++) {
    const box = ladderHitboxes[i];
    if (playerX + 25 > box.x && playerX < box.x + 24) {
      if (playerY > box.y - (box.length*14)-18 && 
      playerY < box.y) {onLadder=true;return};
    }
  } onLadder=false;
}, 100);

barrels.push(new newBarrel());
donkeyKongState=1;
setTimeout(function(){
  donkeyKongState=2;
  setTimeout(function(){
    donkeyKongState=0;
  },1166)
},1166)

setInterval(function(){
  const barrel = new newBarrel();
  barrels.push(barrel);
  donkeyKongState=1;
  setTimeout(function(){
    donkeyKongState=2;
    setTimeout(function(){
      donkeyKongState=0;
    },1166)
  },1166)
},3500);

setInterval(function(){
  let instances = 8; 
  const interval = setInterval(function(){
    if (instances === 0) {clearInterval(interval)}; 
    girlState = (girlState + 1) % 3; if (girlState === 0) {girlState = 1};
    instances--;
  }, 250);
}, 5500);