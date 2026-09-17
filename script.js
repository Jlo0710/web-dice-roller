// Yahtzee Roller
// Rolls five 6-sided dice, draws the pips, and fills the read-only readout.

const DIE_COUNT = 5;

// Which pip positions light up for each face value, 1 through 6.
const PIP_LAYOUT = {
  1: ["2-2"],
  2: ["1-1", "3-3"],
  3: ["1-1", "2-2", "3-3"],
  4: ["1-1", "1-3", "3-1", "3-3"],
  5: ["1-1", "1-3", "2-2", "3-1", "3-3"],
  6: ["1-1", "1-3", "2-1", "2-3", "3-1", "3-3"],
};

// Build the nine-pip grid inside a die element once, up front.
function buildDieFace(dieEl) {
  const allPositions = ["1-1", "1-3", "2-1", "2-2", "2-3", "3-1", "3-3"];
  allPositions.forEach((pos) => {
    const pip = document.createElement("span");
    pip.className = `pip pos-${pos}`;
    pip.dataset.pos = pos;
    dieEl.appendChild(pip);
  });
}

function setDieFace(dieEl, value) {
  const litPositions = PIP_LAYOUT[value];
  dieEl.querySelectorAll(".pip").forEach((pip) => {
    pip.classList.toggle("on", litPositions.includes(pip.dataset.pos));
  });
}

// A random integer from 1 to 6, inclusive.
function rollOneDie() {
  return Math.floor(Math.random() * 6) + 1;
}

function rollDice() {
  let total = 0;

  for (let i = 0; i < DIE_COUNT; i++) {
    const value = rollOneDie();
    total += value;

    const dieEl = document.getElementById(`die-${i}`);
    const valueInput = document.getElementById(`value-${i}`);

    setDieFace(dieEl, value);
    valueInput.value = value;

    // Restart the tumble animation for this die.
    dieEl.classList.remove("rolling");
    // Force reflow so the animation can replay even if it just ran.
    void dieEl.offsetWidth;
    dieEl.classList.add("rolling");
  }

  document.getElementById("total").value = total;
}

function handleFirstRoll() {
  for (let i = 0; i < DIE_COUNT; i++) {
    buildDieFace(document.getElementById(`die-${i}`));
  }
  rollDice();
  document.getElementById("rollButton").focus();
}

// Wire up the button and the initial roll from here, rather than from
// inline HTML attributes, so nothing depends on this file having loaded
// before the markup is parsed.
document.getElementById("rollButton").addEventListener("click", rollDice);
window.addEventListener("load", handleFirstRoll);