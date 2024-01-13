const buttons = ["top-left", "center-top", "top-right", "center-left", "center", "center-right", "bottom-left", "bottom-center", "bottom-right"];
let shuffledButtons = [];
let pressedButtons = [];
let clickable = true;

function createShuffledButtons() {
  shuffledButtons.push(buttons[Math.floor(Math.random() * buttons.length)]);
  pressedButtons.length = 0;
}

function displayShuffledButtons() {
  clickable = false;

  const inst = document.querySelector('#inst');
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  (async () => {
    for (let y = 0; y < shuffledButtons.length; y++) {
      inst.innerHTML = "Pay attention to the order of the buttons!"
      const button = document.getElementById(shuffledButtons[y]);
      button.style.backgroundColor = "#994943";
      await delay(500);
      button.style.backgroundColor = "#fff";
      await delay(100);
      inst.innerHTML = "Click the buttons in the instructed order!"
    } clickable = true;
  })();
}

function lostGame() {
  for (let x = 0; x < buttons.length; x++) {
    const button = document.getElementById(buttons[x]);
    button.remove();
  } const para = document.querySelector("#lost-game-para");
  para.style.display = "block";
  para.innerHTML = "You lost by move " + String(shuffledButtons.length) + "<br> Press Start to try again";

  const startButton = document.querySelector("#start-button");
  startButton.style.display = "block";
  shuffledButtons = [];

  const gameBoard = document.querySelector("#game-board");
  gameBoard.style.margin = "0";
}

function buttonClick(z) {
  if (!clickable) return;

  pressedButtons.push(buttons[z]);

  if (pressedButtons[pressedButtons.length - 1] !== shuffledButtons[pressedButtons.length - 1]) {
    lostGame();
  }

  if (pressedButtons.length === shuffledButtons.length) {
    if (pressedButtons.every((value, index) => value === shuffledButtons[index])) {
      createShuffledButtons();
      displayShuffledButtons();
    } else {
      lostGame();
    }
  }
}

function createButton() {
  const para = document.querySelector("#lost-game-para");
  para.style.display = "none";

  const startButton = document.querySelector("#start-button");
  startButton.style.display = "none";

  const gameBoard = document.querySelector("#game-board");
  gameBoard.style.margin = "50px";

  createShuffledButtons();
  for (let x = 0; x < buttons.length; x++) {
    const buttonElem = document.createElement("button");
    buttonElem.className = "memory-button";
    buttonElem.id = buttons[x];
    document.querySelector('#game-board').appendChild(buttonElem);
  } displayShuffledButtons();
  for (let z = 0; z < buttons.length; z++) {
    document.getElementById(buttons[z]).addEventListener("click", () => buttonClick(z));
  }
}