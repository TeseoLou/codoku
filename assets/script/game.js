// Global Declarations
// API key used to access the puzzle generator service
const API_KEY = '6nP4AYB9ImbH8hd6Zl79tg==iJV6BjdAY08uPpZU';
let currentSolution = null;
let selectedCell = null;
let countdownInterval = null;
let timeRemaining = 0;
let hintsUsed = 0;
let hasCelebrated = false;
// Reference: https://stackoverflow.com/questions/40100433
const soundEffects = {
    key: new Audio("assets/sounds/key.mp3"),
    tap: new Audio("assets/sounds/tap.mp3"),
    applause: new Audio("assets/sounds/applause.mp3"),
    page: new Audio("assets/sounds/page.mp3"),
    hint: new Audio("assets/sounds/hint.mp3"),
    // Reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement
    play(name) {
        const sound = this[name];
        if (isSoundEnabled && sound) {
            sound.currentTime = 0;
            sound.play();
        }
    }
};

/**
 * Creates and renders a clean 9x9 Sudoku grid inside the #grid container.
 * Dynamically generates a row of 9 <p> elements per row, each marked with 
 * data attributes for its position. Classes are applied to style the grid 
 * structure visually, including thicker borders for 3x3 boxes.
 * This approach avoids hardcoded HTML, makes it easy to reset or rebuild
 * the board on new game start, and keeps the layout modular and flexible.
 * Used before populating the grid with puzzle data from the API.
 */

// Reference: https://www.geeksforgeeks.org/create-a-sudoku-puzzle-using-html-css-javascript/
function renderEmptyGrid() {
    const gridContainer = $('#grid');
    // Reference: https://stackoverflow.com/questions/1701973
    gridContainer.empty();
    // Reference: https://teamtreehouse.com/community/create-an-interactive-grid-with-jquery?
    for (let row = 0; row < 9; row++) {
        const rowDiv = $('<div>').addClass('d-flex');
        for (let col = 0; col < 9; col++) {
            const cell = $('<p>')
                .addClass('m-0 text-center number select')
                .attr('data-row', row)
                .attr('data-col', col);
            // Reference: https://stackoverflow.com/questions/31231945
            if ((col + 1) % 3 === 0 && col < 8) {
                cell.addClass('right-border');
            };
            if ((row + 1) % 3 === 0 && row < 8) {
                cell.addClass('bottom-border');
            };
            if (row === 0) {
                cell.addClass('no-border-top');
            };
            if (col === 0) {
                cell.addClass('no-border-left');
            };
            if (row === 8) {
                cell.addClass('no-border-bottom');
            };
            if (col === 8) {
                cell.addClass('no-border-right');
            };
            // Reference: https://stackoverflow.com/questions/19058606
            rowDiv.append(cell);
        };
        gridContainer.append(rowDiv);
    };
};

/**
 * Fills the grid with values from the API-generated puzzle data.
 * Loops through each cell using its row and column data attributes,
 * placing the correct number where provided. Fixed numbers are styled 
 * as bold and locked, while empty cells are made editable for user input.
 * Keeps the grid dynamic and easy to repopulate on each new game.
 * Also triggers cell interactivity setup so players can start interacting
 * with the puzzle immediately.
 */
function populateGrid(puzzleData) {
    // Reference: https://stackoverflow.com/questions/4958081
    $('[data-row]').each(function () {
        // Reference: https://stackoverflow.com/questions/76361204
        // Reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
        const rowIndex = Number(this.dataset.row);
        const colIndex = Number(this.dataset.col);
        // Reference: https://www.freecodecamp.org/news/javascript-2d-arrays/
        const cellValue = puzzleData[rowIndex][colIndex];
        // Reference: https://codedamn.com/news/javascript/check-if-undefined-null
        if (cellValue !== null) {
            this.textContent = cellValue;
            this.classList.add('fw-bold', 'generated');
        } else {
            this.textContent = '';
            this.classList.add('editable');
            this.style.cursor = 'pointer';
        };
    });
    enableCellSelection();
};

/**
 * Fetches a new Sudoku puzzle and solution from the API based on user-selected difficulty.
 * Sends a GET request to the API Ninjas Sudoku endpoint using the selected difficulty.
 * On success, stores the solution for future validation, then renders a fresh grid
 * and populates it with the puzzle data.
 * This keeps the game fully dynamic, allowing new puzzles to be generated 
 * on demand without hardcoding any layouts. Also ensures consistency between
 * the rendered puzzle and its solution for accurate checking later.
 */
