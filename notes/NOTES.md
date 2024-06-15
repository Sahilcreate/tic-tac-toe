# Tic-Tac-Toe Game Development Log

## Requirements
* Minimal global code
* Utilization of factories, modules, and IIFE
* Console version first, followed by DOM version
* Each function performs a single task

## Initial Plan
### Console Version
1. Command input with `(row, column)` indices
2. Validate the move
3. Update the cell value based on the token ('X' or 'O')
4. Switch the current player
5. Print the board

Command >> Validate Move >> Update Value >> Switch Player >> Print Board

### Win Conditions
1. Rows: [0, 1, 2], [3, 4, 5], [6, 7, 8]
2. Columns: [0, 3, 6], [1, 4, 7], [2, 5, 8]
3. Diagonals: [0, 4, 8], [2, 4, 6]

### Tie Condition
* All cells are filled without a winner

## Development Log
### June 12, 2024
* Basic console version implemented without win and tie conditions.
* Fixed turn change issue on invalid moves by adding `validMove` in `playRound()`.

### June 13, 2024
* Added win and tie conditions to the console version.
* Started working on the DOM version with HTML/CSS.

### June 15, 2024
* Decide to avoid using IIFEs as `DOMContentLoaded` event handles initializatoin effectively
* Refactored code to pass cached DOM elements as arguments among function.
* Addressed issues with hover effects and event listeners stacking on restart.

## <p style="text-align: center;">Done for now...</p>
