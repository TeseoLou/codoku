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
            rowDiv.append(cell); // Add cell to current row
            // Join rows together
            // Reference: https://stackoverflow.com/questions/19058606
            // Add the current cell to the row
            gridContainer.append(rowDiv);
        }
    }
}

// Call function - Render a blank 9x9 Sudoku grid
renderEmptyGrid();