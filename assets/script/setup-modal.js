/**
 * Handles the setup modal's "Start" button click event.
 * When clicked, this function closes the setup modal using Bootstrap’s modal instance
 * and then starts a new game session by resetting the board, stats, and timer.
 * This method ensures the player only begins the game after confirming their settings,
 * providing a clean and controlled transition into gameplay. jQuery is used here for 
 * consistency with other DOM manipulations across the codebase.
 */
function setupStartButton() {
    // Reference: https://stackoverflow.com/questions/61793029
    const startButton = document.getElementById("start-button");
    if (!startButton) {
        return;
    };
    startButton.addEventListener("click", function () {
        const setupModal = $("#setup-modal");
        // Reference: https://getbootstrap.com/docs/5.3/components/modal/#methods
        const setupModalBootstrap = bootstrap.Modal.getInstance(setupModal[0]);
        if (setupModalBootstrap) {
            // Reference: https://getbootstrap.com/docs/5.0/components/modal/#hide
            setupModalBootstrap.hide();
        };
        startNewGame();
    });
}