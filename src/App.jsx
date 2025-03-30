import { useState } from 'react';

function Square({ value, onSquareClick, winner }) {
  return (
    <button
      className={`square ${winner ? 'winner' : ''}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const result = calculateWinner(squares);
  function handleClick(i) {
    if (result || squares[i]) {
      return;
    }

    const nextSquares = squares.slice();

    nextSquares[i] = xIsNext ? 'X' : 'O';

    onPlay(nextSquares);
  }

  let status;

  if (result?.winner) {
    status = 'Winner: ' + result.winner;
  } else if (result?.winner === 'Draw') {
    status = 'Draw';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      {squares.map((square, i) => {
        if (i % 3 === 0) {
          return (
            <div className="board-row" key={i}>
              <Square
                value={squares[i]}
                onSquareClick={() => handleClick(i)}
                winner={result?.line?.includes(i)}
              />
              <Square
                value={squares[i + 1]}
                onSquareClick={() => handleClick(i + 1)}
                winner={result?.line?.includes(i + 1)}
              />
              <Square
                value={squares[i + 2]}
                onSquareClick={() => handleClick(i + 2)}
                winner={result?.line?.includes(i + 2)}
              />
            </div>
          );
        }
      })}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [ascending, setAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = `현재 ${move} 수를 진행 중입니다.`;
    } else {
      description = 'Go to game start';
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  if (!ascending) {
    moves.reverse();
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => setAscending(!ascending)}>
          {ascending ? '내림차순' : '오름차순'}
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  if (squares.every((square) => square !== null)) {
    return { winner: 'Draw', line: [] };
  }

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }

  return null;
}
