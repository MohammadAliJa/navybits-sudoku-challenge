import React from 'react';
import '../styles/SudokuCell.scss';

interface SudokuCellProps {
  value: number;
  rowIndex: number;
  colIndex: number;
  onCellChange: (rowIndex: number, colIndex: number, value: number) => void;
  isConflict: boolean;
  isPreFilled: boolean; 
}

export const SudokuCell: React.FC<SudokuCellProps> = ({ value, rowIndex, colIndex, onCellChange, isConflict,
  isPreFilled }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isPreFilled) return;
    const inputValue = event.target.value;
    let newValue: number;

    if (inputValue === '') {
      newValue = 0;
    } else {
      const parsedValue = parseInt(inputValue, 10);
      if (isNaN(parsedValue) || parsedValue < 1 || parsedValue > 9) {
        newValue = value;
      } else {
        newValue = parsedValue;
      }
    }
    onCellChange(rowIndex, colIndex, newValue);
  };

  const blockClass = (rowIndex: number, colIndex: number) => {
    const rowGroup = Math.floor(rowIndex / 3);
    const colGroup = Math.floor(colIndex / 3);
    return (rowGroup + colGroup) % 2 === 0 ? 'block-even' : 'block-odd';
  };

  return (
    <input
      type="text"
      className={`sudoku-cell ${blockClass(rowIndex, colIndex)} ${isConflict ? 'conflict' : ''} ${isPreFilled ? 'pre-filled' : ''}`}
      value={value === 0 ? '' : value}
      onChange={handleChange}
      maxLength={1}
      pattern="[1-9]"
      readOnly={isPreFilled}
    />
  );
};