/**
 * Initialize all interactive features when the page loads
 */
// Reference: https://www.shecodes.io/athena/60837-how-to-call-a-function-within-another-function-in-javascript
function initPage() {
    setupThemeSwitch();
}

// Run everything once the page is fully loaded
// Reference: https://stackoverflow.com/questions/17567176
$(document).ready(() => {
    initPage();
});