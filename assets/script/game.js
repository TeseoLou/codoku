/**
 * Render a blank 9x9 Sudoku grid
 */
function renderEmptyGrid() {
    // Get the grid container
    const gridContainer = $('#grid');
    // Clear any existing content
    // Reference: https://stackoverflow.com/questions/1701973
    gridContainer.empty();
    // Loop through each row index (0 to 8) to build 9 rows for the grid
    // Reference: https://teamtreehouse.com/community/create-an-interactive-grid-with-jquery?
    for (let row = 0; row < 9; row++) {

    }
}

// Call function - Render a blank 9x9 Sudoku grid
renderEmptyGrid();