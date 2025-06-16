/**
 * Display a custom Bootstrap alert modal with a message
 * @param {string} message - The message to display
 */
function showAlertModal(message) {
    $('#alert-modal-message').text(message);
    const modal = new bootstrap.Modal(document.getElementById('alert-modal'));
    modal.show();
}

/**
 * Initialize all interactive features when the page loads
 */
// Reference: https://www.shecodes.io/athena/60837-how-to-call-a-function-within-another-function-in-javascript
function initPage() {
    // Call function - Collapse the Bootstrap navbar when clicking outside of the open menu
    setupOutsideNavbarCollapse();
    // Call function - Setup the theme switch logic on page load and user interaction
    setupThemeSwitch();
    // Call function - Close the setup modal when the Enter button is clicked
    setupStartButton();
    setupSoundToggle();

    // ✅ Updated logic: show setup modal if it exists, regardless of URL path
    const setupModalElement = document.getElementById("setup-modal");
    if (setupModalElement) {
        // Create Bootstrap modal instance with optional config
        const setupModal = new bootstrap.Modal(setupModalElement, {
            backdrop: 'static', // Prevent clicking outside to close
            keyboard: false     // Prevent Esc key from closing
        });
        // Show the setup modal
        setupModal.show();
    }
}

// Run everything once the page is fully loaded
// Reference: https://stackoverflow.com/questions/17567176
$(document).ready(() => {
    initPage();
});
