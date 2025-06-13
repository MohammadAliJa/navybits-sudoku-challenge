import React, { useState, useEffect, useRef } from 'react';
import { SudokuCell } from './SudokuCell';
import '../styles/SudokuBoard.scss';

const isValidPlacement = (
  board: number[][],
  rowIndex: number,
  colIndex: number,
  num: number
): boolean => {
  if (num === 0) return true;

  for (let c = 0; c < 9; c++) {
    if (c !== colIndex && board[rowIndex][c] === num) {
      return false;
    }
  }

  for (let r = 0; r < 9; r++) {
    if (r !== rowIndex && board[r][colIndex] === num) {
      return false;
    }
  }

  const startRow = Math.floor(rowIndex / 3) * 3;
  const startCol = Math.floor(colIndex / 3) * 3;

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const currentRow = startRow + r;
      const currentCol = startCol + c;

      if (currentRow !== rowIndex || currentCol !== colIndex) {
        if (board[currentRow][currentCol] === num) {
          return false;
        }
      }
    }
  }
  return true;
};

const getConflictingCells = (board: number[][]): { row: number; col: number }[] => {
  const conflicts: { row: number; col: number }[] = [];

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cellValue = board[r][c];

      if (cellValue !== 0) {
        if (!isValidPlacement(board, r, c, cellValue)) {
          conflicts.push({ row: r, col: c });
        }
      }
    }
  }
  return conflicts;
};

const findNextEmptyCell = (board: number[][]): { row: number; col: number } | null => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        return { row: r, col: c };
      }
    }
  }
  return null;
};

const solveSudoku = (board: number[][]): boolean => {
  const emptyCell = findNextEmptyCell(board);

  if (!emptyCell) {
    return true;
  }

  const { row, col } = emptyCell;

  for (let num = 1; num <= 9; num++) {
    if (isValidPlacement(board, row, col, num)) {
      board[row][col] = num;
      if (solveSudoku(board)) {
        return true;
      }
      board[row][col] = 0;
    }
  }
  return false;
};

const shuffleArray = <T,>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const generateSolvedBoard = (): number[][] => {
  const board: number[][] = Array(9).fill(null).map(() => Array(9).fill(0));
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const fillGrid = (currentBoard: number[][]): boolean => {
    const emptyCell = findNextEmptyCell(board);
    if (!emptyCell) {
      return true;
    }

    const { row, col } = emptyCell;
    shuffleArray(numbers);

    for (const num of numbers) {
      if (isValidPlacement(currentBoard, row, col, num)) {
        currentBoard[row][col] = num;
        if (fillGrid(currentBoard)) {
          return true;
        }
        currentBoard[row][col] = 0;
      }
    }
    return false;
  };

  fillGrid(board);
  return board;
};

const _countSolutions = (board: number[][], count: { num: number }): void => {
  if (count.num >= 2) {
    return;
  }
  const emptyCell = findNextEmptyCell(board);
  if (!emptyCell) {
    count.num++;
    return;
  }

  const { row, col } = emptyCell;
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  for (const num of numbers) {
    if (isValidPlacement(board, row, col, num)) {
      board[row][col] = num;
      _countSolutions(board, count);
      board[row][col] = 0;
    }
  }
};

const countSolutions = (board: number[][]): number => {
  const boardCopy = board.map(row => [...row]);
  const count = { num: 0 };
  _countSolutions(boardCopy, count);
  return count.num;
};

const generateSudokuPuzzle = (
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): { puzzle: number[][]; solution: number[][] } => {
  const solvedBoard = generateSolvedBoard();
  const puzzleBoard = solvedBoard.map(row => [...row]);

  let cellsToRemove: number;
  switch (difficulty) {
    case 'easy':
      cellsToRemove = 40;
      break;
    case 'medium':
      cellsToRemove = 50;
      break;
    case 'hard':
      cellsToRemove = 55;
      break;
    default:
      cellsToRemove = 50;
  }

  const allCells: { row: number; col: number }[] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      allCells.push({ row: r, col: c });
    }
  }
  shuffleArray(allCells);

  let removedCount = 0;
  for (const cell of allCells) {
    const { row, col } = cell;
    const originalValue = puzzleBoard[row][col];

    puzzleBoard[row][col] = 0;

    const solutions = countSolutions(puzzleBoard);

    if (solutions === 1) {
      removedCount++;
    } else {
      puzzleBoard[row][col] = originalValue;
    }

    if (removedCount >= cellsToRemove) {
      break;
    }
  }
  return { puzzle: puzzleBoard, solution: solvedBoard };
};

