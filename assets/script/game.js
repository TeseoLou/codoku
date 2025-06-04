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
 * Use generated sudoku grid from API Ninjas to put cell number values in board
 */
function populateGrid(puzzleData) {
    // Go through cells with data-row attribute
    // Reference: https://stackoverflow.com/questions/4958081
    $('[data-row]').each(function () {
        // Retrieve row and col attributes from each element and convert to numbers
        // Reference: https://stackoverflow.com/questions/76361204
        // Reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
        // Find vertical index
        const rowIndex = Number(this.dataset.row);
        // Find horizontal index
        const colIndex = Number(this.dataset.col);
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
    // Make GET request
    // Reference: https://www.youtube.com/watch?v=X51Ry-R5coQ
    $.ajax({
        method: 'GET',
        url: `https://api.api-ninjas.com/v1/sudokugenerate?difficulty=${selectedDifficulty}`,
        headers: { 'X-Api-Key': API_KEY },
        contentType: 'application/json',#
        success: function(result) {
            // Extract the puzzle and its solution from the API response
            // Reference: https://wesbos.com/destructuring-objects
            const { puzzle, solution } = result;
            // Save the correct solution
            currentSolution = solution;
            // Prepare a fresh grid
            renderEmptyGrid();
            // Put the cell values in the grid
            populateGrid(puzzle);        
        },
        error: function ajaxError(jqXHR) {
            // Show a message in the console to show failure
            console.error('Failed to retrieve puzzle data:', response?.responseText || 'No response text available');
        }
    });
}

// Call function - Render a blank 9x9 Sudoku grid
$(document).ready(() => {
    renderEmptyGrid();
});