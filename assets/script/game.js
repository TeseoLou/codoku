// Global Declarations
// API key used to access the puzzle generator service
const API_KEY = '6nP4AYB9ImbH8hd6Zl79tg==iJV6BjdAY08uPpZU';
// Stores the correct solution grid returned by the API
let currentSolution = null;
// Tracks the currently selected cell in the grid 
let selectedCell = null;
// Holds the interval ID for the countdown timer
let countdownInterval = null;
// Time remaining for the current game in seconds
let timeRemaining = 0;

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
            };
            // Add thicker bottom border every third row except last row
            if ((row + 1) % 3 === 0 && row < 8) {
                cell.addClass('bottom-border'); // Custom class to thicken border
            };
            // Hide top border for first row
            if (row === 0) {
                cell.addClass('no-border-top');
            };
            // Hide left border for first column
            if (col === 0) {
                cell.addClass('no-border-left');
            };
            // Hide bottom border for last row
            if (row === 8) {
                cell.addClass('no-border-bottom');
            };
            // Hide right border for last column
            if (col === 8) {
                cell.addClass('no-border-right');
            };
            // Join cells together
            // Reference: https://stackoverflow.com/questions/19058606
            // Add the current cell to the row
            rowDiv.append(cell);
        };
        // Once the row is built, add it to the main grid
        gridContainer.append(rowDiv);
    };
};

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
        // Get respective puzzle position
        // Reference: https://www.freecodecamp.org/news/javascript-2d-arrays/
        const cellValue = puzzleData[rowIndex][colIndex];
        // Give cells different styling classes based on datatype
        // Add value to the cell if datatype is not null
        // Reference: https://codedamn.com/news/javascript/check-if-undefined-null
        if (cellValue !== null) {
            // Set a fixed cell value
            this.textContent = cellValue;
            // Make the fixed cell value stand out
            this.classList.add('fw-bold', 'generated');
            // Set value to an empty string if datatype is null
        } else {
            // Clear the cell and mark it as user-editable
            this.textContent = '';
            // Add editable class to cell
            this.classList.add('editable');
            // Show interactivity
            this.style.cursor = 'pointer';
        };
    });
    // Call function - Allow interactivity with editable grid cells with clicking or typing
    enableCellSelection();
};

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
        contentType: 'application/json',
        // Request Success
        success: function (result) {
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
        // Request failure
        error: function (response) {
            // Show a message in the console to show failure
            console.error('Failed to retrieve puzzle data:', response?.responseText || 'No response text available');
        }
    });
};

/**
 * Allow interactivity with editable grid cells with clicking or typing
 */
function enableCellSelection() {
    // Make each editable cell selectable
    // Reference: https://stackoverflow.com/questions/47168607
    $('.editable').each(function () {
        // Reference: https://datatables.net/forums/discussion/59126/how-to-remove-selected-class-of-row-when-clicking-outside-of-row
        $(this).on('click', function () {
            // Deselect cells that were previously selected
            if (selectedCell) {
                $(selectedCell).removeClass('selected');
            }
            // Add selected class to clicked cell
            selectedCell = this;
            $(selectedCell).addClass('selected');
        });
    });
    // Handle keyboard number and deletion interactions
    $(document).on('keydown', function (event) {
        // Prevent interaction if no cell is currently selected to ensure we only proceed if a cell has been clicked
        if (!selectedCell) {
            return;
        };
        // Check if the selected cell has the 'editable' class allowing to lock the cells with original game values
        // Reference: https://api.jquery.com/hasClass/
        const isAllowed = $(selectedCell).hasClass('editable');
        // If the selected cell is not editable, exit function
        if (!isAllowed) {
            return;
        };
        // Accept numbers between 1-9
        // Reference: https://stackoverflow.com/questions/38955573
        if (event.key >= '1' && event.key <= '9') {
            // Set the content of the selected cell to the number key pressed by the user
            // Reference: https://iamhuzaifa.medium.com/keyboard-event-codes-javascript-project-aec43bb7bf79
            selectedCell.textContent = event.key;
            // Get rid of previous incorrect color
            $(selectedCell).removeClass('incorrect');
        }
        // Allow backspace or delete
        // Reference: https://stackoverflow.com/questions/1116244
        else if (event.key === 'Backspace' || event.key === 'Delete') {
            // Clear the content of the selected cell by setting it to an empty string which removes previously entered numbers
            // Reference: https://dev.to/javascript_jeep/how-to-empty-the-dom-element-in-javascript-nf8
            selectedCell.textContent = '';
            // Remove incorrect color if it is present
            $(selectedCell).removeClass('incorrect');
        };
    });
    // Handle clicks on on-screen number tiles
    $('#numbers-container h2').each(function () {
        // // Attach a click event listener to the current element
        $(this).on('click', function () {
            // Prevent interaction if no cell is currently selected to ensure we only proceed if a cell has been clicked or the selected cell is not editable
            if (!selectedCell || !$(selectedCell).hasClass('editable')) {
                return;
            };
            // Get the text content of the clicked on-screen number tile
            // Reference: https://www.tutorialrepublic.com/jquery-tutorial/jquery-getter-and-setter.php
            const val = $(this).text();
            // Set the selected cell’s content based on the clicked tile value using ternary operator
            // Reference: https://forum.freecodecamp.org/t/need-help-on-step-70-javascript/695562
            selectedCell.textContent = val === 'X' ? '' : val;
            // Remove incorrect color if it is present
            $(selectedCell).removeClass('incorrect');
        });
    });
};

