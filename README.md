# Sudoku Challenge: A React-Based Interactive Puzzle Game

This project is an interactive web application built with **React** and **TypeScript**, designed to provide a comprehensive Sudoku experience. It allows users to generate and play Sudoku puzzles at various difficulty levels, input and solve their own custom puzzles, and utilize helper features like hints and real-time conflict detection.

---

### My Development Process & Approach

My approach to building this Sudoku game was focused on a component-based architecture using **React** and ensuring type safety and maintainability with **TypeScript**. The primary goal was to create a highly interactive and user-friendly experience, prioritizing core gameplay mechanics and essential helper features before exploring more advanced functionalities.

1.  **Core Logic Foundation:** I started by implementing the fundamental Sudoku validation rules (`isValidPlacement`, `getConflictingCells`) and a backtracking algorithm (`solveSudoku`) to correctly solve puzzles. This foundation was critical for all subsequent features.
2.  **Puzzle Generation:** Building upon the solver, I developed a puzzle generator that creates unique, solvable Sudoku boards by strategically removing cells from a pre-solved grid and verifying uniqueness. Difficulty levels were introduced by controlling the number of removed cells.
3.  **Interactive UI & State Management:** The game board is rendered using individual `SudokuCell` components, each managing its own input. Centralized state (`board`, `solution`, `conflictingCells`, `overallFeedbackMessage`, `isManualInputMode`) in `SudokuBoard` (the parent component) ensures data consistency and drives the UI. I focused on using `useState` and `useEffect` effectively for reactive updates.
4.  **Enhancing User Experience (UX):** A significant part of the development focused on making the game intuitive. This included real-time conflict highlighting, clear feedback messages, and dynamic controls that adapt to the game state.
5.  **Manual Input Mode:** A key feature was enabling users to input their own puzzles. This required careful management of the board's "initial state" (user-entered numbers) versus the "current state" (user's attempts) to ensure correct validation and solving.

---

### Challenges Encountered & Solutions Implemented

Throughout the development of the Sudoku Challenge, I encountered several interesting challenges:

#### **1. Ensuring Unique Sudoku Puzzle Solutions**

* **Challenge:** When generating puzzles by removing numbers from a solved board, it's crucial that the resulting puzzle has only one unique solution. Randomly removing numbers can often lead to puzzles with multiple valid solutions, which isn't ideal for a classic Sudoku game.
* **Solution:** I implemented a `countSolutions` function that utilizes a modified backtracking algorithm. This function attempts to find all possible solutions for a given board and stops as soon as it finds more than one. If `countSolutions` returns anything other than `1` after removing a cell, that cell's original value is restored, ensuring the puzzle remains uniquely solvable.

#### **2. Synchronizing State and Conditional Logic for Manual Input Mode**

* **Challenge:** Differentiating between a pre-generated puzzle and a user-entered (manual) puzzle, especially concerning which cells are editable, when to show solution mismatches, and how hints should behave. Initially, `solutionMismatchConflicts` would appear immediately in manual mode, which was incorrect as there was no solution to compare against yet.
* **Solution:**
    * Introduced an `isManualInputMode` state to control the application's behavior.
    * The `solution` state is explicitly cleared (set to an empty board) when entering manual input mode, preventing premature solution mismatch conflicts.
    * The `isPreFilled` property for `SudokuCell` was made conditional based on `isManualInputMode` and a new `manualPuzzleInitialState` (which stores the numbers the user *initially* types in manual mode).
    * When the user clicks "Solve Puzzle" in manual mode, the `manualPuzzleInitialState` is updated to reflect their entries, and the `solution` state is populated with the solved version, enabling solution mismatch feedback and hints thereafter.

#### **3. Dynamic Enabling/Disabling of UI Controls**

* **Challenge:** Buttons like "Hint" and "Check Solution" should only be clickable when their functionality is actually possible (e.g., you can't get a hint if the puzzle hasn't been solved yet, or if you're inputting a manual puzzle that hasn't been solved).
* **Solution:** I implemented conditional `disabled` attributes on the buttons in the JSX. For the "Hint" button, it's disabled if `isManualInputMode` is true AND the `solution` state is currently empty (all zeros). This ensures hints are only available when a reference solution exists. A similar check was applied to "Check Solution."

---

### Key Features (Current State)

* **Difficulty Selection:** Choose from Easy, Medium, or Hard puzzles.
* **Generate New Game:** Creates a fresh, unique Sudoku puzzle.
* **Interactive Grid:** Click and type numbers into cells.
* **Real-time Validation:** Highlights invalid entries instantly.
* **Manual Puzzle Mode:** Enter your own puzzles for solving.
* **Solve Puzzle:** Auto-solves the current board.
* **Check Solution:** Provides feedback on your progress and correctness.
* **Hint System:** Get assistance for the next step.

---

### Getting Started

To run this project locally, follow these steps:

#### Prerequisites

* **Node.js** (LTS version recommended) - Includes npm (Node Package Manager).
    * You can download it from [nodejs.org](https://nodejs.org/).
* **npm** (Node Package Manager) or **Yarn** (if you prefer).

#### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/MohammadAliJa/navybits-sudoku-challenge
    cd navybits-sudoku-challenge
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

#### Running the Application

```bash
npm run dev
