const cells = document.querySelectorAll(".cell");
const playButton = document.getElementById("play");
const modeSelect = document.getElementById("mode");
const player1Input = document.getElementById("player1");
const player2Input = document.getElementById("player2");
let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let player1Name = '';
let player2Name = '';
let gameActive = false;
let isAI = false;

cells.forEach(cell => {
  cell.addEventListener("click", handleClick);
});

playButton.addEventListener("click", toggleGame);
modeSelect.addEventListener("change", toggleMode);

function toggleMode() {
  isAI = modeSelect.value === "pvc";
  player2Input.disabled = isAI;
  player2Input.value = isAI ? "AI" : "";
}

function toggleGame() {
  if (!gameActive) {
    player1Name = player1Input.value || "Player 1";
    player2Name = isAI ? "AI" : (player2Input.value || "Player 2");
    playButton.textContent = "Reset";
    gameActive = true;
  } else {
    resetGame();
  }
}

function handleClick(event) {
  if (!gameActive) return;
  const cellIndex = parseInt(event.target.id.replace("cell", ""));
  if (board[cellIndex - 1] === "" && !checkWin()) {
    board[cellIndex - 1] = currentPlayer;
    event.target.textContent = currentPlayer;
    event.target.classList.add(currentPlayer);

    if (checkWin()) {
      setTimeout(() => alert(`${currentPlayer === "X" ? player1Name : player2Name} wins!`), 100);
      gameActive = false;
    } else if (!board.includes("")) {
      setTimeout(() => alert("It's a tie!"), 100);
      gameActive = false;
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      if (isAI && currentPlayer === "O") {
        aiMove();
      }
    }
  }
}

function aiMove() {
  let availableMoves = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      availableMoves.push(i);
    }
  }

  const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
  board[randomMove] = "O";
  const cell = document.getElementById(`cell${randomMove + 1}`);
  cell.textContent = "O";
  cell.classList.add("O");

  if (checkWin()) {
    setTimeout(() => alert(`${player2Name} wins!`), 100);
    gameActive = false;
  } else if (!board.includes("")) {
    setTimeout(() => alert("It's a tie!"), 100);
    gameActive = false;
  } else {
    currentPlayer = "X";
  }
}

function checkWin() {
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < winConditions.length; i++) {
    const [a, b, c] = winConditions[i];
    if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }

  return false;
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("X", "O");
  });
  playButton.textContent = "Play";
}
