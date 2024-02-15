"use strict";
const { log } = console;
// 1) add the datas atribute on elements that should be manipulate OK
// 2) select the elements on script and store it on variables OK
// 3) restart the game manually and start to structure the logic
// 4) criar a logica da function rolldice, hold
// x) create a function that will turn the section to player--active for one player and delete for other
//

// * Selectors
// .firstElementChild.textContent;
const sectionP1 = document.getElementById("section--0");
const sectionP2 = document.getElementById("section--1");

let scoreP1 = document.getElementById("score--0");
let scoreP2 = document.getElementById("score--1");

let currentScoreP1 = document.getElementById("current--0");
let currentScoreP2 = document.getElementById("current--1");

const WinsP1 = document.getElementById("win-count--0");
const WinsP2 = document.getElementById("win-count--1");

const diceImage = document.querySelector('[data-control="dice-number"]');
// diceImage.src = "./assets/img/dice-5.png";

const btnNewGame = document.querySelector('[data-action="restart"]');
const btnRollDice = document.querySelector('[data-action ="roll"]');
const btnHold = document.querySelector('[data-action="hold"]');
const btnCpu = document.querySelector('[data-action="cpu"]');

// * MAIN Functions

const rollDice = () => {
  if (diceImage.style.visibility === "hidden") {
    diceImage.style.visibility = "visible";
  }

  if (diceImage.style.visibility === "visible") {
    let numRandom = Math.trunc(Math.random() * 6 + 1);

    diceImage.src = `./assets/img/dice-${numRandom}.png`;

    const playerActive = verifyPlayerActive();

    sumCurrent(numRandom, playerActive);
  }
};

const setScore = () => {
  const playerActive = verifyPlayerActive();

  if (playerActive === "Player 1") {
    const current = +currentScoreP1.textContent;
    const score = +scoreP1.textContent;

    let sum = current + score;

    scoreP1.textContent = +sum;

    resetCurrent(playerActive);
    verifyWinner(playerActive);
  } else {
    const current = +currentScoreP2.textContent;
    const score = +scoreP2.textContent;
    let sum = current + score;

    scoreP2.textContent = +sum;

    resetCurrent(playerActive);
    verifyWinner(playerActive);
  }
};

const newGame = () => {
  diceImage.style.visibility = "hidden";

  scoreP1.textContent = 0;
  scoreP2.textContent = 0;
  currentScoreP1.textContent = 0;
  currentScoreP2.textContent = 0;
  btnRollDice.disabled = false;
  btnHold.disabled = false;
  sectionP1.classList.remove("player--winner");
  sectionP2.classList.remove("player--winner");
  sectionP1.classList.add("player--active");
  sectionP2.classList.remove("player--active");
};

newGame();

// * Functions Verify and support

function verifyPlayerActive() {
  return sectionP1.classList.contains("player--active")
    ? sectionP1.firstElementChild.childNodes[0].data
    : sectionP2.firstElementChild.childNodes[0].data;
}

function verifyWinner(player) {
  const score1 = +scoreP1.textContent;
  const score2 = +scoreP2.textContent;
  if (score1 >= 100 || score2 >= 100) {
    btnRollDice.disabled = true;
    btnHold.disabled = true;
    diceImage.style.visibility = "hidden";
    if (player === "Player 1") {
      sectionP1.classList.add("player--winner");
      sectionP2.classList.remove("player--active");
      WinsP1.textContent++;
    } else {
      sectionP2.classList.add("player--winner");
      sectionP1.classList.remove("player--active");
      WinsP2.textContent++;
    }
  }
}

function resetCurrent(player) {
  if (player === "Player 1") {
    currentScoreP1.textContent = 0;
    turnPlayer();
  } else {
    currentScoreP2.textContent = 0;
    turnPlayer();
  }
}

function sumCurrent(num, player) {
  if (player === "Player 1") {
    if (num === 1) {
      resetCurrent(player);
    } else {
      let current = +currentScoreP1.textContent;
      let sum = (current += num);
      currentScoreP1.textContent = sum;
    }
  } else {
    if (num === 1) {
      resetCurrent(player);
    } else {
      let current = +currentScoreP2.textContent;
      let sum = (current += num);
      currentScoreP2.textContent = sum;
    }
  }
}

function turnPlayer() {
  const playerActive = verifyPlayerActive();
  if (playerActive === "Player 1") {
    sectionP1.classList.remove("player--active");
    sectionP2.classList.add("player--active");
    btnRollDice.disabled = false;
    btnHold.disabled = false;
    verifyCpu();
  } else {
    btnRollDice.disabled = false;
    btnHold.disabled = false;
    sectionP2.classList.remove("player--active");
    sectionP1.classList.add("player--active");
  }
}

//* Event Listeners

btnRollDice.addEventListener("click", rollDice);

btnNewGame.addEventListener("click", newGame);

btnHold.addEventListener("click", setScore);

// * Machine Playng

const cpuAsP2 = () => {
  const score2 = +scoreP2.textContent;
  const score1 = +scoreP1.textContent;
  function rollDiceRepeatedly(countMax) {
    let count = 0;

    function callRollDice(countMax) {
      const playerActive = verifyPlayerActive();
      if (count < countMax && playerActive === "Player 2") {
        rollDice();
        count++;
        if (count === countMax) {
          setScore();
        }
        setTimeout(() => {
          callRollDice(countMax);
        }, 700);
      }
    }

    callRollDice(countMax);
  }

  if (score1 < 100) {
    if (score2 >= 0 && score2 <= 30) {
      rollDiceRepeatedly(5);
    } else if (score2 >= 31 && score2 <= 80) {
      rollDiceRepeatedly(4);
    } else if (score2 >= 81 && score2 <= 95) {
      rollDiceRepeatedly(3);
    } else {
      rollDiceRepeatedly(2);
    }
  }
};

btnCpu.addEventListener("click", () => {
  btnCpu.classList.toggle("activated");
  cpuAsP2();
});

function verifyCpu() {
  const playerActive = verifyPlayerActive();
  if (playerActive === "Player 2" && btnCpu.classList.contains("activated")) {
    btnRollDice.disabled = true;
    btnHold.disabled = true;
    cpuAsP2();
  }
}
