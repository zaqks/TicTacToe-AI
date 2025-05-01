class TicTacToeMinimax {
  static WIN_COMBINATIONS = [
    // Rows
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
    // Columns
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
    // Diagonals
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
  ];

  static SYMBOL_MAP = { 0: ".", 1: "X", 2: "O" };

  constructor(maxDepth = 5) {
    this.maxDepth = maxDepth;
  }

  static getWinner(grid) {
    for (const player of [1, 2]) {
      for (const comb of TicTacToeMinimax.WIN_COMBINATIONS) {
        if (comb.every(([x, y]) => grid[x][y] === player)) {
          return player; // Player 1 or 2 wins
        }
      }
    }

    for (const row of grid) {
      if (row.includes(0)) {
        return -1; // Game not ended yet
      }
    }

    return 0; // Tie
  }

  static getEmpty(grid) {
    const emptyCells = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i][j] === 0) emptyCells.push([i, j]);
      }
    }
    return emptyCells;
  }

  static scoreFunc(grid) {
    const winner = TicTacToeMinimax.getWinner(grid);
    if (winner !== -1) {
      let won;
      if (winner === 0) {
        won = 0;
      } else {
        won = winner === 2 ? 1 : -1;
      }
      const emptyCells = grid.flat().filter((cell) => cell === 0).length;
      return (emptyCells + 1) * won;
    }
    return 0;
  }

  static printGrid(grid) {
    console.log("=========");
    for (const row of grid) {
      console.log(
        row.map((cell) => TicTacToeMinimax.SYMBOL_MAP[cell]).join(" | ")
      );
    }
    console.log("=========");
  }

  nextStepScore(grid, player, alpha, beta, depth) {
    const winner = TicTacToeMinimax.getWinner(grid);
    if (winner !== -1 || depth === 0) {
      return TicTacToeMinimax.scoreFunc(grid);
    }

    const cells = TicTacToeMinimax.getEmpty(grid);
    if (cells.length === 0) {
      return TicTacToeMinimax.scoreFunc(grid);
    }

    if (player === 2) {
      let maxEval = -Infinity;
      for (const [i, j] of cells) {
        grid[i][j] = 2;
        const score = this.nextStepScore(grid, 1, alpha, beta, depth - 1);
        grid[i][j] = 0; // revert move
        maxEval = Math.max(maxEval, score);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) {
          break; // Beta cut-off
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const [i, j] of cells) {
        grid[i][j] = 1;
        const score = this.nextStepScore(grid, 2, alpha, beta, depth - 1);
        grid[i][j] = 0; // revert move
        minEval = Math.min(minEval, score);
        beta = Math.min(beta, score);
        if (beta <= alpha) {
          break; // Alpha cut-off
        }
      }
      return minEval;
    }
  }

  findBestMove(grid) {
    const moves = {};
    const emptyCells = TicTacToeMinimax.getEmpty(grid);

    for (const [i, j] of emptyCells) {
      grid[i][j] = 2; // AI move
      moves[[i, j]] = this.nextStepScore(
        grid,
        1,
        -Infinity,
        Infinity,
        this.maxDepth
      );
      grid[i][j] = 0; // revert move
    }

    // Find the move with the highest score
    let bestMove = null;
    let bestScore = -Infinity;
    for (const key in moves) {
      if (moves[key] > bestScore) {
        bestScore = moves[key];
        // keys are strings like "i,j", convert back to array
        bestMove = key.split(",").map(Number);
      }
    }

    return bestMove;
  }
}

//////////////////////////////////////////////////////
const game = new TicTacToeMinimax(5);
function ai_play(grid) {
  return game.findBestMove(grid);
}
