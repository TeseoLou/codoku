/**
 * Render a blank 9x9 Sudoku grid
 */
function renderEmptyGrid() {
    // Get the grid container
    const gridContainer = $('#grid');
    // Clear any existing content
    // Reference: https://stackoverflow.com/questions/1701973
    gridContainer.empty();
}

// Call function - Render a blank 9x9 Sudoku grid
renderEmptyGrid();