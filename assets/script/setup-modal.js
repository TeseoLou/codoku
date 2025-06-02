/**
 * Close the setup modal when the Enter button is clicked
 */
function setupStartButton() {
    // Attach a click event handler to the Start button
    // Reference: https://stackoverflow.com/questions/61793029
    const startButton = document.getElementById("start-button");
    if (!startButton) {
        return;
    }
    startButton.addEventListener("click", function () {
        // Get the setup modal element
        const setupModal = $("#setup-modal");
        // Get the Bootstrap modal instance using jQuery wrapper for the setup modal
        // Reference: https://getbootstrap.com/docs/5.3/components/modal/#methods
        const setupModalBootstrap = bootstrap.Modal.getInstance(setupModal[0]);
    }
}