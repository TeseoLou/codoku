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
 * Render a blank 9x9 Sudoku grid
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
 * Use generated sudoku grid from API Ninjas to put cell number values in board
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
 * Create a new Sudoku board + solution from API Ninjas according to difficulty level chosen by the user
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
        }
    });
};

/**
 * Allow interactivity with editable grid cells with clicking or typing
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
        };
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
 * Compare the user's current inputs against the correct solution
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
 * Pick one empty cell and show its correct number from the solution
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
 * Initiates a countdown timer corresponding with the time limit set by the user
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
 * Show difficulty level in game-stats
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
 * Show remaining time in game-stats
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
 * Displays the current number of hints used on the screen
 */
function updateHintsDisplay() {
    $('#hints').text(`Hints: ${hintsUsed}`);
}

/**
 * Checks whether all editable cells have the correct solution values and returns true if the entire board is filled and correct
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
 * Checks if every editable cell on the board has some value entered
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
 * Confetti animation when board is complete
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
 * Calculates and formats the time elapsed since the game started and will.
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
 * Checks if the board is complete and correct
 */
function triggerAutoWinCheck() {
    if (!hasCelebrated && isBoardCompleteAndCorrect()) {
        const hintedCount = $('.editable.hinted').length;
        const totalEditable = $('.editable').length;
        const unhintedCount = totalEditable - hintedCount;
        // Reference: https://api.jquery.com/length/
        const solvedWithHints = hintedCount > 0 && (hintedCount >= unhintedCount);
        if (solvedWithHints) {
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
        if (errorAudio) {
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
 * Ends the game when the timer runs out, disables input, and shows the setup modal
 */
function endGameDueToTime() {
    // Reference: https://stackoverflow.com/questions/21815323
    const alarmAudio = document.getElementById("alarm-sound");
    if (alarmAudio) {
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
 * Start a game by providing a fresh board, resetting stats, and resetting the timer and game stats.
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
 * Sets up button event listeners and sound triggers
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
        const setupModal = new bootstrap.Modal(document.getElementById("setup-modal"));
        setupModal.show();
        document.getElementById("setup-modal").addEventListener("shown.bs.modal", () => {
            startNewGame();
        }, { once: true });
    });

});

// Call function - Render a blank 9x9 Sudoku grid
$(document).ready(() => {
    renderEmptyGrid();
});