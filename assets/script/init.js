/**
 * Shows a custom Bootstrap modal with a given message.
 * Placed at the top of init.js so it's available to all init-related logic, including early-stage checks like timer expiration or invalid board states.
 * Used instead of native alert boxes to give users feedback (e.g. errors, game events) in a more consistent and non-blocking way.
 * @param {string} message - The message to display in the modal.
 */
function showAlertModal(message) {
    $('#alert-modal-message').text(message);
    const modal = new bootstrap.Modal(document.getElementById('alert-modal'));
    modal.show();
}

/**
 * Initializes all interactive features once the DOM is ready.
 * Placed near the top of init.js to serve as the main entry point for UI setup.
 * Sets up theme toggle, sound preferences, modal buttons, and navbar behavior.
 * Also displays the setup modal to start the user experience.
 * This approach avoids scattered inline scripts or repetitive handlers by keeping all core UI logic in one place.
 */
// Reference: https://www.shecodes.io/athena/60837-how-to-call-a-function-within-another-function-in-javascript
function initPage() {
    setupOutsideNavbarCollapse();
    setupThemeSwitch();
    setupStartButton();
    setupSoundToggle();
    const setupModalElement = document.getElementById("setup-modal");
    if (setupModalElement) {
        // Reference: https://stackoverflow.com/questions/16152073
        const setupModal = new bootstrap.Modal(setupModalElement, {
            backdrop: 'static', 
            keyboard: false     
        });
        setupModal.show();
    }
}

// Run everything once the page is fully loaded
// This approach avoids timing issues that can happen with inline scripts
// Reference: https://stackoverflow.com/questions/17567176
$(document).ready(() => {
    initPage();
});
