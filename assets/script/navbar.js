// Navigation sound effects
// Object to store and control navigation sound effects
// Reference: https://stackoverflow.com/questions/40100433
const navSounds = {
    // Retrieve the sound object matching the given name from the themeToggleSounds object
    page: new Audio("assets/sounds/page.mp3"),
    // Method that plays a sound effect by name
    play(name) {
        // Retrieve the sound object matching the given name from the navSounds object
        const sound = this[name];
        // Check if a valid sound was found for the given name
        if (sound) {
            // Restart sound
            sound.currentTime = 0;
            // Play the sound
            sound.play();
        }
    }
}

/**
 * Collapse the Bootstrap navbar when clicking outside of the open menu
 */
// Reference: https://stackoverflow.com/questions/74670132
function setupOutsideNavbarCollapse() {
    // Listen for any click on the entire document
    document.addEventListener("click", function (event) {
        // Set the collapsible navbar element
        const navbarCollapse = $("#navbar-content");
        // Return early if navbar content element is not found in the DOM
        // Reference: https://www.sitepoint.com/jquery-check-element-exists/
        if (!navbarCollapse.length) return;
        // Check if the click happened inside the navbar content 
        // Reference: https://stackoverflow.com/questions/62375324
        const isClickInsideNavbar = $(event.target).closest("#navbar-content").length > 0;
        // Check if the click target is the navbar toggler or inside 
        // Reference: https://stackoverflow.com/questions/46736823
        const isNavbarToggler = $(event.target).is(".navbar-toggler") || $(event.target).closest(".navbar-toggler").length > 0;
        // If the click is outside both the navbar and toggler, and the navbar is expanded
        if (!isClickInsideNavbar && !isNavbarToggler && $navbarCollapse.hasClass("show")) {
            
        }
    });
}