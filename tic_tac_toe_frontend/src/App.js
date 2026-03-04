import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

const PLAYER_X = "X";
const PLAYER_O = "O";

/**
 * Returns the winner symbol ("X"/"O") if any, otherwise null.
 * Also returns the winning line indices when applicable.
 */
function getWinner(squares) {
  const lines = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Cols
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diags
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    const v = squares[a];
    if (v && v === squares[b] && v === squares[c]) {
      return { winner: v, line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}

function isBoardFull(squares) {
  return squares.every((s) => s !== null);
}

function getNextPlayer(current) {
  return current === PLAYER_X ? PLAYER_O : PLAYER_X;
}

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");

  // Game state
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER_X);

  const { winner, line } = useMemo(() => getWinner(squares), [squares]);
  const isDraw = !winner && isBoardFull(squares);
  const isGameOver = Boolean(winner) || isDraw;

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  function resetGame() {
    setSquares(Array(9).fill(null));
    setCurrentPlayer(PLAYER_X);
  }

  function handleSquareClick(index) {
    if (isGameOver) return;
    if (squares[index]) return;

    setSquares((prev) => {
      const next = prev.slice();
      next[index] = currentPlayer;
      return next;
    });

    setCurrentPlayer((prev) => getNextPlayer(prev));
  }

  function handleSquareKeyDown(e, index) {
    // Allow keyboard play (Enter/Space)
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSquareClick(index);
    }
  }

  const statusLabel = winner
    ? `Winner: ${winner}`
    : isDraw
      ? "It's a draw"
      : `Turn: ${currentPlayer}`;

  const statusSubLabel = winner
    ? "Nice play. Restart to play again."
    : isDraw
      ? "No more moves left. Restart to try again."
      : "Click a square to place your mark.";

  return (
    <div className="App">
      <header className="App-shell">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          type="button"
        >
          {theme === "light" ? "Dark mode" : "Light mode"}
        </button>

        <main className="ttt-container">
          <div className="ttt-card" role="application" aria-label="Tic Tac Toe">
            <div className="ttt-header">
              <div>
                <h1 className="ttt-title">Tic-Tac-Toe</h1>
                <p className="ttt-subtitle">Classic 3×3 — two players, one device.</p>
              </div>

              <div className="ttt-status" aria-live="polite">
                <div
                  className={`ttt-status-pill ${
                    winner
                      ? "is-winner"
                      : isDraw
                        ? "is-draw"
                        : currentPlayer === PLAYER_X
                          ? "is-x"
                          : "is-o"
                  }`}
                >
                  {statusLabel}
                </div>
                <div className="ttt-status-sub">{statusSubLabel}</div>
              </div>
            </div>

            <section className="ttt-board-wrap">
              <div
                className="ttt-board"
                role="grid"
                aria-label="Tic tac toe board"
                aria-readonly={isGameOver ? "true" : "false"}
              >
                {squares.map((value, idx) => {
                  const isWinningCell = line.includes(idx);
                  const isDisabled = Boolean(value) || isGameOver;
                  const ariaLabel = value
                    ? `Square ${idx + 1}, ${value}`
                    : `Square ${idx + 1}, empty`;

                  return (
                    <button
                      key={idx}
                      type="button"
                      className={[
                        "ttt-square",
                        value ? "is-filled" : "",
                        value === PLAYER_X ? "is-x" : "",
                        value === PLAYER_O ? "is-o" : "",
                        isWinningCell ? "is-winning" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => handleSquareClick(idx)}
                      onKeyDown={(e) => handleSquareKeyDown(e, idx)}
                      disabled={isDisabled}
                      role="gridcell"
                      aria-label={ariaLabel}
                    >
                      <span className="ttt-mark" aria-hidden="true">
                        {value ?? ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <footer className="ttt-footer">
              <button className="ttt-restart" type="button" onClick={resetGame}>
                Restart
              </button>

              <div className="ttt-legend" aria-label="Player legend">
                <span className="ttt-legend-item">
                  <span className="ttt-dot is-x" aria-hidden="true" /> X
                </span>
                <span className="ttt-legend-item">
                  <span className="ttt-dot is-o" aria-hidden="true" /> O
                </span>
              </div>
            </footer>
          </div>
        </main>
      </header>
    </div>
  );
}

export default App;