// Reference: https://www.api-ninjas.com/api/sudoku
function fetchSudokuBoard() {
    // Reference: https://stackoverflow.com/questions/15148659
    const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked').value;
    // Reference: https://www.youtube.com/watch?v=X51Ry-R5coQ
    $.ajax({
        method: 'GET',
        url: `https://api.api-ninjas.com/v1/sudokugenerate?difficulty=${selectedDifficulty}`,
        headers: { 'X-Api-Key': API_KEY },
        contentType: 'application/json',
        success: function (result) {
            // Reference: https://wesbos.com/destructuring-objects
            const { puzzle, solution } = result;
            currentSolution = solution;
            renderEmptyGrid();
            populateGrid(puzzle);
        },
        error: function (response) {
            console.error('Failed to retrieve puzzle data:', response?.responseText || 'No response text available');
            showAlertModal("❌ Could not fetch a new puzzle. Please check your internet connection or try again later.");
        }
    });
};

/**
 * Enables interaction with user-editable cells via clicks, keyboard input, and number buttons.
 * Clicking a cell highlights it as the active selection. Users can then type numbers 1–9 or use 
 * on-screen keys to fill it in. Backspace/Delete clears the content. 
 * Interactions are restricted to cells marked as editable to prevent tampering with fixed puzzle values.
 * This modular setup keeps the input system flexible, supports real-time error highlighting, 
 * and triggers auto-win checks after every valid input. Also integrates tap and key sound effects
 * to enhance feedback.
 */
function enableCellSelection() {
    // Reference: https://stackoverflow.com/questions/47168607
    $('.editable').each(function () {
        // Reference: https://datatables.net/forums/discussion/59126/how-to-remove-selected-class-of-row-when-clicking-outside-of-row
        $(this).on('click', function () {
            if (selectedCell) {
                $(selectedCell).removeClass('selected');
            }
            selectedCell = this;
            $(selectedCell).addClass('selected');
            soundEffects.play("tap");
        });
    });
    $(document).on('keydown', function (event) {
        if (!selectedCell) {
            return;
        };
        // Reference: https://api.jquery.com/hasClass/
        const isAllowed = $(selectedCell).hasClass('editable');
        if (!isAllowed) {
            return;
        };
        // Reference: https://stackoverflow.com/questions/38955573
        if (event.key >= '1' && event.key <= '9') {
            // Reference: https://iamhuzaifa.medium.com/keyboard-event-codes-javascript-project-aec43bb7bf79
            selectedCell.textContent = event.key;
            $(selectedCell).removeClass('incorrect');
            triggerAutoWinCheck();
            soundEffects.play("key");
        }
        // Reference: https://stackoverflow.com/questions/1116244
        else if (event.key === 'Backspace' || event.key === 'Delete') {
            // Reference: https://dev.to/javascript_jeep/how-to-empty-the-dom-element-in-javascript-nf8
            selectedCell.textContent = '';
            $(selectedCell).removeClass('incorrect');
            soundEffects.play("key");
        } else {
            event.preventDefault();
        }
    });
    $('#numbers-container h2').each(function () {
        $(this).on('click', function () {
            if (!selectedCell || !$(selectedCell).hasClass('editable')) {
                return;
            };
            // Reference: https://www.tutorialrepublic.com/jquery-tutorial/jquery-getter-and-setter.php
            const val = $(this).text();
            // Reference: https://forum.freecodecamp.org/t/need-help-on-step-70-javascript/695562
            selectedCell.textContent = val === 'X' ? '' : val;
            $(selectedCell).removeClass('incorrect');
            triggerAutoWinCheck();
            soundEffects.play("key");
        });
    });
};

/**
 * Compares the player's current input with the solution and highlights any incorrect entries.
 * Loops through all editable cells and checks each value against the correct answer.
 * Incorrect inputs are visually marked to guide the player without revealing the solution.
 * Increments the hint counter and updates the hint display to track usage.
 * This feedback system helps users learn through trial and error,
 * without penalizing empty cells or prematurely ending the game.
 */
