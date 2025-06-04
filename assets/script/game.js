// Global Declarations
// API key used to access the puzzle generator service
const API_KEY = '6nP4AYB9ImbH8hd6Zl79tg==iJV6BjdAY08uPpZU';
// Stores the correct solution grid returned by the API
let currentSolution = null;

/**
 * Render a blank 9x9 Sudoku grid
 */
// Reference: https://www.geeksforgeeks.org/create-a-sudoku-puzzle-using-html-css-javascript/
function renderEmptyGrid() {
    // Get the grid container
    const gridContainer = $('#grid');
    // Clear any existing content
    // Reference: https://stackoverflow.com/questions/1701973
    gridContainer.empty();
    // Loop through each row index (0 to 8) to build 9 rows for the grid
    // Reference: https://teamtreehouse.com/community/create-an-interactive-grid-with-jquery?
    for (let row = 0; row < 9; row++) {
        // Create a row div with Bootstrap flex class
        const rowDiv = $('<div>').addClass('d-flex');
        // Nested for loop to build 9 columns for the grid
        for (let col = 0; col < 9; col++) {
            // Create a paragraph element which will act as a cell and add classes
            const cell = $('<p>')
                .addClass('m-0 text-center number select') // Styling classes
                .css({ width: '40px', height: '40px' }) // Fixed size
                .attr('data-row', row) // Store vertical position
                .attr('data-col', col); // Store horizontal position
            // Create board styling on cells
            // Reference: https://stackoverflow.com/questions/31231945
            // Add thicker right border every third column except the last one
            if ((col + 1) % 3 === 0 && col < 8) {
                cell.addClass('right-border'); // Custom class to thicken border
            }
            // Add thicker bottom border every third row except last row
            if ((row + 1) % 3 === 0 && row < 8) {
                cell.addClass('bottom-border'); // Custom class to thicken border
            }
            // Hide top border for first row
            if (row === 0) {
                cell.addClass('no-border-top');
            }
            // Hide left border for first column
            if (col === 0) {
                cell.addClass('no-border-left');
            }
            // Hide bottom border for last row
            if (row === 8) {
                cell.addClass('no-border-bottom');
            }
            // Hide right border for last column
            if (col === 8) {
                cell.addClass('no-border-right');
            }
            // Join cells together
            // Reference: https://stackoverflow.com/questions/19058606
            // Add the current cell to the row
            rowDiv.append(cell);
        }
        // Once the row is built, add it to the main grid
        gridContainer.append(rowDiv);
    }
}

/**
 * Create a new Sudoku board + solution from API Ninjas according to difficulty level chosen by the user
 */
// Reference: https://www.api-ninjas.com/api/sudoku
function fetchSudokuBoard() {
    // Get the value of the currently selected radio button for difficulty
    // Reference: https://stackoverflow.com/questions/15148659
    const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked').value;
}

// Call function - Render a blank 9x9 Sudoku grid
$(document).ready(() => {
    renderEmptyGrid();
});