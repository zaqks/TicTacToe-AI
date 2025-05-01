class TicTacToeMinimax:
    WIN_COMBINATIONS = [
        # Rows
        [(0, 0), (0, 1), (0, 2)],
        [(1, 0), (1, 1), (1, 2)],
        [(2, 0), (2, 1), (2, 2)],
        # Columns
        [(0, 0), (1, 0), (2, 0)],
        [(0, 1), (1, 1), (2, 1)],
        [(0, 2), (1, 2), (2, 2)],
        # Diagonals
        [(0, 0), (1, 1), (2, 2)],
        [(0, 2), (1, 1), (2, 0)],
    ]

    SYMBOL_MAP = {0: '.', 1: 'X', 2: 'O'}

    def __init__(self, max_depth=5):
        self.max_depth = max_depth

    @staticmethod
    def get_winner(grid) -> int:
        for player in [1, 2]:
            for comb in TicTacToeMinimax.WIN_COMBINATIONS:
                if all(grid[x][y] == player for x, y in comb):
                    return player  # Player 1 or 2 wins

        for row in grid:
            if 0 in row:
                return -1  # Game not ended yet

        return 0  # Tie

    @staticmethod
    def get_empty(grid) -> list:
        return [(i, j) for i in range(3) for j in range(3) if grid[i][j] == 0]

    @staticmethod
    def score_func(grid) -> int:
        winner = TicTacToeMinimax.get_winner(grid)
        if winner != -1:
            if winner == 0:
                won = 0
            else:
                won = 1 if winner == 2 else -1
            empty_cells = sum(cell == 0 for row in grid for cell in row)
            return (empty_cells + 1) * won
        return 0

    @staticmethod
    def print_grid(grid):
        print("=" * 9)
        for row in grid:
            print(' | '.join(
                TicTacToeMinimax.SYMBOL_MAP[cell] for cell in row))
        print("=" * 9)

    def next_step_score(self, grid, player: int, alpha: int, beta: int, depth: int) -> int:
        winner = self.get_winner(grid)
        if winner != -1 or depth == 0:
            return self.score_func(grid)

        cells = self.get_empty(grid)
        if not cells:
            return self.score_func(grid)

        if player == 2:
            max_eval = -float('inf')
            for (i, j) in cells:
                grid[i][j] = 2
                score = self.next_step_score(grid, 1, alpha, beta, depth - 1)
                grid[i][j] = 0  # revert move
                max_eval = max(max_eval, score)
                alpha = max(alpha, score)
                if beta <= alpha:
                    break  # Beta cut-off
            return max_eval
        else:
            min_eval = float('inf')
            for (i, j) in cells:
                grid[i][j] = 1
                score = self.next_step_score(grid, 2, alpha, beta, depth - 1)
                grid[i][j] = 0  # revert move
                min_eval = min(min_eval, score)
                beta = min(beta, score)
                if beta <= alpha:
                    break  # Alpha cut-off
            return min_eval

    def find_best_move(self, grid):
        moves = {}
        for (i, j) in self.get_empty(grid):
            grid[i][j] = 2  # AI move
            moves[(i, j)] = self.next_step_score(
                grid, 1, -float('inf'), float('inf'), self.max_depth)
            grid[i][j] = 0  # revert move
        best_move = max(moves, key=moves.get)
        return best_move