/**
 * Compare the user's current inputs against the correct solution
 */
function checkUserInput() {
    // If the solution hasn't been loaded yet skip the check
    if (!currentSolution) {
        return;
    };
    // Loop through each editable cell to compare input with the correct value
    // Reference: https://stackoverflow.com/questions/47168607
    $('.editable').each(function () {
        const cell = $(this);
        // Retrieves the 'data-row' and 'data-col' attributes from the current cell, which indicate its position in the grid and parseInt converts these string values to integers
        // Reference: https://stackoverflow.com/questions/34067985
        const rowIndex = parseInt(cell.data('row'));
        const colIndex = parseInt(cell.data('col'));
        // Finds the correct value from the currentSolution array based on the cell's row and column indices
        // Reference: https://www.freecodecamp.org/news/javascript-2d-arrays/
        const expected = currentSolution[rowIndex][colIndex];
        // Gets the text input of the cell and removes any whitespace
        // Reference: https://stackoverflow.com/questions/33682536
        const entered = cell.text().trim();
        // Clear incorrect state if cell is blank or correct
        // Reference: https://www.freecodecamp.org/news/javascript-if-else-and-if-then-js-conditional-statements
        if (entered === "" || entered === String(expected)) {
            // If the cell is empty or the entered value matches the expected value the 'incorrect' class will be removed
            cell.removeClass('incorrect');
        } else {
            // If the entered value does not match the expected value, the 'incorrect' class is added
            cell.addClass('incorrect');
        };
    });
};

/**
 * Pick one empty cell and show its correct number from the solution
 */
function revealHint() {
    // Exit if there is no solution
    if (!currentSolution) {
        return;
    }
    // Identify all cells in the grid that are empty and creates an empty array to store references to empty cells
    const blanks = [];
    // Iterates through all editable cells
    // Reference: https://stackoverflow.com/questions/47168607
    $('.editable').each(function () {
        // Gather cell text content
        // Reference: https://stackoverflow.com/questions/33682536
        const value = $(this).text().trim();
        // If a cell is empty it is added to the blanks array
        if (value.length === 0) {
            blanks.push(this);
        }
    });
    // Stop if there are no empty cells are left
    if (blanks.length === 0) {
        return;
    };
    // Randomly select one of the empty cells
    // Reference: https://timonweb.com/javascript/how-to-get-a-random-value-from-a-javascript-array/
    const pick = blanks[Math.floor(Math.random() * blanks.length)];
    const cell = $(pick);
    // Retrieve the row and column indices from the cell's data attributes and parseInt ensures the values are treated as base-10 integers
    // Reference: https://stackoverflow.com/questions/34067985
    // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
    const y = parseInt(cell.data('row'), 10);
    const x = parseInt(cell.data('col'), 10);
    // Use the row and column indices to access the correct answer from the solution array
    // Reference: https://www.freecodecamp.org/news/javascript-2d-arrays/
    const answer = currentSolution[y][x];
    // Populate corresponding cell with the correct answer and apply hint styling
    cell.text(answer);
    cell.addClass('hinted').removeClass('incorrect');
}

/**
 * Initiates a countdown timer corresponding with the time limit set by the user
 */
