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
 * Collapse the Bootstrap navbar when a nav-link is clicked
 */
// Reference: https://stackoverflow.com/questions/62375324
function setupNavLinkCollapse() {
    // Declare variable that selects all nav links in navbar
    const links = document.querySelectorAll(".navbar-collapse .nav-link");
    // Attach a click event to all nav links inside the collapsed navbar
    links.forEach(function (link) {
        link.addEventListener("click", function (event) {
            // Set the href attribute of the clicked nav link
            const href = $(this).attr("href");
            // Set the target section based on the href
            const section = $(href);
    });
});
}