export const SudokuBoard: React.FC = () => {
  const [currentPuzzleData, setCurrentPuzzleData] = useState(() => {
    return generateSudokuPuzzle('medium');
  });
  const cellRefs = useRef(new Map<string, HTMLInputElement>());
  const [board, setBoard] = useState<number[][]>(currentPuzzleData.puzzle);

  const [solution, setSolution] = useState<number[][]>(currentPuzzleData.solution);
  const [conflictingCells, setConflictingCells] = useState<{ row: number, col: number }[]>([]);
  const [overallFeedbackMessage, setOverallFeedbackMessage] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isManualInputMode, setIsManualInputMode] = useState<boolean>(false);
  const [manualPuzzleInitialState, setManualPuzzleInitialState] = useState<number[][]>(
    Array(9).fill(null).map(() => Array(9).fill(0)) // Starts as an empty board
  );

  useEffect(() => {
    setBoard(currentPuzzleData.puzzle);
    setSolution(currentPuzzleData.solution);
    setConflictingCells([]);
    setOverallFeedbackMessage('');
    setIsManualInputMode(false);
    setManualPuzzleInitialState(Array(9).fill(null).map(() => Array(9).fill(0)));
  }, [currentPuzzleData]);

  const handleStartNewManualPuzzle = () => {
    const emptyBoard = Array(9).fill(null).map(() => Array(9).fill(0));
    setBoard(emptyBoard);
    setManualPuzzleInitialState(emptyBoard);
    setConflictingCells([]);
    setOverallFeedbackMessage('');
    setIsManualInputMode(true);
    setSolution(Array(9).fill(null).map(() => Array(9).fill(0)));
  };

  const startNewGame = () => {
    const difficultyToGenerate = selectedDifficulty;
    const newPuzzleGenerated = generateSudokuPuzzle(difficultyToGenerate);
    setCurrentPuzzleData(newPuzzleGenerated);
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: number) => {
    const isCellPreFilledInCurrentMode = isManualInputMode
      ? (manualPuzzleInitialState[rowIndex][colIndex] !== 0)
      : (currentPuzzleData.puzzle[rowIndex][colIndex] !== 0);

    if (isCellPreFilledInCurrentMode) {
      return;
    }

    const newBoard = board.map(row => [...row]);
    newBoard[rowIndex][colIndex] = value;
    setBoard(newBoard);

    const ruleConflicts = getConflictingCells(newBoard);
    const solutionMismatchConflicts: { row: number; col: number }[] = [];

    if (solution.flat().some(cell => cell !== 0) && value !== 0 && newBoard[rowIndex][colIndex] !== solution[rowIndex][colIndex]) {
      solutionMismatchConflicts.push({ row: rowIndex, col: colIndex });
    }
    const combinedConflicts = [
      ...ruleConflicts,
      ...solutionMismatchConflicts
    ].filter((cell, index, self) =>
      index === self.findIndex((t) => (t.row === cell.row && t.col === cell.col))
    );

    setConflictingCells(combinedConflicts);
    setOverallFeedbackMessage('');
    if (value !== 0) {
      const nextEmpty = findNextEmptyCell(newBoard);
      if (nextEmpty) {
        const nextCellInput = cellRefs.current.get(`${nextEmpty.row}-${nextEmpty.col}`);
        if (nextCellInput) {
          nextCellInput.focus();
        }
      }
    }
  };

  const handleSolvePuzzle = () => {
    const boardToSolve = board.map(row => [...row]);

    if (isManualInputMode) {
      setManualPuzzleInitialState(board.map(row => [...row]));
    }

    if (solveSudoku(boardToSolve)) {
      setBoard(boardToSolve);
      setConflictingCells([]);
      setOverallFeedbackMessage('Puzzle solved!');
    } else {
      setOverallFeedbackMessage('Could not solve the current board.');
    }
  };

  const handleCheckSolution = () => {
    let isCorrect = true;
    let isComplete = true;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) {
          isComplete = false;
        }
        if (board[r][c] !== solution[r][c]) {
          isCorrect = false;
          break;
        }
      }
      if (!isCorrect) break;
    }

    if (isComplete && isCorrect) {
      setOverallFeedbackMessage('Congratulations! Your solution is correct!');
      setConflictingCells([]);
    } else if (!isComplete && isCorrect) {
      setOverallFeedbackMessage('So far so good! Keep going, some cells are still empty.');
    } else {
      setOverallFeedbackMessage('Not quite right. Review your entries!');
    }
  };

  const handleHint = () => {
    if (solution.flat().every(cell => cell === 0)) {
      setOverallFeedbackMessage('Please solve the puzzle first to get hints!');
      return;
    }

    const emptyCell = findNextEmptyCell(board);

    if (!emptyCell) {
      setOverallFeedbackMessage('No empty cells left! Puzzle is complete or waiting to be checked.');
      return;
    }

    const { row, col } = emptyCell;
    const hintValue = solution[row][col];

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = hintValue;
    setBoard(newBoard);

    setConflictingCells([]);
    setOverallFeedbackMessage(`Hint: Placed ${hintValue} at (${row + 1}, ${col + 1})`);
  };

  return (
    <div className="sudoku-board-container">
      <h2>Sudoku Challenge</h2>
      <div className="difficulty-selection">
        <label htmlFor="difficulty-select">Difficulty:</label>
        <select
          id="difficulty-select"
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button onClick={startNewGame}>Generate New Game</button>
      </div>

      {overallFeedbackMessage && <p className="overall-feedback-message">{overallFeedbackMessage}</p>}

      <div className="sudoku-grid">
        {board.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map((cellValue, colIndex) => {
              const isConflicting = conflictingCells.some(
                (conflict) => conflict.row === rowIndex && conflict.col === colIndex
              );

              return (
                <SudokuCell
                  key={`${rowIndex}-${colIndex}`}
                  value={cellValue}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  onCellChange={handleCellChange}
                  isConflict={isConflicting}
                  isPreFilled={
                    isManualInputMode
                      ? (manualPuzzleInitialState[rowIndex][colIndex] !== 0)
                      : (currentPuzzleData.puzzle[rowIndex][colIndex] !== 0)
                  }
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="game-actions">
        <button onClick={handleCheckSolution}>Check Solution</button>
        <button onClick={handleSolvePuzzle}>Solve Puzzle</button>
        <button className='reset-button' onClick={handleStartNewManualPuzzle}>Enter Manual Mode</button>
        <button onClick={handleHint} disabled={isManualInputMode && solution.flat().every(cell => cell === 0)}>Hint</button>
      </div>
    </div>
  );
};