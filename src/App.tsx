import { FC, useState, useCallback, useRef } from "react";
import useInterval from "./useInterval";

const numRows = 50;
const numCols = 50;

const positions = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const generateEmptyGrid = (): number[][] => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};

const randomTiles = (): number[][] => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0)));
  }
  return rows;
};

const App: FC = () => {
  const [grid, setGrid] = useState(() => {
    return randomTiles();
  });
  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback((grid) => {
    if (!runningRef.current) {
      return;
    }

    let gridCopy = JSON.parse(JSON.stringify(grid));
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        let neighbors = 0;

        positions.forEach(([x, y]) => {
          const newI = i + x;
          const newJ = j + y;

          if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
            neighbors += grid[newI][newJ];
          }
        });

        if (neighbors < 2 || neighbors > 3) {
          gridCopy[i][j] = 0;
        } else if (grid[i][j] === 0 && neighbors === 3) {
          gridCopy[i][j] = 1;
        }
      }
    }

    setGrid(gridCopy);
  }, []);

  useInterval(() => {
    runSimulation(grid);
  }, 150);

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 10px)`,
          width: "fit-content",
          margin: "0 auto",
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, j) => (
            <div
              style={{
                width: 10,
                height: 10,
                backgroundColor: grid[i][j] ? "#000" : undefined,
                border: "1px solid #595959",
              }}
              key={`${i}-${j}`}
              onClick={() => {
                let newGrid = JSON.parse(JSON.stringify(grid));
                newGrid[i][j] = grid[i][j] ? 0 : 1;
                setGrid(newGrid);
              }}
            />
          ))
        )}
      </div>
      <div
        style={{
          width: "80%",
          textAlign: "center",
          margin: "0 auto",
          padding: "20 0"
        }}
      >
        <button
          style={{
            margin: 10
          }}
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
            }
          }}
        >
          {running ? "Stop" : "Start"}
        </button>
        <button
          style={{
            margin: 10
          }}
          onClick={() => {
            const gridG = generateEmptyGrid();
            setGrid(gridG);
          }}
        >
          Clear board
        </button>
        <button
          style={{
            margin: 10
          }}
          onClick={() => {
            setGrid(randomTiles());
          }}
        >
          Random
        </button>
      </div>
    </>
  );
};

export default App;
