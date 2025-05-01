var grid = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];
var pcells = 0;
const win_combs = [
  [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  [
    [0, 2],
    [1, 1],
    [2, 0],
  ],

  [
    [0, 0],
    [1, 0],
    [2, 0],
  ],
  [
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  [
    [0, 2],
    [1, 2],
    [2, 2],
  ],

  [
    [0, 0],
    [0, 1],
    [0, 2],
  ],
  [
    [1, 0],
    [1, 1],
    [1, 2],
  ],
  [
    [2, 0],
    [2, 1],
    [2, 2],
  ],
];
var turn = true; // true = player 1, false = player 2 (AI)
var gameOver = false;

const grid_widget = document.getElementById("grid");

// Create cells and store references for quick access
const cells = [];

for (let i = 0; i < 3; i++) {
  cells[i] = [];
  for (let j = 0; j < 3; j++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.id = `cell_${i * 3 + j}`;

    cell.addEventListener("click", function () {
      if (gameOver) return;
      if (!grid[i][j] && turn) {
        // Player's move
        grid[i][j] = 1;
        pcells++;
        cell.classList.add("p1");
        turn = false;

        checkGameState();

        // AI's turn if game not over
        if (!gameOver && !turn) {
          setTimeout(() => {
            aiMove();
          }, 500);
        }
      }
    });

    grid_widget.appendChild(cell);
    cells[i][j] = cell;
  }
}

// Function to check for a winner or draw
function checkGameState() {
  var winner = 0;
  var winningCells = [];
  for (let player = 1; !winner && player < 3; player++) {
    for (let comb of win_combs) {
      if (
        grid[comb[0][0]][comb[0][1]] == player &&
        grid[comb[1][0]][comb[1][1]] == player &&
        grid[comb[2][0]][comb[2][1]] == player
      ) {
        winner = player;
        winningCells = comb;
        break;
      }
    }
  }

  if (winner) {
    gameOver = true;
    for (const [x, y] of winningCells) {
      cells[x][y].classList.add("win");
    }
    show_mssg(`You ${winner == 1 ? "Won" : "Lost"}`);
  } else if (pcells == 9) {
    gameOver = true;
    show_mssg("Draw!");
  }
}

// Function to perform AI move
function aiMove() {
  if (gameOver) return;

  const [ai_i, ai_j] = ai_play(grid);

  if (grid[ai_i][ai_j] === 0) {
    grid[ai_i][ai_j] = 2;
    pcells++;
    cells[ai_i][ai_j].classList.add("p2");
    turn = true;

    checkGameState();
  }
}

// Reset function to clear the board and reset variables
function resetGame() {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      grid[i][j] = 0;
      cells[i][j].classList.remove("p1", "p2", "win");
    }
  }
  pcells = 0;
  turn = true;
  gameOver = false;
}

const mssg_div = document.getElementById("mssg");
const mssg = document.getElementById("mssg_val");
const reset_btn = document.getElementById("reset_btn");

reset_btn.onclick = function () {
  resetGame();
  hide_mssg();
};

function show_mssg(txt) {
  setTimeout(function () {
    mssg.innerText = txt;
    mssg_div.style.display = "flex";
  }, 1000);
}
function hide_mssg() {
  mssg_div.style.display = "none";
}
