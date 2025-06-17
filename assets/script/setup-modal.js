/**
 * Close the setup modal when the Enter button is clicked
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