function checkUserInput() {
    hintsUsed++;
    updateHintsDisplay();
    if (!currentSolution) {
        return;
    };
    // Reference: https://stackoverflow.com/questions/47168607
    $('.editable').each(function () {
        const cell = $(this);
        // Reference: https://stackoverflow.com/questions/34067985
        const rowIndex = parseInt(cell.data('row'));
        const colIndex = parseInt(cell.data('col'));
        // Reference: https://www.freecodecamp.org/news/javascript-2d-arrays/
        const expected = currentSolution[rowIndex][colIndex];
        // Reference: https://stackoverflow.com/questions/33682536
        const entered = cell.text().trim();
        // Reference: https://www.freecodecamp.org/news/javascript-if-else-and-if-then-js-conditional-statements
        if (entered === "" || entered === String(expected)) {
            cell.removeClass('incorrect');
        } else {
            cell.addClass('incorrect');
        };
    });
};

/**
 * Reveals the correct number in a random empty cell as a hint.
 * Scans all editable cells for blanks, picks one at random, and fills it 
 * with the correct value from the solution. Marks the cell as 'hinted' for 
 * tracking and visual feedback.
 * This helps users when stuck, supports gradual problem-solving, 
 * and integrates with win condition logic that tracks hint usage.
 */
function revealHint() {
    hintsUsed++;
    updateHintsDisplay();
    if (!currentSolution) {
        return;
    }
    const blanks = [];
    // Reference: https://stackoverflow.com/questions/47168607
    $('.editable').each(function () {
        // Reference: https://stackoverflow.com/questions/33682536
        const value = $(this).text().trim();
        if (value.length === 0) {
            blanks.push(this);
        }
    });
    if (blanks.length === 0) {
        return;
    };
    // Reference: https://timonweb.com/javascript/how-to-get-a-random-value-from-a-javascript-array/
    const pick = blanks[Math.floor(Math.random() * blanks.length)];
    const cell = $(pick);
    // Reference: https://stackoverflow.com/questions/34067985
    // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
    const y = parseInt(cell.data('row'), 10);
    const x = parseInt(cell.data('col'), 10);
    // Reference: https://www.freecodecamp.org/news/javascript-2d-arrays/
    const answer = currentSolution[y][x];
    cell.text(answer);
    cell.addClass('hinted').removeClass('incorrect');
}

/**
 * Starts the countdown timer based on the time limit selected by the user.
 * Converts the selected time into seconds and updates the timer display every second.
 * If "None" is selected, the timer is disabled. Automatically ends the game
 * and triggers a modal when time runs out.
 * Uses setInterval for consistent timing and clears any previous intervals 
 * to avoid duplicate timers. Tightly integrated with visual feedback and 
 * the timed game mode logic.
 */
function startTimer() {
    // Reference: https://stackoverflow.com/questions/15148659
    const timeLimit = $('input[name="time"]:checked').val();
    // Reference: https://stackoverflow.com/questions/57860947
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null; // Clear the interval reference
    }
    if (timeLimit === "none") {
        timeRemaining = 0;
        $('#timer').text("Timer: None");
        return;
    }
    // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
    let minutes = parseInt(timeLimit, 10);
    timeRemaining = minutes * 60;
    updateTimerDisplay();
    // Reference: https://vaidehijoshi.github.io/blog/2015/01/06/the-final-countdown-using-javascripts-setinterval-plus-clearinterval-methods/
    countdownInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        if (timeRemaining <= 0) {
            // Reference: https://stackoverflow.com/questions/57860947
            clearInterval(countdownInterval);
            countdownInterval = null;
            endGameDueToTime();
        }
    }, 1000);
}

/**
 * Updates the on-screen difficulty label to reflect the user’s selected level.
 * Reads the currently checked radio button and pulls the label text from its sibling element.
 * This keeps the UI in sync with the user’s game setup and provides immediate visual feedback
 * in the stats panel.
 * Keeps things dynamic without hardcoding label values or duplicating logic.
 */
function updateDifficultyDisplay() {
    // Reference: https://stackoverflow.com/questions/15148659
    const difficultyLevel = $('input[name="difficulty"]:checked').get(0);
    if (difficultyLevel) {
        // Reference: https://accreditly.io/articles/how-to-get-the-sibling-or-next-element-in-javascript
        const level = difficultyLevel.nextElementSibling.textContent;
        $('#difficulty').text(`Difficulty: ${level}`);
    };
};

/**
 * Updates the timer display in the game stats area with the current countdown value.
 * Converts total remaining time in seconds to a MM:SS format for clarity.
 * Ensures single-digit seconds are padded with a leading zero for consistency.
 * Called once per second by the countdown interval to give players real-time
 * feedback on how much time they have left.
 */