function startTimer() {
}

/**
 * Checks whether all editable cells have the correct solution values and returns true if the entire board is filled and correct
 */
function isBoardCompleteAndCorrect() {
    // Exit if currentSolution is falsy meaning games solution data is not loaded or theres no valid reference to the answer grid
    if (!currentSolution) {
        return false;
    };
    // Selects all elements with the class .editable then converts all into an array and checks if every cell matches the correct value
    // Reference: https://api.jquery.com/toArray/
    // Reference: https://www.geeksforgeeks.org/javascript-array-every-method/
    const allCorrect = $('.editable').toArray().every(cell => {
        // Retrieves 'data-row' and 'data-col' attributes from each cell and changes them to integers
        // Reference: https://stackoverflow.com/questions/34067985
        // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
        const rowIndex = parseInt(cell.dataset.row, 10);
        const colIndex = parseInt(cell.dataset.col, 10);
        // Finds the correct solution value from the 2D currentSolution array and converts it to a string for comparison
        // https://www.freecodecamp.org/news/javascript-2d-arrays/
        const expected = String(currentSolution[rowIndex][colIndex]);
        // Retrieves the current text inside the cell and removes whitespace
        // Reference: https://stackoverflow.com/questions/33682536
        const input = cell.textContent.trim();
        // Compares the user input to the expected value and returns true if they match
        return input === expected;
    });
    // The function returns true if all editable cells are correct and false otherwise
    return allCorrect;
};

/**
 * Checks if every editable cell on the board has some value entered
 */
function isBoardFilled() {
    // Grab all editable cells and make an array
    // Reference: https://api.jquery.com/toArray/
    const editableCells = $('.editable').toArray();
    // Go through array and it is filled with numbers
    // Reference: https://www.geeksforgeeks.org/javascript-array-every-method/
    const allFilled = editableCells.every(cell => {
        // Remove whitespace from cells content
        // Reference: https://stackoverflow.com/questions/33682536
        const value = cell.textContent.trim();
        // If the trimmed value is not an empty string the cell is considered filled and will return true only if this condition is true for every cell
        return value !== '';
    });
    // The function returns true if all editable cells are filled and returns false if one or more cells are empty
    return allFilled;
}

/**
 * Checks if the board is complete and correct
 */
function triggerAutoWinCheck() {
}

/**
 * Ends the game when the timer runs out, disables input, and shows the setup modal
 */
function endGameDueToTime() {

}

/**
 * Start a game by providing a fresh board, resetting stats, and resetting the timer and game stats.
 */
// Reference: https://www.shecodes.io/athena/60837-how-to-call-a-function-within-another-function-in-javascript
function startNewGame() {
    // Call function - Create a new Sudoku board + solution from API Ninjas according to difficulty level chosen by the user
    fetchSudokuBoard();
};

/**
 * Sets up button event listeners 
 */
document.addEventListener('DOMContentLoaded', function () {
    // Handle the Check button click
    const checkButton = $('#check-button');
    // Checks whether the button exists in the DOM
    // Reference: https://dev.to/lavary/how-to-check-if-an-element-exists-in-javascript-with-examples-4mpb#:~:text=So%20to%20check%20if%20the,ll%20get%20a%20null%20value
    if (checkButton.length) {
        // Adds a click event listener
        // Reference: https://stackoverflow.com/questions/66144270
        checkButton.on('click', () => {
            // Executes function and plays a sound 
            setTimeout(() => {
                // Call function - Compare the user's current inputs against the correct solution
                checkUserInput();
            }, 10); // After a short 10ms delay
        });
    };
    // Handle the Hint button click
    const hintButton = $('#hint-button');
    // Checks whether the button exists in the DOM
    // Reference: https://dev.to/lavary/how-to-check-if-an-element-exists-in-javascript-with-examples-4mpb#:~:text=So%20to%20check%20if%20the,ll%20get%20a%20null%20value
    if (hintButton.length) {
        // Adds a click event listener
        // Reference: https://stackoverflow.com/questions/66144270
        hintButton.on('click', () => {
            setTimeout(() => {
                // Call function - Pick one empty cell and show its correct number from the solution
                revealHint();
            }, 10); // After a short 10ms delay
        });
    }
});

// Call function - Render a blank 9x9 Sudoku grid
$(document).ready(() => {
    renderEmptyGrid();
});