function updateTimerDisplay() {
    // Reference: https://stackoverflow.com/questions/3733227
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    // Reference: https://stackoverflow.com/questions/8043026/how-to-format-numbers-by-prepending-0-to-single-digit-numbers
    const reformattedSeconds = seconds.toString().padStart(2, '0');
    // Reference: https://stackoverflow.com/questions/59747815
    $('#timer').text(`Timer: ${minutes}:${reformattedSeconds}`);
};

/**
 * Updates the hint counter in the game stats to show how many hints the player has used.
 * Called whenever a hint is revealed or the board is checked, so players can
 * keep track of how often they rely on help. Useful for feedback and post-game summaries.
 */
function updateHintsDisplay() {
    $('#hints').text(`Hints: ${hintsUsed}`);
}

/**
 * Validates whether all editable cells contain the correct values from the solution.
 * Loops through each cell marked editable and compares its content against the
 * corresponding entry in the current solution array. Returns true only if the entire
 * board is correctly filled, otherwise false.
 * Used as a trigger condition for winning the game, and works closely with
 * `triggerAutoWinCheck()` to handle end-of-game logic.
 */
function isBoardCompleteAndCorrect() {
    if (!currentSolution) {
        return false;
    };
    // Reference: https://api.jquery.com/toArray/
    // Reference: https://www.geeksforgeeks.org/javascript-array-every-method/
    const allCorrect = $('.editable').toArray().every(cell => {
        // Reference: https://stackoverflow.com/questions/34067985
        // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
        const rowIndex = parseInt(cell.dataset.row, 10);
        const colIndex = parseInt(cell.dataset.col, 10);
        // https://www.freecodecamp.org/news/javascript-2d-arrays/
        const expected = String(currentSolution[rowIndex][colIndex]);
        // Reference: https://stackoverflow.com/questions/33682536
        const input = cell.textContent.trim();
        return input === expected;
    });
    return allCorrect;
};

/**
 * Checks whether every editable cell has some input, regardless of correctness.
 * Useful for detecting when a player has filled the entire board, which then
 * triggers a final correctness check. Complements `isBoardCompleteAndCorrect()` 
 * as part of the game's win detection logic.
 * Helps prevent premature victory prompts by confirming the board is visually complete first.
 */
function isBoardFilled() {
    // Reference: https://api.jquery.com/toArray/
    const editableCells = $('.editable').toArray();
    // Reference: https://www.geeksforgeeks.org/javascript-array-every-method/
    const allFilled = editableCells.every(cell => {
        // Reference: https://stackoverflow.com/questions/33682536
        const value = cell.textContent.trim();
        return value !== '';
    });
    return allFilled;
};

/**
 * Triggers a confetti animation to celebrate the player completing the puzzle.
 * Adds visual animation and positive feedback when the player successfully solves
 * the board without relying too heavily on hints. Typically called by the
 * win-check logic in `triggerAutoWinCheck()`.
 */
function popConfetti() {
    // Reference: https://www.kirilv.com/canvas-confetti/
    confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 }
    });
};

/**
 * Calculates and formats how much time has passed since the game started.
 * Used to display the final time in the "Congratulations" modal.
 * Accounts for games with and without timers, formatting the result
 * into a user-friendly MM:SS string or `--:--` if no timer was used.
 */
function formatElapsedTime() {
    // Reference: https://stackoverflow.com/questions/9618504
    const timeLimit = $('input[name="time"]:checked').val();
    const elapsed = timeLimit === 'none' ? 0 : parseInt(timeLimit, 10) * 60 - timeRemaining;
    // Reference: https://stackoverflow.com/questions/3733227
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    if (timeLimit === 'none') {
        return `--:--`;
    }
    // Reference: https://stackoverflow.com/questions/8043026
    else {
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
};

/**
 * Disables all user interaction with the Sudoku grid after puzzle completion.
 * This function targets all cells marked as 'editable' and:
 * - Removes the 'editable' class to prevent game logic from interacting with them
 * - Sets 'pointer-events: none' to block mouse interaction
 * - Adds 'aria-disabled="true"' for screen reader accessibility
 * - Sets 'tabindex="-1"' to remove keyboard focusability
 * Although `.prop('disabled', true)` is included for completeness, it has no effect 
 * on non-form elements like <p>. The ARIA and tabindex adjustments ensure 
 * that all users — including those using assistive technologies — 
 * are prevented from editing the puzzle once it's marked as complete.
 * Typically triggered when the user clicks "Admire Puzzle" after a win.
 */
function disablePuzzleInteraction() {
    $('.editable').each(function () {
        $(this)
            .removeClass('editable')
            .prop('disabled', true)                      
            .attr('aria-disabled', 'true')               
            .attr('tabindex', '-1')                      
            .css('pointer-events', 'none');              
    });
}

/**
 * Looks at the board state to find out if the player has won or made an error.
 * If the board is completely and correctly filled, it shows a congratulatory modal—
 * with a different version if the player relied heavily on hints. It stops the timer,
 * plays a sound, and displays final stats like difficulty, time, and hints used.
 * If the board is full but contains mistakes, it plays an error sound and displays a helpful modal.
 * This central check ensures the game reacts in real time to player progress, tying together
 * input validation, hint tracking, and win feedback.
 */
function triggerAutoWinCheck() {
    if (!hasCelebrated && isBoardCompleteAndCorrect()) {
        const hintedCount = $('.editable.hinted').length;
        const totalEditable = $('.editable').length;
        const unhintedCount = totalEditable - hintedCount;
        // Reference: https://api.jquery.com/length/
        const solvedWithHints = hintedCount > 0 && (hintedCount >= unhintedCount);
        if (solvedWithHints) {
            $('#hinted-difficulty').text($('input[name="difficulty"]:checked').next('label').text());
            $('#hinted-time').text(formatElapsedTime());
            $('#hinted-hints').text(hintsUsed);
            // Reference: https://getbootstrap.com/docs/5.3/components/modal/#via-javascript
            const hintedModal = new bootstrap.Modal(document.getElementById('hinted-win-modal'));
            hintedModal.show();
            hasCelebrated = true;
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
            return;
        }
        popConfetti();
        soundEffects.play("applause");
        hasCelebrated = true;
        if (countdownInterval) {
            clearInterval(countdownInterval);
        };
        const timeTaken = formatElapsedTime();
        // Reference: https://stackoverflow.com/questions/9618504
        const difficultyText = $('input[name="difficulty"]:checked').next('label').text();
        $('#congrats-difficulty').text(difficultyText);
        $('#congrats-time').text(timeTaken);
        $('#congrats-hints').text(hintsUsed);
        // Reference: https://getbootstrap.com/docs/5.3/components/modal/#via-javascript
        const congratsModal = new bootstrap.Modal(document.getElementById('congrats-modal'));
        congratsModal.show();
    }
    else if (isBoardFilled() && !isBoardCompleteAndCorrect()) {
        // Reference: https://getbootstrap.com/docs/5.3/components/modal/#via-javascript
        const errorAudio = document.getElementById("error-sound");
        if (isSoundEnabled && errorAudio) {
            // Reference: https://dev.to/pavelkeyzik/does-anyone-knows-how-to-change-current-time-of-song-correctly-in-javascript-2mkn
            errorAudio.currentTime = 0;
            errorAudio.play();
        };
        // Reference: https://stackoverflow.com/questions/65764348
        setTimeout(() => {
            showAlertModal("🔍 Try again! It looks like there's an error somewhere!");
        }, 100);
    }
}

/**
 * Handles the end-of-game scenario when the timer reaches zero.
 * Plays an alarm sound, displays a timeout alert modal, and disables
 * further interaction with the puzzle by removing 'editable' status 
 * and pointer events from all user-input cells.
 * Ensures the player can't continue entering values after time expires,
 * and provides immediate feedback to mark the game over clearly.
 */
function endGameDueToTime() {
    // Reference: https://stackoverflow.com/questions/21815323
    const alarmAudio = document.getElementById("alarm-sound");
    if (isSoundEnabled && alarmAudio) {
        // Reference: https://dev.to/pavelkeyzik/does-anyone-knows-how-to-change-current-time-of-song-correctly-in-javascript-2mkn
        alarmAudio.currentTime = 0;
        alarmAudio.play();
    };
    // Reference: https://stackoverflow.com/questions/65764348
    setTimeout(() => {
        showAlertModal("⏰ Time's up! Better luck next time.");
    }, 100);
    // https://stackoverflow.com/questions/47168607
    $('.editable').each(function () {
        $(this).removeClass('editable');
        // Reference: https://stackoverflow.com/questions/8906520
        $(this).css('pointer-events', 'none');
    });
};

/**
 * Starts a new game by generating a fresh board and resetting game state.
 * Fetches a new puzzle and solution, resets the hint counter, timer, and win flag,
 * and updates the UI to match the selected difficulty level.
 * Called when the player begins or restarts a game. Keeps all game logic modular 
 * and ensures a consistent, clean slate each time.
 */
// Reference: https://www.shecodes.io/athena/60837-how-to-call-a-function-within-another-function-in-javascript
function startNewGame() {
    fetchSudokuBoard();
    startTimer();
    updateDifficultyDisplay();
    hintsUsed = 0;
    updateHintsDisplay();
    hasCelebrated = false;
    document.getElementById('cancel-button').style.display = 'inline-block';
};

/**
 * Sets up all core event listeners once the DOM is fully loaded.
 * This function connects various UI controls to their corresponding game logic:
 * - "Check" button: Triggers input validation with a short delay and plays a sound.
 * - "Hint" button: Reveals a correct number in a random empty cell, checks for win conditions,
 *   and plays a sound.
 * - "New Game" buttons (from both win modals): Hides the modal and launches the setup modal.
 * - "OK" button (from alert modal):
 *     - If triggered by timeout ("Time's up!"), opens the setup modal with the cancel button hidden.
 *     - Otherwise, simply hides the alert without resetting the game.
 * - "Admire Puzzle" buttons (from both win types): Disables further interaction with the grid so 
 *   players can view the completed puzzle without modifying it.
 * All listeners are wrapped inside `DOMContentLoaded` to ensure DOM elements exist
 * before event binding. This centralizes event logic and ensures UI behavior remains modular, 
 * interactive, and consistent across game states.
 */
document.addEventListener('DOMContentLoaded', function () {
    const checkButton = $('#check-button');
    // Reference: https://dev.to/lavary/how-to-check-if-an-element-exists-in-javascript-with-examples-4mpb#:~:text=So%20to%20check%20if%20the,ll%20get%20a%20null%20value
    if (checkButton.length) {
        // Reference: https://stackoverflow.com/questions/66144270
        checkButton.on('click', () => {
            setTimeout(() => {
                checkUserInput();
                soundEffects.play("hint");
            }, 10);
        });
    };
    const hintButton = $('#hint-button');
    // Reference: https://dev.to/lavary/how-to-check-if-an-element-exists-in-javascript-with-examples-4mpb#:~:text=So%20to%20check%20if%20the,ll%20get%20a%20null%20value
    if (hintButton.length) {
        // Reference: https://stackoverflow.com/questions/66144270
        hintButton.on('click', () => {
            setTimeout(() => {
                revealHint();
                triggerAutoWinCheck();
                soundEffects.play("hint");
            }, 10);
        });
    };
    document.getElementById("congrats-new-game").addEventListener("click", function () {
        const congratsModalElement = document.getElementById("congrats-modal");
        const bsCongratsModal = bootstrap.Modal.getInstance(congratsModalElement);
        if (bsCongratsModal) {
            bsCongratsModal.hide();
        }
        const setupModal = new bootstrap.Modal(document.getElementById("setup-modal"));
        setupModal.show();
    });
    document.getElementById("completed-new-game").addEventListener("click", function () {
        const hintedWinModalElement = document.getElementById("hinted-win-modal");
        const bsHintedWinModal = bootstrap.Modal.getInstance(hintedWinModalElement);
        if (bsHintedWinModal) {
            bsHintedWinModal.hide();
        }
        const setupModal = new bootstrap.Modal(document.getElementById("setup-modal"));
        setupModal.show();
    });
    document.getElementById("ok-button").addEventListener("click", function () {
        const alertModalElement = document.getElementById("alert-modal");
        const bsAlertModal = bootstrap.Modal.getInstance(alertModalElement);
        if (bsAlertModal) {
            bsAlertModal.hide();
        }
        const message = document.getElementById("alert-modal-message").textContent;
        const isTimeout = message.includes("Time's up");
        if (isTimeout) {
            const setupModal = new bootstrap.Modal(document.getElementById("setup-modal"));
            const cancelButton = document.getElementById("cancel-button");
            if (cancelButton) {
                cancelButton.style.display = "none";
            }
            setupModal.show();
        }
    });
    document.getElementById("admire-button").addEventListener("click", () => {
        disablePuzzleInteraction();
    });
    document.getElementById("admire-button-hinted").addEventListener("click", () => {
        disablePuzzleInteraction();
    });
});

/**
 * Initializes the UI with an empty Sudoku grid once the DOM is fully loaded.
 * Ensures the board structure is rendered even before puzzle data is fetched.
 */
$(document).ready(() => {
    renderEmptyGrid();
});